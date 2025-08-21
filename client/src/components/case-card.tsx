import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Star } from "lucide-react";
import { motion } from "framer-motion";
import type { MedicalCase } from "@shared/schema";

interface CaseCardProps {
  medicalCase: MedicalCase;
}

const specialtyColors: Record<string, string> = {
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
  "default": "bg-slate-100 text-slate-700 border-slate-200"
};

const difficultyColors: Record<number, string> = {
  1: "bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-700 border-emerald-200",
  2: "bg-gradient-to-r from-amber-100 to-amber-50 text-amber-700 border-amber-200", 
  3: "bg-gradient-to-r from-rose-100 to-rose-50 text-rose-700 border-rose-200"
};

const difficultyLabels: Record<number, string> = {
  1: "Foundation",
  2: "Clinical",
  3: "Expert"
};

const specialtyIcons: Record<string, string> = {
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
  "default": "fa-user-md"
};

export function CaseCard({ medicalCase }: CaseCardProps) {
  const specialtyColor = specialtyColors[medicalCase.specialty] || specialtyColors.default;
  const difficultyColor = difficultyColors[medicalCase.difficulty];
  const difficultyLabel = difficultyLabels[medicalCase.difficulty];
  const specialtyIcon = specialtyIcons[medicalCase.specialty] || specialtyIcons.default;

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-md rounded-2xl border border-white/30 hover:shadow-2xl transition-all duration-300 group cursor-pointer"
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 bg-gradient-to-r ${specialtyColor.includes('red') ? 'from-red-500 to-red-600' : 
              specialtyColor.includes('purple') ? 'from-purple-500 to-purple-600' :
              specialtyColor.includes('emerald') ? 'from-emerald-500 to-emerald-600' :
              specialtyColor.includes('orange') ? 'from-orange-500 to-orange-600' :
              specialtyColor.includes('pink') ? 'from-pink-500 to-pink-600' :
              specialtyColor.includes('indigo') ? 'from-indigo-500 to-indigo-600' :
              specialtyColor.includes('yellow') ? 'from-yellow-500 to-yellow-600' :
              specialtyColor.includes('amber') ? 'from-amber-500 to-amber-600' :
              specialtyColor.includes('blue') ? 'from-blue-500 to-blue-600' :
              specialtyColor.includes('rose') ? 'from-rose-500 to-rose-600' :
              'from-slate-500 to-slate-600'} rounded-xl flex items-center justify-center`}>
              <i className={`fas ${specialtyIcon} text-white text-xl`}></i>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">{medicalCase.name}</h3>
              <p className="text-slate-600 text-sm">{medicalCase.age}-year-old {medicalCase.gender}</p>
            </div>
          </div>
          <Badge className={`${difficultyColor} px-3 py-1 rounded-full text-xs font-medium border`}>
            {difficultyLabel}
          </Badge>
        </div>
        
        <div className="mb-4">
          <h4 className="font-medium text-slate-900 mb-2">Chief Complaint</h4>
          <p className="text-slate-700 text-sm leading-relaxed line-clamp-3">
            {medicalCase.chiefComplaint}
          </p>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Badge className={`${specialtyColor} px-2 py-1 rounded-lg text-xs font-medium border`}>
              {medicalCase.specialty}
            </Badge>
            <span className="text-slate-500 text-xs">•</span>
            <div className="flex items-center space-x-1 text-slate-600 text-xs">
              <Clock className="h-3 w-3" />
              <span>{medicalCase.estimatedDuration} min</span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-amber-400 fill-current" />
            <span className="text-slate-600 text-sm">{medicalCase.rating}</span>
          </div>
        </div>

        <Button asChild className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300">
          <Link href={`/game/${medicalCase.id}`}>
            Start Case
          </Link>
        </Button>
      </div>
    </motion.div>
  );
}
