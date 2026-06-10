import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Star } from "lucide-react";
import { motion } from "framer-motion";
import type { MedicalCase } from "@shared/schema";

interface CaseCardProps {
  medicalCase: MedicalCase;
}

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
  const difficultyLabel = difficultyLabels[medicalCase.difficulty];
  const specialtyIcon = specialtyIcons[medicalCase.specialty] || specialtyIcons.default;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="luxury-card rounded-2xl hover:shadow-md transition-shadow duration-300 group cursor-pointer"
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center">
              <i className={`fas ${specialtyIcon} text-muted-foreground text-xl`}></i>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{medicalCase.name}</h3>
              <p className="text-muted-foreground text-sm">{medicalCase.age}-year-old {medicalCase.gender}</p>
            </div>
          </div>
          <Badge className="bg-secondary text-muted-foreground border border-border px-3 py-1 rounded-full text-xs font-medium">
            {difficultyLabel}
          </Badge>
        </div>
        
        <div className="mb-4">
          <h4 className="font-medium text-foreground mb-2">Chief Complaint</h4>
          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
            {medicalCase.chiefComplaint}
          </p>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Badge className="bg-secondary text-muted-foreground border border-border px-2 py-1 rounded-lg text-xs font-medium">
              {medicalCase.specialty}
            </Badge>
            <span className="text-muted-foreground text-xs">•</span>
            <div className="flex items-center space-x-1 text-muted-foreground text-xs">
              <Clock className="h-3 w-3" />
              <span>{medicalCase.estimatedDuration} min</span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-gold fill-current" />
            <span className="text-muted-foreground text-sm">{medicalCase.rating}</span>
          </div>
        </div>

        <Button asChild className="w-full bg-primary text-primary-foreground rounded-xl font-medium hover:shadow-md transition-all duration-300">
          <Link href={`/game/${medicalCase.id}`}>
            Start Case
          </Link>
        </Button>
      </div>
    </motion.div>
  );
}
