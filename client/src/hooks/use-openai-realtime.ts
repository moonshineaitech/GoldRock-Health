import { useCallback, useEffect, useRef, useState } from "react";

export type RealtimeConnectionStatus =
  | "idle"
  | "requesting-microphone"
  | "requesting-token"
  | "negotiating"
  | "connected"
  | "error";

export interface RealtimeTranscriptEvent {
  id: string;
  role: "applicant" | "assistant";
  text: string;
  createdAt: string;
}

interface RealtimeEvent {
  type: string;
  event_id?: string;
  transcript?: string;
  delta?: string;
  item_id?: string;
  error?: { message?: string };
}

interface TokenResponse {
  clientSecret: string;
  model: string;
  expiresAt?: number;
}

interface UseOpenAIRealtimeOptions {
  onApplicantTranscript?: (text: string) => void;
  onAssistantTranscript?: (text: string) => void;
  onError?: (message: string) => void;
}

const createEventId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

/**
 * Browser WebRTC client for OpenAI Realtime.
 *
 * The hook only receives a short-lived credential minted by our backend. The
 * permanent OpenAI key never reaches the browser. It also keeps the transport
 * concerns separate from the enrollment state machine so the same experience
 * can fall back to browser speech recognition or text input.
 */
export function useOpenAIRealtime(options: UseOpenAIRealtimeOptions = {}) {
  const [status, setStatus] = useState<RealtimeConnectionStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [events, setEvents] = useState<RealtimeTranscriptEvent[]>([]);
  const [isAssistantSpeaking, setIsAssistantSpeaking] = useState(false);
  const [isApplicantSpeaking, setIsApplicantSpeaking] = useState(false);

  const peerRef = useRef<RTCPeerConnection | null>(null);
  const channelRef = useRef<RTCDataChannel | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const optionsRef = useRef(options);
  const assistantBufferRef = useRef("");

  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  const addTranscript = useCallback(
    (role: RealtimeTranscriptEvent["role"], text: string) => {
      const cleaned = text.trim();
      if (!cleaned) return;

      setEvents((current) => [
        ...current,
        {
          id: createEventId(),
          role,
          text: cleaned,
          createdAt: new Date().toISOString()
        }
      ]);

      if (role === "applicant") {
        optionsRef.current.onApplicantTranscript?.(cleaned);
      } else {
        optionsRef.current.onAssistantTranscript?.(cleaned);
      }
    },
    []
  );

  const stopMedia = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.srcObject = null;
      audioRef.current = null;
    }
  }, []);

  const disconnect = useCallback(() => {
    channelRef.current?.close();
    channelRef.current = null;

    peerRef.current?.close();
    peerRef.current = null;

    stopMedia();
    assistantBufferRef.current = "";
    setIsAssistantSpeaking(false);
    setIsApplicantSpeaking(false);
    setStatus("idle");
  }, [stopMedia]);

  useEffect(() => {
    return disconnect;
  }, [disconnect]);

  const reportError = useCallback((message: string) => {
    setError(message);
    setStatus("error");
    optionsRef.current.onError?.(message);
  }, []);

  const handleRealtimeEvent = useCallback(
    (event: RealtimeEvent) => {
      switch (event.type) {
        case "input_audio_buffer.speech_started":
          setIsApplicantSpeaking(true);
          break;
        case "input_audio_buffer.speech_stopped":
          setIsApplicantSpeaking(false);
          break;
        case "response.audio.started":
          setIsAssistantSpeaking(true);
          break;
        case "response.audio.done":
          setIsAssistantSpeaking(false);
          break;
        case "conversation.item.input_audio_transcription.completed":
          if (event.transcript) addTranscript("applicant", event.transcript);
          break;
        case "response.audio_transcript.delta":
          assistantBufferRef.current += event.delta || "";
          break;
        case "response.audio_transcript.done":
          if (event.transcript) {
            addTranscript("assistant", event.transcript);
          } else if (assistantBufferRef.current) {
            addTranscript("assistant", assistantBufferRef.current);
          }
          assistantBufferRef.current = "";
          break;
        case "error":
          reportError(event.error?.message || "The live voice session reported an error.");
          break;
      }
    },
    [addTranscript, reportError]
  );

  const sendEvent = useCallback((event: Record<string, unknown>) => {
    const channel = channelRef.current;
    if (!channel || channel.readyState !== "open") return false;
    channel.send(JSON.stringify(event));
    return true;
  }, []);

  const speak = useCallback(
    (instructions: string) =>
      sendEvent({
        type: "response.create",
        response: {
          modalities: ["audio", "text"],
          instructions
        }
      }),
    [sendEvent]
  );

  const interrupt = useCallback(() => {
    sendEvent({ type: "response.cancel" });
    setIsAssistantSpeaking(false);
  }, [sendEvent]);

  const setMuted = useCallback((muted: boolean) => {
    streamRef.current?.getAudioTracks().forEach((track) => {
      track.enabled = !muted;
    });
  }, []);

  const connect = useCallback(async () => {
    if (
      status === "connected" ||
      status === "requesting-microphone" ||
      status === "requesting-token" ||
      status === "negotiating"
    ) {
      return;
    }

    setError(null);

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("This browser does not support microphone access. You can continue by typing.");
      }

      setStatus("requesting-microphone");
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          channelCount: 1
        }
      });
      streamRef.current = stream;

      setStatus("requesting-token");
      const tokenResponse = await fetch("/api/enrollment/realtime-token", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ purpose: "medicare-enrollment" })
      });

      if (!tokenResponse.ok) {
        const body = await tokenResponse.json().catch(() => ({}));
        throw new Error(body.message || "Live AI voice is not available right now.");
      }

      const token = (await tokenResponse.json()) as TokenResponse;
      if (!token.clientSecret || !token.model) {
        throw new Error("The voice service returned an incomplete temporary credential.");
      }

      setStatus("negotiating");
      const peer = new RTCPeerConnection();
      peerRef.current = peer;

      const remoteAudio = new Audio();
      remoteAudio.autoplay = true;
      remoteAudio.setAttribute("playsinline", "true");
      audioRef.current = remoteAudio;

      peer.ontrack = (event) => {
        remoteAudio.srcObject = event.streams[0];
        void remoteAudio.play().catch(() => {
          reportError("Your browser blocked audio playback. Tap the voice button and try again.");
        });
      };

      peer.onconnectionstatechange = () => {
        if (["failed", "disconnected", "closed"].includes(peer.connectionState)) {
          if (peer.connectionState === "failed") {
            reportError("The live voice connection was interrupted. Your confirmed answers are safe.");
          } else if (status === "connected") {
            disconnect();
          }
        }
      };

      stream.getTracks().forEach((track) => peer.addTrack(track, stream));

      const channel = peer.createDataChannel("oai-events", { ordered: true });
      channelRef.current = channel;

      channel.onmessage = (message) => {
        try {
          handleRealtimeEvent(JSON.parse(message.data) as RealtimeEvent);
        } catch {
          // Ignore malformed transport events without disrupting the intake.
        }
      };

      const channelReady = new Promise<void>((resolve, reject) => {
        channel.onopen = () => resolve();
        channel.onerror = () => reject(new Error("The voice event channel could not open."));
      });

      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);

      const sdpResponse = await fetch(
        `https://api.openai.com/v1/realtime/calls?model=${encodeURIComponent(token.model)}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token.clientSecret}`,
            "Content-Type": "application/sdp"
          },
          body: offer.sdp
        }
      );

      if (!sdpResponse.ok) {
        throw new Error("OpenAI could not establish the secure speech connection.");
      }

      await peer.setRemoteDescription({
        type: "answer",
        sdp: await sdpResponse.text()
      });
      await channelReady;
      setStatus("connected");
    } catch (cause) {
      stopMedia();
      peerRef.current?.close();
      peerRef.current = null;
      channelRef.current = null;
      reportError(cause instanceof Error ? cause.message : "The live voice session could not start.");
    }
  }, [disconnect, handleRealtimeEvent, reportError, status, stopMedia]);

  const clearTranscript = useCallback(() => setEvents([]), []);

  return {
    status,
    error,
    events,
    isConnected: status === "connected",
    isConnecting: [
      "requesting-microphone",
      "requesting-token",
      "negotiating"
    ].includes(status),
    isAssistantSpeaking,
    isApplicantSpeaking,
    connect,
    disconnect,
    speak,
    interrupt,
    setMuted,
    clearTranscript
  };
}
