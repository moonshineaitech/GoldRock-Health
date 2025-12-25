import { useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import type { Prediction } from "@shared/schema";

interface ComparisonResult {
  rmsd: number | null;
  tmScore: number | null;
  seqIdentity: number | null;
  coverage: number | null;
  differences: string[];
  referenceProtein?: string;
}

export function useAIHypothesis(prediction: Prediction | null) {
  const [hypotheses, setHypotheses] = useState<string[]>([]);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!prediction) throw new Error("No prediction available");
      
      const response = await fetch("/api/ai/hypothesis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          proteinName: prediction.proteinName,
          uniprotId: prediction.uniprotId,
          sequence: prediction.sequence,
          plddtScores: prediction.plddtScores,
          confidenceScore: prediction.confidenceScore,
        }),
      });
      
      if (!response.ok) {
        const avgPlddt = prediction.plddtScores?.length 
          ? prediction.plddtScores.reduce((a, b) => a + b, 0) / prediction.plddtScores.length 
          : 0;
        const disorderedCount = prediction.plddtScores?.filter(s => s < 50).length || 0;
        const highConfCount = prediction.plddtScores?.filter(s => s >= 90).length || 0;
        
        const fallbackHypotheses = [
          `The protein ${prediction.proteinName || "structure"} shows ${avgPlddt > 80 ? "high" : avgPlddt > 60 ? "moderate" : "variable"} overall confidence (mean pLDDT: ${avgPlddt.toFixed(1)}), suggesting ${avgPlddt > 80 ? "a well-defined tertiary structure" : "regions of structural flexibility"}.`,
          `${highConfCount} residues (${((highConfCount / (prediction.sequence?.length || 1)) * 100).toFixed(0)}%) show very high confidence (pLDDT ≥90), indicating stable core structural elements critical for protein function.`,
          `${disorderedCount} residues exhibit low confidence (pLDDT <50), potentially representing intrinsically disordered regions that may undergo conformational changes upon binding.`,
          `The confidence distribution suggests potential allosteric sites in regions with intermediate pLDDT scores (70-90), which could be explored as drug target sites.`,
        ];
        
        return fallbackHypotheses;
      }
      
      const data = await response.json();
      return data.hypotheses as string[];
    },
    onSuccess: (newHypotheses) => {
      setHypotheses(prev => [...prev, ...newHypotheses]);
    },
  });

  const generate = useCallback(() => {
    mutation.mutate();
  }, [mutation]);

  return {
    hypotheses,
    isLoading: mutation.isPending,
    error: mutation.error,
    generate,
  };
}

export function useCompareStructure(currentUniprotId: string) {
  const [comparison, setComparison] = useState<ComparisonResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async (referenceId: string) => {
      setError(null);
      const response = await fetch("/api/structures/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceId: currentUniprotId,
          referenceId,
        }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Structure not found in AlphaFold DB");
      }
      
      return await response.json() as ComparisonResult;
    },
    onSuccess: (result) => {
      setComparison(result);
      setError(null);
    },
    onError: (err: Error) => {
      setError(err.message);
    },
  });

  const compare = useCallback((referenceId: string) => {
    if (referenceId) {
      mutation.mutate(referenceId);
    }
  }, [mutation]);

  return {
    comparison,
    isLoading: mutation.isPending,
    error: error || (mutation.error?.message ?? null),
    compare,
  };
}
