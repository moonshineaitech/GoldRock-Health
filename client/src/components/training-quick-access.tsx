import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { 
  Plus, 
  X, 
  BookOpen, 
  FileImage, 
  GraduationCap, 
  GitBranch,
  Users,
  Stethoscope
} from "lucide-react";

export function TrainingQuickAccess() {
  const [isOpen, setIsOpen] = useState(false);

  const trainingModules = [
    {
      title: "Patient Cases",
      desc: "Interactive simulations",
      icon: Stethoscope,
      href: "/training",
      color: "blue"
    },
    {
      title: "Image Analysis", 
      desc: "X-ray, CT, MRI training",
      icon: FileImage,
      href: "/image-analysis",
      color: "purple"
    },
    {
      title: "Board Exams",
      desc: "USMLE & specialty prep", 
      icon: GraduationCap,
      href: "/board-exam-prep",
      color: "green"
    },
    {
      title: "Decision Trees",
      desc: "Clinical algorithms",
      icon: GitBranch,
      href: "/clinical-decision-trees", 
      color: "orange"
    },
    {
      title: "Study Groups",
      desc: "Collaborative learning",
      icon: Users,
      href: "/study-groups",
      color: "pink"
    }
  ];

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        className="fixed right-4 z-40 w-14 h-14 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full shadow-lg flex items-center justify-center"
        style={{ bottom: 'calc(4.5rem + env(safe-area-inset-bottom))' }}
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.05 }}
        onClick={() => setIsOpen(!isOpen)}
        data-testid="training-quick-access-button"
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <Plus className="h-6 w-6 text-white" />
        </motion.div>
      </motion.button>

      {/* Quick Access Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            
            {/* Menu Items */}
            <motion.div
              className="fixed bottom-36 right-4 z-40 space-y-3"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              {trainingModules.map((module, index) => {
                const IconComponent = module.icon;
                return (
                  <motion.div
                    key={module.title}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link href={module.href} onClick={() => setIsOpen(false)}>
                      <motion.div 
                        className="bg-white/95 backdrop-blur-lg rounded-2xl p-4 shadow-lg border border-white/30 flex items-center space-x-3 min-w-48"
                        whileTap={{ scale: 0.95 }}
                        whileHover={{ scale: 1.02 }}
                        data-testid={`quick-access-${module.title.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        <div className={`w-10 h-10 bg-${module.color}-100 rounded-xl flex items-center justify-center`}>
                          <IconComponent className={`h-5 w-5 text-${module.color}-600`} />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900 text-sm">{module.title}</div>
                          <div className="text-xs text-gray-600">{module.desc}</div>
                        </div>
                      </motion.div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}