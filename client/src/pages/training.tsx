import { useState } from "react";
import { motion } from "framer-motion";
import { MobileLayout, MobileCard, MobileButton } from "@/components/mobile-layout";
import { AICaseGenerator } from "@/components/ai-case-generator";
import { useMedicalCases } from "@/hooks/use-medical-cases";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, BookOpen, Clock, Star, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { 
  Users, 
  FileImage, 
  GraduationCap, 
  GitBranch, 
  Stethoscope,
  Trophy
} from "lucide-react";

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
    <MobileLayout title="Medical Training" showBottomNav={true}>
      {/* Training Modules Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Training Modules</h2>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {[
              {
                title: "Image Analysis",
                desc: "X-ray, CT, MRI training",
                icon: FileImage,
                color: "blue",
                href: "/image-analysis"
              },
              {
                title: "Board Exams",
                desc: "USMLE & specialty prep",
                icon: GraduationCap,
                color: "green", 
                href: "/board-exam-prep"
              },
              {
                title: "Decision Trees",
                desc: "Clinical algorithms",
                icon: GitBranch,
                color: "purple",
                href: "/clinical-decision-trees"
              },
              {
                title: "Progress Tracking",
                desc: "Badges, awards & stats",
                icon: Trophy,
                color: "yellow",
                href: "/progress"
              }
            ].map((module, index) => {
              const IconComponent = module.icon;
              return (
                <motion.div
                  key={module.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                >
                  <Link href={module.href}>
                    <MobileCard className={`bg-${module.color}-50 border-${module.color}-200 hover:shadow-md transition-shadow cursor-pointer`}>
                      <div className="text-center p-2">
                        <div className={`w-10 h-10 bg-${module.color}-100 rounded-xl flex items-center justify-center mx-auto mb-2`}>
                          <IconComponent className={`h-5 w-5 text-${module.color}-600`} />
                        </div>
                        <h3 className="font-semibold text-gray-900 text-sm mb-1">{module.title}</h3>
                        <p className="text-xs text-gray-600">{module.desc}</p>
                      </div>
                    </MobileCard>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Patient Simulation Cases Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Patient Simulations</h2>
            <Stethoscope className="h-5 w-5 text-indigo-600" />
          </div>
          
          {/* AI Generator Banner */}
          <MobileCard className="mb-4 bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-purple-900 mb-1">Generate New Cases</h3>
                <p className="text-sm text-purple-700">Create unlimited practice scenarios with AI</p>
              </div>
              <AICaseGenerator onCaseGenerated={(caseId) => {
                window.location.reload();
              }} />
            </div>
          </MobileCard>
        </div>
      </motion.div>

      {/* Mobile Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <MobileCard className="mb-6">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                placeholder="Search cases..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-xl"
                data-testid="input-search"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Select value={specialty} onValueChange={setSpecialty}>
                <SelectTrigger className="rounded-xl border-gray-200" data-testid="select-specialty">
                  <SelectValue placeholder="Specialty" />
                </SelectTrigger>
                <SelectContent>
                  {specialties.map(spec => (
                    <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger className="rounded-xl border-gray-200" data-testid="select-difficulty">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  {difficulties.map(diff => (
                    <SelectItem key={diff.value || "all"} value={diff.value || "all"}>{diff.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </MobileCard>
      </motion.div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12">
          <motion.div 
            className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-gray-600 mt-4 text-sm">Loading medical cases...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <MobileCard className="border-red-200 bg-red-50">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <i className="fas fa-exclamation-triangle text-red-600"></i>
              </div>
              <p className="text-red-600 font-medium">Failed to load cases</p>
              <p className="text-red-500 text-sm mt-1">Please try again</p>
            </div>
          </MobileCard>
        </motion.div>
      )}

      {/* Mobile Cases List */}
      {cases && cases.length > 0 && (
        <div className="space-y-4">
          {cases.map((medicalCase, index) => (
            <motion.div
              key={medicalCase.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
            >
              <MobileCard className="p-5" data-testid={`case-card-${medicalCase.id}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                        <i className="fas fa-heart text-red-600 text-sm"></i>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-base leading-tight">
                          {medicalCase.name}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {medicalCase.age}-year-old {medicalCase.gender}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-800 mb-1">Chief Complaint</p>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {medicalCase.chiefComplaint}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2 flex-wrap mb-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-lg text-xs font-medium">
                        {medicalCase.specialty}
                      </span>
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                        medicalCase.difficulty === 1 ? 'bg-green-100 text-green-800' :
                        medicalCase.difficulty === 2 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {medicalCase.difficulty === 1 ? 'Foundation' :
                         medicalCase.difficulty === 2 ? 'Clinical' : 'Expert'}
                      </span>
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        {medicalCase.estimatedDuration}m
                      </div>
                      <div className="flex items-center text-xs text-yellow-600">
                        <Star className="h-3 w-3 mr-1" />
                        {medicalCase.rating}
                      </div>
                    </div>
                  </div>
                </div>
                
                <Link href={`/game/${medicalCase.id}`}>
                  <MobileButton 
                    className="w-full"
                    data-testid={`button-start-case-${medicalCase.id}`}
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Start Case
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </MobileButton>
                </Link>
              </MobileCard>
            </motion.div>
          ))}
          
          {/* Load More Button */}
          {cases.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: cases.length * 0.1 + 0.2, duration: 0.4 }}
              className="pt-4"
            >
              <MobileButton 
                variant="secondary" 
                className="w-full"
                data-testid="button-load-more"
              >
                Load More Cases
              </MobileButton>
            </motion.div>
          )}
        </div>
      )}

      {/* Empty State */}
      {cases && cases.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <MobileCard className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">No cases found</h3>
            <p className="text-gray-600 text-sm mb-4 leading-relaxed">
              Try adjusting your search criteria or browse different specialties
            </p>
            <MobileButton 
              variant="secondary"
              onClick={() => {
                setSearch("");
                setSpecialty("All Specialties");
                setDifficulty("");
              }}
              data-testid="button-clear-filters"
            >
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </MobileButton>
          </MobileCard>
        </motion.div>
      )}
    </MobileLayout>
  );
}