import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, TrendingUp, Users } from "lucide-react";
import type { BillWorkflow } from "@shared/bill-ai-workflows";

interface WorkflowCardProps {
  workflow: BillWorkflow;
  onClick: () => void;
  className?: string;
}

export function WorkflowCard({ workflow, onClick, className = "" }: WorkflowCardProps) {
  const IconComponent = workflow.icon;
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative ${className}`}
    >
      <Button
        onClick={onClick}
        variant="ghost"
        className={`w-full h-full p-6 flex flex-col items-center justify-center text-center space-y-3 rounded-2xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-200 ${workflow.bgColor} hover:shadow-md`}
        data-testid={`workflow-${workflow.id}`}
      >
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${workflow.bgColor.replace('bg-', 'bg-opacity-20 bg-')}`}>
          <IconComponent className={`h-6 w-6 ${workflow.color}`} />
        </div>
        
        <div className="space-y-1">
          <h3 className="font-semibold text-gray-900 text-sm leading-tight">
            {workflow.title}
          </h3>
          <p className={`text-xs ${workflow.color} font-medium`}>
            {workflow.subtitle}
          </p>
        </div>

        {workflow.isPremium && (
          <Badge 
            variant="secondary" 
            className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs px-2 py-1"
          >
            Premium
          </Badge>
        )}
      </Button>
    </motion.div>
  );
}

interface WorkflowDetailCardProps {
  workflow: BillWorkflow;
  onStart: () => void;
  onClose: () => void;
}

export function WorkflowDetailCard({ workflow, onStart, onClose }: WorkflowDetailCardProps) {
  const IconComponent = workflow.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 max-w-md mx-auto relative"
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center"
        data-testid="close-workflow-detail"
      >
        <span className="sr-only">Close</span>
        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="text-center space-y-4">
        <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center ${workflow.bgColor}`}>
          <IconComponent className={`h-8 w-8 ${workflow.color}`} />
        </div>

        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{workflow.title}</h3>
          <p className="text-gray-600 text-sm leading-relaxed">{workflow.description}</p>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 bg-gray-50 rounded-xl p-3">
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{workflow.estimatedTime}</span>
          </div>
          <div className="flex items-center space-x-1">
            <TrendingUp className="w-4 h-4" />
            <span>{workflow.savingsPotential}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4" />
            <span>{workflow.successRate}</span>
          </div>
        </div>

        <div className="space-y-2">
          <Button
            onClick={onStart}
            className={`w-full py-3 rounded-xl font-semibold ${
              workflow.isPremium 
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white'
                : `bg-gradient-to-r ${workflow.color.replace('text-', 'from-')} to-blue-600 hover:shadow-lg text-white`
            }`}
            data-testid={`start-workflow-${workflow.id}`}
          >
            {workflow.isPremium ? '✨ Start Premium Workflow' : 'Start Workflow'}
          </Button>
          
          {workflow.tags && workflow.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 justify-center">
              {workflow.tags.slice(0, 4).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}