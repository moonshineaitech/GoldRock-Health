import { useState } from "react";
import { Navigation } from "@/components/navigation";
import { CaseCard } from "@/components/case-card";
import { AICaseGenerator } from "@/components/ai-case-generator";
import { useMedicalCases } from "@/hooks/use-medical-cases";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";

const specialties = [
  "All Specialties",
  "Cardiology",
  "Neurology", 
  "Endocrinology",
  "Gastroenterology",
  "Emergency Medicine",
  "Pediatrics",
  "Psychiatry",
  "Infectious Disease",
  "Dermatology",
  "Orthopedics",
  "Gynecology"
];

const difficulties = [
  { value: "", label: "All Levels" },
  { value: "1", label: "Foundation" },
  { value: "2", label: "Clinical" },
  { value: "3", label: "Expert" }
];

export default function Training() {
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("All Specialties");
  const [difficulty, setDifficulty] = useState("");

  const filters = {
    search: search || undefined,
    specialty: specialty !== "All Specialties" ? specialty : undefined,
    difficulty: difficulty ? parseInt(difficulty) : undefined,
  };

  const { data: cases, isLoading, error } = useMedicalCases(filters);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
      <Navigation />
      
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex justify-between items-start mb-6">
              <div className="text-left">
                <h1 className="text-4xl font-bold text-slate-900 mb-4">Choose Your Training Case</h1>
                <p className="text-xl text-slate-600 max-w-3xl">
                  Select from our comprehensive library of medical cases across 19 specialties. 
                  Each case is designed to challenge your diagnostic skills and clinical reasoning.
                </p>
              </div>
              <AICaseGenerator onCaseGenerated={(caseId) => {
                // Refresh cases when new one is generated
                window.location.reload();
              }} />
            </div>
          </div>

          {/* Search and Filter Controls */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input 
                    placeholder="Search by patient name, symptoms, or diagnosis..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-12 rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <Select value={specialty} onValueChange={setSpecialty}>
                  <SelectTrigger className="w-48 rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {specialties.map(spec => (
                      <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger className="w-40 rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200">
                    <SelectValue placeholder="All Levels" />
                  </SelectTrigger>
                  <SelectContent>
                    {difficulties.map(diff => (
                      <SelectItem key={diff.value || "all"} value={diff.value || "all"}>{diff.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p className="text-slate-600">Loading medical cases...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md mx-auto">
                <p className="text-red-700">Failed to load medical cases. Please try again.</p>
              </div>
            </div>
          )}

          {/* Case Cards Grid */}
          {cases && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cases.map((medicalCase) => (
                  <CaseCard key={medicalCase.id} medicalCase={medicalCase} />
                ))}
              </div>

              {cases.length === 0 && (
                <div className="text-center py-12">
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 max-w-md mx-auto">
                    <Filter className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600">No cases found matching your criteria.</p>
                    <p className="text-slate-500 text-sm mt-2">Try adjusting your search or filters.</p>
                  </div>
                </div>
              )}

              {cases.length > 0 && (
                <div className="text-center mt-12">
                  <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-xl transition-all duration-300">
                    Load More Cases
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
