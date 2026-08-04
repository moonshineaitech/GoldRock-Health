import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  Circle,
  ClipboardCheck,
  Download,
  FileCheck2,
  FileText,
  Headphones,
  Info,
  Keyboard,
  Loader2,
  LockKeyhole,
  MessageCircleQuestion,
  Mic,
  MicOff,
  Pause,
  Pencil,
  Play,
  Printer,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Volume2,
  X,
  XCircle
} from "lucide-react";
import { MobileLayout } from "@/components/mobile-layout";
import { EnrollmentPortalHandoff } from "@/components/enrollment-portal-handoff";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useVoice } from "@/hooks/use-voice";
import { useOpenAIRealtime } from "@/hooks/use-openai-realtime";
import {
  auditConversation,
  buildEnrollmentPacket,
  createAnswer,
  ENROLLMENT_QUESTIONS,
  ENROLLMENT_SECTIONS,
  type AnswerSource,
  type EnrollmentAnswer,
  type EnrollmentAnswerMap,
  type EnrollmentQuestion,
  type ValidationIssue
} from "@shared/enrollment-workflow";

const STORAGE_KEY = "goldrock-enrollment-concierge-v2";

type Screen = "welcome" | "conversation" | "review" | "packet";
type InputMode = "voice" | "text";

interface SavedIntake {
  version: 2;
  currentQuestionId: string;
  answers: EnrollmentAnswerMap;
  savedAt: string;
}

const DEMO_VALUES: Record<string, string> = {
  coverage_goal: "medicare",
  life_event: "I am turning 65 and retiring this fall.",
  deadline: "My employer coverage ends September 30, 2026.",
  date_of_birth: "1961-01-14",
  state: "Colorado",
  zip_code: "80202",
  current_coverage: "Employer PPO coverage through September 30, 2026.",
  medicare_status: "none",
  employer_coverage: "Coverage is through my own active employment until I retire.",
  household_size: "2",
  annual_income: "$42,000",
  preferred_doctors: "I want to keep Dr. Chen and St. Joseph Hospital.",
  prescriptions: "Eliquis 5 mg twice daily and metformin.",
  accessibility: "Please use large print and include my daughter in the final review.",
  submission_consent: "yes"
};

function safeLoadIntake(): SavedIntake | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SavedIntake;
    return parsed.version === 2 ? parsed : null;
  } catch {
    return null;
  }
}

