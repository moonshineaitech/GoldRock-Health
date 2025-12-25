import { useMutation, useQuery } from "@tanstack/react-query";
import type { Prediction } from "@shared/schema";

interface FoldSequenceRequest {
  sequence: string;
}

interface UploadAF3Request {
  pdbContent: string;
  confidenceJson?: string;
  sequence?: string;
}

export interface SequenceAnalysis {
  isValid: boolean;
  length: number;
  composition: { [key: string]: number };
  predictedProperties: {
    hydrophobicity: number;
    isoelectricPoint: number;
    molecularWeight: number;
    instabilityIndex: number;
  };
  motifs: Array<{
    name: string;
    position: [number, number];
    confidence: number;
    description: string;
  }>;
  secondaryStructure: {
    alphaHelix: number;
    betaSheet: number;
    coil: number;
    turn: number;
  };
  disorderedRegions: Array<[number, number]>;
  functionalAnnotations: string[];
}

export interface PredictionWithAnalysis extends Prediction {
  analysis?: SequenceAnalysis;
  explanation?: string;
}

interface NoStructureError {
  error: string;
  message: string;
  requiresUpload: boolean;
  sequence: string;
  analysis?: SequenceAnalysis;
}

export function useFoldSequence() {
  return useMutation({
    mutationFn: async (data: FoldSequenceRequest): Promise<PredictionWithAnalysis | NoStructureError> => {
      const response = await fetch("/api/predictions/fold", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        if (result.error === "no_precomputed_structure") {
          return result as NoStructureError;
        }
        throw new Error(result.error || "Failed to fold sequence");
      }
      
      return result as PredictionWithAnalysis;
    },
  });
}

export function useUploadAF3() {
  return useMutation({
    mutationFn: async (data: UploadAF3Request): Promise<PredictionWithAnalysis> => {
      const response = await fetch("/api/predictions/upload-af3", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to process AF3 upload");
      }
      
      return response.json();
    },
  });
}

export function usePrediction(id: number | null) {
  return useQuery({
    queryKey: ["prediction", id],
    queryFn: async (): Promise<Prediction> => {
      const response = await fetch(`/api/predictions/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch prediction");
      }
      return response.json();
    },
    enabled: id !== null,
  });
}

export function useRecentPredictions(limit = 10) {
  return useQuery({
    queryKey: ["predictions", limit],
    queryFn: async (): Promise<Prediction[]> => {
      const response = await fetch(`/api/predictions?limit=${limit}`);
      if (!response.ok) {
        throw new Error("Failed to fetch predictions");
      }
      return response.json();
    },
  });
}

export function isNoStructureError(result: any): result is NoStructureError {
  return result && result.requiresUpload === true;
}

export function useFoldByUniprotId() {
  return useMutation({
    mutationFn: async (uniprotId: string): Promise<PredictionWithAnalysis | NoStructureError> => {
      const response = await fetch("/api/predictions/fold", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sequence: uniprotId }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        if (result.error === "no_precomputed_structure") {
          return result as NoStructureError;
        }
        throw new Error(result.error || "Failed to load protein");
      }
      
      return result as PredictionWithAnalysis;
    },
  });
}
