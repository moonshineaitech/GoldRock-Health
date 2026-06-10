import { useQuery } from "@tanstack/react-query";
import type { MedicalCase } from "@shared/schema";

interface MedicalCasesFilters {
  specialty?: string;
  difficulty?: number;
  search?: string;
}

export function useMedicalCases(filters?: MedicalCasesFilters) {
  return useQuery<MedicalCase[], Error>({
    queryKey: ["/api/cases", filters],
    queryFn: async ({ queryKey }) => {
      const [baseUrl, filtersObj] = queryKey;
      const params = new URLSearchParams();
      
      if (filtersObj && typeof filtersObj === 'object') {
        const filters = filtersObj as MedicalCasesFilters;
        if (filters.specialty && filters.specialty !== 'All Specialties') {
          params.append('specialty', filters.specialty);
        }
        if (filters.difficulty) {
          params.append('difficulty', filters.difficulty.toString());
        }
        if (filters.search) {
          params.append('search', filters.search);
        }
      }
      
      const url = params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl as string;
      const response = await fetch(url, { credentials: 'include' });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch medical cases: ${response.statusText}`);
      }
      
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}

export function useMedicalCase(id: string) {
  return useQuery<MedicalCase, Error>({
    queryKey: ["/api/cases", id],
    queryFn: async ({ queryKey }) => {
      const [baseUrl, caseId] = queryKey;
      const response = await fetch(`${baseUrl}/${caseId}`, { 
        credentials: 'include' 
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Medical case not found');
        }
        throw new Error(`Failed to fetch medical case: ${response.statusText}`);
      }
      
      return response.json();
    },
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
  });
}

export function useMedicalCaseProgress(caseId: string) {
  return useQuery({
    queryKey: ["/api/progress", caseId],
    enabled: !!caseId,
    staleTime: 30 * 1000, // 30 seconds
    retry: 1,
  });
}

// Hook for platform statistics
export function usePlatformStats() {
  return useQuery({
    queryKey: ["/api/stats"],
    staleTime: 60 * 1000, // 1 minute
    refetchInterval: 30 * 1000, // Refetch every 30 seconds for live updates
    retry: 2,
  });
}

// Hook for user achievements
export function useAchievements() {
  return useQuery({
    queryKey: ["/api/achievements"],
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
}

export function useUserAchievements() {
  return useQuery({
    queryKey: ["/api/user-achievements"],
    staleTime: 60 * 1000, // 1 minute
    retry: 1,
  });
}

// Specialty options for filtering
export const MEDICAL_SPECIALTIES = [
  "All Specialties",
  "Cardiology",
  "Neurology", 
  "Endocrinology",
  "Gastroenterology",
  "Oncology",
  "Psychiatry",
  "Infectious Disease",
  "Dermatology",
  "Orthopedics",
  "Gynecology",
  "Urology",
  "ENT",
  "Ophthalmology",
  "Pulmonology",
  "Hematology",
  "Rheumatology",
  "Nephrology",
  "Emergency Medicine",
  "Pediatrics"
] as const;

// Difficulty levels
export const DIFFICULTY_LEVELS = [
  { value: "", label: "All Levels" },
  { value: "1", label: "Foundation" },
  { value: "2", label: "Clinical" },
  { value: "3", label: "Expert" }
] as const;

// Utility function to get specialty icon
export function getSpecialtyIcon(specialty: string): string {
  const icons: Record<string, string> = {
    "Cardiology": "fa-heart",
    "Neurology": "fa-brain",
    "Emergency Medicine": "fa-ambulance",
    "Endocrinology": "fa-dna",
    "Gastroenterology": "fa-pills",
    "Pediatrics": "fa-baby",
    "Psychiatry": "fa-head-side-virus",
    "Infectious Disease": "fa-virus",
    "Dermatology": "fa-hand",
    "Orthopedics": "fa-bone",
    "Gynecology": "fa-female",
    "Urology": "fa-kidneys",
    "ENT": "fa-ear-listen",
    "Ophthalmology": "fa-eye",
    "Pulmonology": "fa-lungs",
    "Hematology": "fa-tint",
    "Rheumatology": "fa-joints",
    "Nephrology": "fa-kidneys",
    "Oncology": "fa-ribbon",
    "default": "fa-user-md"
  };
  return icons[specialty] || icons.default;
}

// Utility function to get specialty color (Atelier: uniform neutral chip; the
// specialty name text is the differentiator, gold stays the only accent)
export function getSpecialtyColor(_specialty: string): string {
  return "bg-secondary text-muted-foreground border-border";
}

// Utility function to get difficulty color
export function getDifficultyColor(difficulty: number): string {
  const colors: Record<number, string> = {
    1: "bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-700 border-emerald-200",
    2: "bg-gradient-to-r from-amber-100 to-amber-50 text-amber-700 border-amber-200", 
    3: "bg-gradient-to-r from-rose-100 to-rose-50 text-rose-700 border-rose-200"
  };
  return colors[difficulty] || colors[1];
}

// Utility function to get difficulty label
export function getDifficultyLabel(difficulty: number): string {
  const labels: Record<number, string> = {
    1: "Foundation",
    2: "Clinical",
    3: "Expert"
  };
  return labels[difficulty] || "Foundation";
}