function saveIntake(questionId: string, answers: EnrollmentAnswerMap) {
  const value: SavedIntake = {
    version: 2,
    currentQuestionId: questionId,
    answers,
    savedAt: new Date().toISOString()
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
}

function downloadJson(filename: string, value: unknown) {
  const blob = new Blob([JSON.stringify(value, null, 2)], {
    type: "application/json"
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function sectionForQuestion(question: EnrollmentQuestion) {
  return ENROLLMENT_SECTIONS.find((section) => section.id === question.section)!;
}

function issueIcon(severity: ValidationIssue["severity"]) {
  if (severity === "blocking") return XCircle;
  if (severity === "warning") return AlertTriangle;
  return Info;
}

function issueColor(severity: ValidationIssue["severity"]) {
  if (severity === "blocking") return "border-red-200 bg-red-50 text-red-950";
  if (severity === "warning") return "border-amber-200 bg-amber-50 text-amber-950";
  return "border-blue-200 bg-blue-50 text-blue-950";
}

function ChoiceGrid({
  question,
  value,
  onChange
}: {
  question: EnrollmentQuestion;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {question.choices?.map((choice) => {
        const selected = value === choice.value;
        return (
          <button
            key={choice.value}
            type="button"
            onClick={() => onChange(choice.value)}
            className={`rounded-2xl border-2 p-4 text-left transition-all ${
              selected
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-border bg-background hover:border-primary/40"
            }`}
          >
            <div className="flex items-start gap-3">
              <span
                className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border ${
                  selected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-muted-foreground/40"
                }`}
              >
                {selected && <Check className="h-3 w-3" />}
              </span>
              <span>
                <span className="block font-medium">{choice.label}</span>
                {choice.description && (
                  <span className="mt-1 block text-xs text-muted-foreground">
                    {choice.description}
                  </span>
                )}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function VoiceOrb({
  active,
  speaking,
  label
}: {
  active: boolean;
  speaking: boolean;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-3 py-3">
      <div className="relative grid h-24 w-24 place-items-center">
        {(active || speaking) && (
          <>
            <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/20" />
            <span className="absolute inset-2 animate-pulse rounded-full bg-emerald-400/25" />
          </>
        )}
        <div
          className={`relative grid h-20 w-20 place-items-center rounded-full shadow-xl transition-colors ${
            speaking
              ? "bg-primary text-primary-foreground"
              : active
                ? "bg-emerald-500 text-white"
                : "bg-slate-900 text-white"
          }`}
        >
          {speaking ? (
            <Volume2 className="h-8 w-8" />
          ) : active ? (
            <Mic className="h-8 w-8" />
          ) : (
            <Headphones className="h-8 w-8" />
          )}
        </div>
      </div>
      <p className="text-sm font-medium">{label}</p>
    </div>
  );
}

function PrivacyBoundary() {
  return (
    <Card className="overflow-hidden border-slate-800 bg-slate-950 text-white">
      <CardContent className="p-5">
        <div className="flex items-center gap-2 font-semibold">
          <LockKeyhole className="h-4 w-4 text-emerald-400" />
          Privacy boundary
        </div>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          Goldie never asks for Social Security numbers, Medicare IDs, passwords,
          bank details, signatures, or complete document numbers in the AI voice
          conversation.
        </p>
        <Separator className="my-4 bg-white/10" />
        <div className="space-y-2 text-xs text-slate-400">
          <p className="flex gap-2">
            <Check className="h-4 w-4 shrink-0 text-emerald-400" />
            Permanent OpenAI credentials remain on the server.
          </p>
          <p className="flex gap-2">
            <Check className="h-4 w-4 shrink-0 text-emerald-400" />
            High-risk identifiers stay out of the Realtime session.
          </p>
          <p className="flex gap-2">
            <Check className="h-4 w-4 shrink-0 text-emerald-400" />
            The applicant reviews and controls final submission.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function WelcomeScreen({
  hasSavedDraft,
  onStart,
  onResume,
  onDemo
}: {
  hasSavedDraft: boolean;
  onStart: () => void;
  onResume: () => void;
  onDemo: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-[2rem] border bg-card shadow-2xl">
      <div className="grid lg:grid-cols-[1.15fr_.85fr]">
        <div className="p-7 sm:p-10 lg:p-14">
          <div className="mb-6 flex flex-wrap gap-2">
            <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
              <Sparkles className="mr-1 h-3 w-3" /> Goldie Enrollment Concierge
            </Badge>
            <Badge variant="outline">Voice-first</Badge>
            <Badge variant="outline">Human-confirmed</Badge>
          </div>

          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            A calmer way to finish a complicated enrollment.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            Goldie asks one plain-language question at a time, reads important
            answers back, catches contradictions, and prepares a reviewable
            handoff packet without silently signing or submitting for you.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" onClick={onStart}>
              <Mic className="mr-2 h-5 w-5" />
              Start guided conversation
            </Button>
            {hasSavedDraft && (
              <Button size="lg" variant="outline" onClick={onResume}>
                <Play className="mr-2 h-5 w-5" />
                Resume saved intake
              </Button>
            )}
            <Button size="lg" variant="ghost" onClick={onDemo}>
              <Sparkles className="mr-2 h-5 w-5" />
              Load presentation demo
            </Button>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: MessageCircleQuestion,
                title: "One question",
                body: "No intimidating wall of form fields."
              },
              {
                icon: UserCheck,
                title: "Read it back",
                body: "Dates, coverage, and money are confirmed."
              },
              {
                icon: ClipboardCheck,
                title: "Audit the whole",
                body: "Cross-answer checks run before export."
              }
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border bg-muted/30 p-4">
                <item.icon className="h-5 w-5 text-primary" />
                <p className="mt-3 font-semibold">{item.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{item.body}</p>
              </div>
            ))}
          </div>

          <p className="mt-8 text-xs leading-5 text-muted-foreground">
            GoldRock Health is not Medicare, a government agency, or an insurance
            carrier. This workflow provides educational and administrative
            assistance, not legal advice or a recommendation to choose a specific plan.
          </p>
        </div>

        <div className="relative min-h-[440px] overflow-hidden bg-slate-950 p-8 text-white lg:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_25%,rgba(16,185,129,.30),transparent_48%)]" />
          <div className="relative flex h-full flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-400 text-slate-950">
                  <Volume2 />
                </div>
                <div>
                  <p className="font-semibold">Goldie</p>
                  <p className="text-sm text-slate-300">Enrollment advocate</p>
                </div>
              </div>
              <span className="flex items-center gap-2 text-xs text-emerald-300">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                Ready
              </span>
            </div>

            <div className="my-10 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.18em] text-emerald-300">
                Goldie asks
              </p>
              <p className="mt-3 text-2xl font-medium leading-9">
                “What is changing that makes you need coverage now?”
              </p>
              <div className="mt-5 flex items-center gap-3 text-sm text-slate-300">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                  <Mic className="h-4 w-4" />
                </span>
                Speak naturally or type instead
              </div>
            </div>

            <div className="space-y-3">
              {[
                "15 guided enrollment questions",
                "Deterministic relevance and contradiction checks",
                "Editable applicant review",
                "Portable, applicant-controlled handoff packet"
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
                >
                  <Check className="h-4 w-4 text-emerald-400" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ApplicationMap({
  currentQuestionIndex,
  answers,
  onSelect
}: {
  currentQuestionIndex: number;
  answers: EnrollmentAnswerMap;
  onSelect: (index: number) => void;
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Application map</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {ENROLLMENT_SECTIONS.map((section) => {
            const questions = ENROLLMENT_QUESTIONS
              .map((question, index) => ({ question, index }))
              .filter(({ question }) => question.section === section.id);
            const complete = questions.filter(
              ({ question }) => answers[question.id]?.confirmed
            ).length;

            return (
              <div key={section.id}>
                <div className="mb-2 flex items-center justify-between text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  <span>{section.eyebrow}</span>
                  <span>{complete}/{questions.length}</span>
                </div>
                <div className="space-y-1">
                  {questions.map(({ question, index }) => {
                    const confirmed = answers[question.id]?.confirmed;
                    const current = index === currentQuestionIndex;
                    return (
                      <button
                        key={question.id}
                        type="button"
                        onClick={() => onSelect(index)}
                        className={`flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left text-sm transition-colors ${
                          current ? "bg-primary/10 text-primary" : "hover:bg-muted"
                        }`}
                      >
                        <span
                          className={`grid h-6 w-6 shrink-0 place-items-center rounded-full ${
                            confirmed
                              ? "bg-emerald-100 text-emerald-700"
                              : current
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {confirmed ? (
                            <Check className="h-3.5 w-3.5" />
                          ) : (
                            <span className="text-[10px] font-bold">{index + 1}</span>
                          )}
                        </span>
                        <span className="truncate">{question.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function AnswerReadback({
  answer,
  question,
  onConfirm,
  onEdit
}: {
  answer: EnrollmentAnswer;
  question: EnrollmentQuestion;
  onConfirm: () => void;
  onEdit: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border-2 border-primary/20 bg-primary/[0.035] p-5"
    >
      <div className="flex items-center gap-2 text-sm font-medium text-primary">
        <Volume2 className="h-4 w-4" />
        Goldie’s readback
      </div>
      <p className="mt-3 text-xl font-medium leading-8">
        “{answer.normalizedValue}”
      </p>
      <p className="mt-3 text-sm text-muted-foreground">
        Is that accurate and relevant to <strong>{question.title.toLowerCase()}</strong>?
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        <Button onClick={onConfirm}>
          <Check className="mr-2 h-4 w-4" />
          Yes, that’s right
        </Button>
        <Button variant="outline" onClick={onEdit}>
          <Pencil className="mr-2 h-4 w-4" />
          Change my answer
        </Button>
      </div>
    </motion.div>
  );
}

function ConversationScreen({
  questionIndex,
  setQuestionIndex,
  answers,
  setAnswers,
  onReview
}: {
  questionIndex: number;
  setQuestionIndex: (index: number) => void;
  answers: EnrollmentAnswerMap;
  setAnswers: React.Dispatch<React.SetStateAction<EnrollmentAnswerMap>>;
  onReview: () => void;
}) {
  const { toast } = useToast();
  const question = ENROLLMENT_QUESTIONS[questionIndex];
  const section = sectionForQuestion(question);
  const existingAnswer = answers[question.id];
  const [draft, setDraft] = useState(existingAnswer?.normalizedValue || "");
  const [inputMode, setInputMode] = useState<InputMode>("voice");
  const [editing, setEditing] = useState(!existingAnswer);
  const [localIssues, setLocalIssues] = useState<ValidationIssue[]>([]);
  const hasPromptedRealtime = useRef<string | null>(null);

  const browserVoice = useVoice({ continuous: false, interimResults: true });
  const realtime = useOpenAIRealtime({
    onApplicantTranscript: (text) => {
      setDraft(text);
      setInputMode("voice");
    },
    onError: (message) => {
      toast({
        title: "Live voice switched off",
        description: `${message} You can keep going with browser voice or typing.`
      });
    }
  });

  useEffect(() => {
    setDraft(existingAnswer?.normalizedValue || "");
    setEditing(!existingAnswer || !existingAnswer.confirmed);
    setInputMode(question.private ? "text" : "voice");
    setLocalIssues([]);
    browserVoice.resetTranscript();
    hasPromptedRealtime.current = null;
    if (question.private && realtime.isConnected) {
      realtime.disconnect();
    }
  }, [question.id]);

  useEffect(() => {
    if (browserVoice.transcript) {
      setDraft(browserVoice.transcript);
      setInputMode("voice");
    }
  }, [browserVoice.transcript]);

  useEffect(() => {
    if (
      realtime.isConnected &&
      hasPromptedRealtime.current !== question.id
    ) {
      hasPromptedRealtime.current = question.id;
      realtime.speak(
        `Ask exactly this enrollment question in a warm, concise way: "${question.prompt}" ` +
        `If useful, explain: "${question.rationale}" Do not answer it for the applicant. ` +
        `Wait for their answer and do not move to another topic.`
      );
    }
  }, [question.id, question.prompt, question.rationale, realtime.isConnected]);

  const confirmedRequired = ENROLLMENT_QUESTIONS.filter(
    (item) => item.required && answers[item.id]?.confirmed
  ).length;
  const totalRequired = ENROLLMENT_QUESTIONS.filter((item) => item.required).length;
  const progress = Math.round((confirmedRequired / totalRequired) * 100);

  const captureAnswer = (source: AnswerSource) => {
    const issues = question.validate(draft, answers);
    setLocalIssues(issues);
    if (issues.some((issue) => issue.severity === "blocking")) return;

    const answer = createAnswer(
      question,
      draft,
      source,
      source === "voice" ? browserVoice.confidence : undefined
    );
    setAnswers((current) => ({ ...current, [question.id]: answer }));
    setEditing(false);

    if (realtime.isConnected) {
      realtime.speak(
        `Read this answer back exactly and ask whether it is correct: "${answer.normalizedValue}". ` +
        `Do not add new facts or proceed to another question.`
      );
    }
  };

  const confirmAnswer = () => {
    setAnswers((current) => ({
      ...current,
      [question.id]: {
        ...current[question.id],
        confirmed: true,
        confirmedAt: new Date().toISOString()
      }
    }));

    if (questionIndex === ENROLLMENT_QUESTIONS.length - 1) {
      onReview();
    } else {
      setQuestionIndex(questionIndex + 1);
    }
  };

  const goBack = () => {
    if (questionIndex > 0) setQuestionIndex(questionIndex - 1);
  };

  const skipOptional = () => {
    if (question.required) return;
    setAnswers((current) => ({
      ...current,
      [question.id]: {
        ...createAnswer(question, "Skipped by applicant", "text"),
        confirmed: true,
        confirmedAt: new Date().toISOString()
      }
    }));
    if (questionIndex === ENROLLMENT_QUESTIONS.length - 1) onReview();
    else setQuestionIndex(questionIndex + 1);
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
      <main className="rounded-[2rem] border bg-card p-5 shadow-xl sm:p-8 lg:p-10">
        <div className="mb-8">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium">
              Question {questionIndex + 1} of {ENROLLMENT_QUESTIONS.length}
            </span>
            <span className="text-muted-foreground">{progress}% confirmed</span>
          </div>
          <Progress value={progress} />
          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <span>Draft saves on this device</span>
            <span>{confirmedRequired}/{totalRequired} required answers</span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.22 }}
          >
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">{section.eyebrow}</Badge>
              {question.required ? (
                <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100">Required</Badge>
              ) : (
                <Badge variant="secondary">Optional</Badge>
              )}
              {question.private && (
                <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                  <LockKeyhole className="mr-1 h-3 w-3" /> Protected field
                </Badge>
              )}
            </div>

            <h2 className="mt-5 max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">
              {question.prompt}
            </h2>
            <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
              {question.rationale}
            </p>

            {question.private && (
              <Alert className="mt-5 border-emerald-200 bg-emerald-50">
                <LockKeyhole className="h-4 w-4" />
                <AlertTitle>Local-only answer</AlertTitle>
                <AlertDescription>
                  Voice input is paused for this sensitive question. Type the answer so it
                  is not streamed to OpenAI or a browser speech-recognition provider.
                </AlertDescription>
              </Alert>
            )}

            {editing ? (
              <div className="mt-8">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                  <div className="inline-flex rounded-xl border bg-muted p-1">
                    <Button
                      type="button"
                      size="sm"
                      variant={inputMode === "voice" ? "default" : "ghost"}
                      onClick={() => setInputMode("voice")}
                      disabled={question.private}
                    >
                      <Mic className="mr-2 h-4 w-4" /> Voice
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant={inputMode === "text" ? "default" : "ghost"}
                      onClick={() => setInputMode("text")}
                    >
                      <Keyboard className="mr-2 h-4 w-4" /> Type
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Example: “{question.example}”
                  </p>
                </div>

                {inputMode === "voice" && !question.private && (
                  <div className="mb-5 rounded-3xl border-2 border-primary/15 bg-primary/[0.025] p-5">
                    <VoiceOrb
                      active={browserVoice.isListening || realtime.isApplicantSpeaking}
                      speaking={realtime.isAssistantSpeaking}
                      label={
                        realtime.isAssistantSpeaking
                          ? "Goldie is speaking"
                          : browserVoice.isListening || realtime.isApplicantSpeaking
                            ? "Listening…"
                            : realtime.isConnected
                              ? "Live AI voice connected"
                              : "Ready for your answer"
                      }
                    />

                    <div className="flex flex-wrap justify-center gap-2">
                      <Button
                        className={browserVoice.isListening ? "bg-red-600 hover:bg-red-700" : ""}
                        onClick={() => {
                          if (browserVoice.isListening) browserVoice.stopListening();
                          else browserVoice.startListening();
                        }}
                        disabled={!browserVoice.isSupported || realtime.isConnected}
                      >
                        {browserVoice.isListening ? (
                          <MicOff className="mr-2 h-4 w-4" />
                        ) : (
                          <Mic className="mr-2 h-4 w-4" />
                        )}
                        {browserVoice.isListening ? "Stop listening" : "Browser voice"}
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => {
                          if (realtime.isConnected) realtime.disconnect();
                          else void realtime.connect();
                        }}
                        disabled={realtime.isConnecting}
                      >
                        {realtime.isConnecting ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : realtime.isConnected ? (
                          <Pause className="mr-2 h-4 w-4" />
                        ) : (
                          <Sparkles className="mr-2 h-4 w-4" />
                        )}
                        {realtime.isConnecting
                          ? "Connecting…"
                          : realtime.isConnected
                            ? "End live AI voice"
                            : "Live AI conversation"}
                      </Button>

                      {realtime.isAssistantSpeaking && (
                        <Button variant="ghost" onClick={realtime.interrupt}>
                          <X className="mr-2 h-4 w-4" /> Interrupt
                        </Button>
                      )}
                    </div>

                    {(browserVoice.error || realtime.error) && (
                      <Alert className="mt-4 border-amber-200 bg-amber-50">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Voice is unavailable</AlertTitle>
                        <AlertDescription>
                          {realtime.error || browserVoice.error} You can continue by typing.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}

                {question.input === "choice" ? (
                  <ChoiceGrid question={question} value={draft} onChange={setDraft} />
                ) : question.input === "multiline" ? (
                  <Textarea
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    placeholder={question.example}
                    className="min-h-32 rounded-2xl p-4 text-base"
                  />
                ) : (
                  <Input
                    type={question.input === "date" ? "date" : question.input === "number" ? "number" : "text"}
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    placeholder={question.example}
                    className="h-14 rounded-2xl px-4 text-base"
                  />
                )}

                {localIssues.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {localIssues.map((issue) => {
                      const Icon = issueIcon(issue.severity);
                      return (
                        <div
                          key={issue.id}
                          className={`flex gap-3 rounded-xl border p-4 ${issueColor(issue.severity)}`}
                        >
                          <Icon className="mt-0.5 h-5 w-5 shrink-0" />
                          <div>
                            <p className="font-medium">{issue.title}</p>
                            <p className="mt-1 text-sm">{issue.message}</p>
                            <p className="mt-2 text-xs font-medium">Next: {issue.resolution}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Button
                    size="lg"
                    onClick={() => captureAnswer(inputMode === "voice" ? "voice" : "text")}
                    disabled={!draft.trim()}
                  >
                    Use this answer
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  {!question.required && (
                    <Button variant="ghost" onClick={skipOptional}>Skip optional question</Button>
                  )}
                </div>
              </div>
            ) : existingAnswer ? (
              <div className="mt-8">
                <AnswerReadback
                  answer={existingAnswer}
                  question={question}
                  onConfirm={confirmAnswer}
                  onEdit={() => setEditing(true)}
                />
              </div>
            ) : null}

            <div className="mt-9 flex items-center justify-between border-t pt-5">
              <Button variant="ghost" onClick={goBack} disabled={questionIndex === 0}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              <Button variant="ghost" onClick={onReview}>
                Review all answers
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      <aside className="space-y-5">
        <ApplicationMap
          currentQuestionIndex={questionIndex}
          answers={answers}
          onSelect={setQuestionIndex}
        />
        <PrivacyBoundary />
        {realtime.events.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Conversation transcript</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-48 pr-3">
                <div className="space-y-3">
                  {realtime.events.map((event) => (
                    <div key={event.id} className="text-sm">
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        {event.role === "assistant" ? "Goldie" : "You"}
                      </p>
                      <p className="mt-1 leading-5">{event.text}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        )}
      </aside>
    </div>
  );
}

function AuditSummary({ audit }: { audit: ReturnType<typeof auditConversation> }) {
  const scoreColor = audit.ready
    ? "text-emerald-700"
    : audit.score >= 70
      ? "text-amber-700"
      : "text-red-700";

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="grid items-center gap-6 sm:grid-cols-[150px_1fr]">
          <div className="text-center">
            <div className={`text-5xl font-bold ${scoreColor}`}>{audit.score}</div>
            <p className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">
              readiness score
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2">
              {audit.ready ? (
                <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              ) : (
                <AlertTriangle className="h-6 w-6 text-amber-600" />
              )}
              <h3 className="text-xl font-semibold">
                {audit.ready ? "Ready for applicant review" : "A few things need attention"}
              </h3>
            </div>
            <p className="mt-2 text-muted-foreground">{audit.summary}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <Badge variant="outline">
                {audit.confirmedCount}/{audit.totalRequired} required confirmed
              </Badge>
              <Badge variant="outline">
                {audit.issues.filter((issue) => issue.severity === "blocking").length} blocking
              </Badge>
              <Badge variant="outline">
                {audit.issues.filter((issue) => issue.severity === "warning").length} warnings
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ReviewScreen({
  answers,
  onEdit,
  onBack,
  onPreparePacket
}: {
  answers: EnrollmentAnswerMap;
  onEdit: (questionIndex: number) => void;
  onBack: () => void;
  onPreparePacket: () => void;
}) {
  const audit = useMemo(() => auditConversation(answers), [answers]);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <Badge className="bg-primary/10 text-primary hover:bg-primary/10">
            Whole-conversation check
          </Badge>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">Review before anything leaves GoldRock</h1>
          <p className="mt-3 max-w-3xl text-muted-foreground">
            This deterministic audit checks required answers, confirmation status,
            formats, and cross-answer assumptions. AI can help explain an issue,
            but it is not the only validator.
          </p>
        </div>
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to conversation
        </Button>
      </div>

      <AuditSummary audit={audit} />

      {audit.issues.length > 0 && (
        <Card className="mt-5">
          <CardHeader>
            <CardTitle>Items to resolve</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {audit.issues.map((issue) => {
              const Icon = issueIcon(issue.severity);
              const questionIndex = ENROLLMENT_QUESTIONS.findIndex(
                (question) => question.id === issue.questionId
              );
              return (
                <div
                  key={issue.id}
                  className={`rounded-2xl border p-4 ${issueColor(issue.severity)}`}
                >
                  <div className="flex items-start gap-3">
                    <Icon className="mt-0.5 h-5 w-5 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold">{issue.title}</p>
                        <Badge variant="outline" className="capitalize">{issue.severity}</Badge>
                      </div>
                      <p className="mt-1 text-sm">{issue.message}</p>
                      <p className="mt-2 text-xs font-medium">Resolution: {issue.resolution}</p>
                    </div>
                    {questionIndex >= 0 && (
                      <Button size="sm" variant="outline" onClick={() => onEdit(questionIndex)}>
                        Fix
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      <div className="mt-5 space-y-5">
        {ENROLLMENT_SECTIONS.map((section) => {
          const sectionQuestions = ENROLLMENT_QUESTIONS
            .map((question, index) => ({ question, index }))
            .filter(({ question }) => question.section === section.id);
          return (
            <Card key={section.id}>
              <CardHeader>
                <div className="text-xs font-medium uppercase tracking-wide text-primary">
                  {section.eyebrow}
                </div>
                <CardTitle>{section.title}</CardTitle>
              </CardHeader>
              <CardContent className="divide-y">
                {sectionQuestions.map(({ question, index }) => {
                  const answer = answers[question.id];
                  return (
                    <div key={question.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                      <span
                        className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full ${
                          answer?.confirmed
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {answer?.confirmed ? <Check className="h-4 w-4" /> : <Circle className="h-3 w-3" />}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            {question.title}
                          </p>
                          {question.private && (
                            <LockKeyhole className="h-3 w-3 text-emerald-700" />
                          )}
                        </div>
                        <p className="mt-1 font-medium">
                          {answer?.normalizedValue || "Not answered"}
                        </p>
                      </div>
                      <Button size="icon" variant="ghost" onClick={() => onEdit(index)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="sticky bottom-4 mt-7 rounded-2xl border bg-background/95 p-4 shadow-xl backdrop-blur">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <p className="font-semibold">
              {audit.ready ? "The packet can be prepared." : "Resolve blocking items before export."}
            </p>
            <p className="text-sm text-muted-foreground">
              Final attestation and portal submission remain applicant-controlled.
            </p>
          </div>
          <Button size="lg" disabled={!audit.ready} onClick={onPreparePacket}>
            <FileCheck2 className="mr-2 h-5 w-5" /> Prepare handoff packet
          </Button>
        </div>
      </div>
    </div>
  );
}

function PacketScreen({
  answers,
  onEdit
}: {
  answers: EnrollmentAnswerMap;
  onEdit: () => void;
}) {
  const packet = useMemo(() => buildEnrollmentPacket(answers), [answers]);
  const audit = useMemo(() => auditConversation(answers), [answers]);
  const [attested, setAttested] = useState(false);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="overflow-hidden rounded-[2rem] border bg-card shadow-xl">
        <div className="bg-slate-950 p-7 text-white sm:p-10">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-start">
            <div>
              <Badge className="bg-emerald-400 text-slate-950 hover:bg-emerald-400">
                <CheckCircle2 className="mr-1 h-3 w-3" /> Conversation validated
              </Badge>
              <h1 className="mt-5 text-4xl font-semibold tracking-tight">Enrollment handoff packet</h1>
              <p className="mt-3 max-w-2xl text-slate-300">
                A portable, reviewable summary mapped to the questions the applicant
                actually answered—not a silent submission or electronic signature.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm">
              <p className="text-slate-400">Packet version</p>
              <p className="font-mono font-medium">{packet.packetVersion}</p>
              <p className="mt-2 text-slate-400">Status</p>
              <p className="font-medium text-emerald-300">Ready for review</p>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-10">
          <Alert className="border-blue-200 bg-blue-50">
            <Info className="h-4 w-4" />
            <AlertTitle>This is a handoff, not proof of enrollment</AlertTitle>
            <AlertDescription>
              The applicant must use an authorized destination, review every field,
              complete any required identity verification, attest, and retain the
              official confirmation receipt.
            </AlertDescription>
          </Alert>

          <div className="mt-7 space-y-7">
            {packet.sections.map((section) => (
              <section key={section.id}>
                <h2 className="text-xl font-semibold">{section.title}</h2>
                <div className="mt-3 overflow-hidden rounded-2xl border">
                  {section.fields.map((field, index) => (
                    <div
                      key={field.id}
                      className={`grid gap-2 p-4 sm:grid-cols-[220px_1fr] ${
                        index ? "border-t" : ""
                      }`}
                    >
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {field.label}
                        {field.sensitive && <LockKeyhole className="h-3 w-3 text-emerald-700" />}
                      </div>
                      <div className="flex items-start gap-2 font-medium">
                        {field.confirmed && (
                          <Check className="mt-1 h-4 w-4 shrink-0 text-emerald-700" />
                        )}
                        {field.value}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border-2 border-primary/20 bg-primary/[0.03] p-5">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={attested}
                onChange={(event) => setAttested(event.target.checked)}
                className="mt-1 h-5 w-5 rounded border"
              />
              <span>
                <span className="font-semibold">Applicant review acknowledgment</span>
                <span className="mt-1 block text-sm leading-6 text-muted-foreground">
                  {packet.attestation.statement} Checking this box does not sign or
                  submit a government or insurance application.
                </span>
              </span>
            </label>
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <Button
              size="lg"
              disabled={!attested}
              onClick={() => downloadJson("goldrock-enrollment-handoff.json", packet)}
            >
              <Download className="mr-2 h-5 w-5" /> Download structured handoff
            </Button>
            <Button size="lg" variant="outline" onClick={() => window.print()}>
              <Printer className="mr-2 h-5 w-5" /> Print applicant copy
            </Button>
            <Button size="lg" variant="ghost" onClick={onEdit}>
              <Pencil className="mr-2 h-5 w-5" /> Edit answers
            </Button>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: ShieldCheck,
                title: "Review",
                text: "Compare every answer with source documents."
              },
              {
                icon: FileText,
                title: "Transfer",
                text: "Use an authorized API or applicant-controlled portal."
              },
              {
                icon: FileCheck2,
                title: "Retain receipt",
                text: "Save the official submission confirmation."
              }
            ].map((step, index) => (
              <div key={step.title} className="rounded-2xl border p-4">
                <div className="flex items-center gap-2">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {index + 1}
                  </span>
                  <step.icon className="h-5 w-5 text-primary" />
                </div>
                <p className="mt-3 font-semibold">{step.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{step.text}</p>
              </div>
            ))}
          </div>

          <EnrollmentPortalHandoff answers={answers} issues={audit.issues} />
        </div>
      </div>
    </div>
  );
}

export default function EnrollmentConcierge() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [answers, setAnswers] = useState<EnrollmentAnswerMap>({});
  const [questionIndex, setQuestionIndex] = useState(0);
  const [savedDraft, setSavedDraft] = useState<SavedIntake | null>(null);

  useEffect(() => {
    setSavedDraft(safeLoadIntake());
  }, []);

  useEffect(() => {
    if (screen === "conversation" || screen === "review") {
      saveIntake(ENROLLMENT_QUESTIONS[questionIndex].id, answers);
      setSavedDraft(safeLoadIntake());
    }
  }, [answers, questionIndex, screen]);

  const startNew = () => {
    setAnswers({});
    setQuestionIndex(0);
    setScreen("conversation");
  };

  const resume = () => {
    if (!savedDraft) return startNew();
    setAnswers(savedDraft.answers);
    const index = ENROLLMENT_QUESTIONS.findIndex(
      (question) => question.id === savedDraft.currentQuestionId
    );
    setQuestionIndex(index >= 0 ? index : 0);
    setScreen("conversation");
  };

  const loadDemo = () => {
    const demoAnswers = Object.fromEntries(
      ENROLLMENT_QUESTIONS.map((question) => {
        const answer = createAnswer(question, DEMO_VALUES[question.id] || "Skipped by applicant", "demo", 0.99);
        return [
          question.id,
          {
            ...answer,
            confirmed: true,
            confirmedAt: new Date().toISOString()
          }
        ];
      })
    );
    setAnswers(demoAnswers);
    setQuestionIndex(0);
    setScreen("review");
  };

  const editQuestion = (index: number) => {
    setQuestionIndex(index);
    setScreen("conversation");
  };

  return (
    <MobileLayout
      title="Enrollment Concierge"
      subtitle="Voice-first, human-confirmed"
      showBottomNav={false}
      className="pb-16"
    >
      <div className="mx-auto max-w-7xl py-5 lg:py-10">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
              <LockKeyhole className="mr-1 h-3 w-3" /> Privacy-first intake
            </Badge>
            <Badge variant="outline">OpenAI Realtime ready</Badge>
            <Badge variant="outline">Applicant-controlled submission</Badge>
          </div>
          {screen !== "welcome" && (
            <Button variant="ghost" size="sm" onClick={() => setScreen("welcome")}>
              <RefreshCcw className="mr-2 h-4 w-4" /> Start or switch demo
            </Button>
          )}
        </div>

        {screen === "welcome" && (
          <WelcomeScreen
            hasSavedDraft={Boolean(savedDraft)}
            onStart={startNew}
            onResume={resume}
            onDemo={loadDemo}
          />
        )}

        {screen === "conversation" && (
          <ConversationScreen
            questionIndex={questionIndex}
            setQuestionIndex={setQuestionIndex}
            answers={answers}
            setAnswers={setAnswers}
            onReview={() => setScreen("review")}
          />
        )}

        {screen === "review" && (
          <ReviewScreen
            answers={answers}
            onEdit={editQuestion}
            onBack={() => setScreen("conversation")}
            onPreparePacket={() => setScreen("packet")}
          />
        )}

        {screen === "packet" && (
          <PacketScreen
            answers={answers}
            onEdit={() => setScreen("review")}
          />
        )}
      </div>
    </MobileLayout>
  );
}
