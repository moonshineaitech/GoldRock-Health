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

// Utility function to get specialty color
export function getSpecialtyColor(specialty: string): string {
  const colors: Record<string, string> = {
    "Cardiology": "bg-red-100 text-red-700 border-red-200",
    "Neurology": "bg-purple-100 text-purple-700 border-purple-200",
    "Emergency Medicine": "bg-red-100 text-red-700 border-red-200",
    "Endocrinology": "bg-emerald-100 text-emerald-700 border-emerald-200",
    "Gastroenterology": "bg-orange-100 text-orange-700 border-orange-200",
    "Pediatrics": "bg-pink-100 text-pink-700 border-pink-200",
    "Psychiatry": "bg-indigo-100 text-indigo-700 border-indigo-200",
    "Infectious Disease": "bg-yellow-100 text-yellow-700 border-yellow-200",
    "Dermatology": "bg-amber-100 text-amber-700 border-amber-200",
    "Orthopedics": "bg-blue-100 text-blue-700 border-blue-200",
    "Gynecology": "bg-rose-100 text-rose-700 border-rose-200",
    "Urology": "bg-cyan-100 text-cyan-700 border-cyan-200",
    "ENT": "bg-green-100 text-green-700 border-green-200",
    "Ophthalmology": "bg-violet-100 text-violet-700 border-violet-200",
    "Pulmonology": "bg-sky-100 text-sky-700 border-sky-200",
    "Hematology": "bg-red-100 text-red-700 border-red-200",
    "Rheumatology": "bg-stone-100 text-stone-700 border-stone-200",
    "Nephrology": "bg-teal-100 text-teal-700 border-teal-200",
    "Oncology": "bg-purple-100 text-purple-700 border-purple-200",
    "default": "bg-slate-100 text-slate-700 border-slate-200"
  };
  return colors[specialty] || colors.default;
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
