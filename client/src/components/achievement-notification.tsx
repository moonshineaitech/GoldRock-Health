import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trophy, 
  Star, 
  Crown, 
  Medal, 
  Award, 
  Sparkles,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";

interface Achievement {
  id: string;
  title: string;
  description: string;
  rarity: "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary";
  points: number;
  category: string;
}

interface AchievementNotificationProps {
  achievement: Achievement | null;
  isVisible: boolean;
  onClose: () => void;
}

const rarityConfig = {
  Common: {
    colors: {
      primary: "#6B7280",
      secondary: "#9CA3AF",
      bg: "from-gray-100 to-gray-200",
      border: "border-gray-300"
    },
    confetti: ["#6B7280", "#9CA3AF", "#E5E7EB"]
  },
  Uncommon: {
    colors: {
      primary: "#059669",
      secondary: "#10B981",
      bg: "from-emerald-100 to-green-200",
      border: "border-emerald-300"
    },
    confetti: ["#059669", "#10B981", "#6EE7B7"]
  },
  Rare: {
    colors: {
      primary: "#2563EB",
      secondary: "#3B82F6",
      bg: "from-blue-100 to-blue-200",
      border: "border-blue-300"
    },
    confetti: ["#2563EB", "#3B82F6", "#93C5FD"]
  },
  Epic: {
    colors: {
      primary: "#7C3AED",
      secondary: "#8B5CF6",
      bg: "from-purple-100 to-purple-200",
      border: "border-purple-300"
    },
    confetti: ["#7C3AED", "#8B5CF6", "#C4B5FD"]
  },
  Legendary: {
    colors: {
      primary: "#F59E0B",
      secondary: "#EAB308",
      bg: "from-yellow-100 via-amber-100 to-orange-200",
      border: "border-yellow-400"
    },
    confetti: ["#F59E0B", "#EAB308", "#FDE68A", "#FEF3C7"]
  }
};

const rarityIcons = {
  Common: Medal,
  Uncommon: Award,
  Rare: Trophy,
  Epic: Star,
  Legendary: Crown
};

export function AchievementNotification({ 
  achievement, 
  isVisible, 
  onClose 
}: AchievementNotificationProps) {
  const [shouldShowConfetti, setShouldShowConfetti] = useState(false);

  useEffect(() => {
    if (isVisible && achievement) {
      setShouldShowConfetti(true);
      
      // Trigger confetti animation
      const rarity = rarityConfig[achievement.rarity];
      const confettiColors = rarity.confetti;
      
      // Multiple confetti bursts for different rarities
      const burstCount = achievement.rarity === "Legendary" ? 5 : 
                        achievement.rarity === "Epic" ? 3 : 
                        achievement.rarity === "Rare" ? 2 : 1;

      for (let i = 0; i < burstCount; i++) {
        setTimeout(() => {
          confetti({
            particleCount: achievement.rarity === "Legendary" ? 150 : 100,
            spread: achievement.rarity === "Legendary" ? 100 : 70,
            origin: { y: 0.6 },
            colors: confettiColors,
            gravity: 0.8,
            drift: Math.random() * 2 - 1
          });
        }, i * 200);
      }

      // Auto-close after animation
      const timer = setTimeout(() => {
        onClose();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, achievement, onClose]);

  if (!achievement) return null;

  const rarity = rarityConfig[achievement.rarity];
  const IconComponent = rarityIcons[achievement.rarity];

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Notification */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 25,
              duration: 0.6
            }}
          >
            <motion.div
              className={cn(
                "relative max-w-sm w-full bg-gradient-to-br backdrop-blur-xl rounded-3xl border-2 shadow-2xl overflow-hidden",
                rarity.colors.bg,
                rarity.colors.border
              )}
              animate={achievement.rarity === "Legendary" ? {
                boxShadow: [
                  `0 0 30px ${rarity.colors.primary}40`,
                  `0 0 50px ${rarity.colors.primary}60`,
                  `0 0 30px ${rarity.colors.primary}40`
                ]
              } : {}}
              transition={{ repeat: Infinity, duration: 2 }}
              data-testid="achievement-notification"
            >
              {/* Sparkle Effects */}
              {achievement.rarity === "Legendary" && (
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute"
                      style={{
                        left: `${10 + (i * 12)}%`,
                        top: `${15 + (i % 3) * 20}%`,
                      }}
                      animate={{
                        scale: [0, 1, 0],
                        rotate: [0, 180, 360],
                        opacity: [0, 1, 0]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.2
                      }}
                    >
                      <Sparkles className="h-4 w-4 text-yellow-500" />
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                data-testid="close-achievement-notification"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Content */}
              <div className="p-6 text-center space-y-4">
                {/* Header */}
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-1">
                    Achievement Unlocked!
                  </h3>
                  <div className={cn(
                    "inline-block px-3 py-1 rounded-full text-sm font-medium",
                    rarity.colors.bg
                  )}>
                    {achievement.rarity}
                  </div>
                </motion.div>

                {/* Icon */}
                <motion.div
                  className="flex justify-center"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 20,
                    delay: 0.3 
                  }}
                >
                  <div className={cn(
                    "p-6 rounded-full bg-gradient-to-br shadow-lg",
                    rarity.colors.bg,
                    rarity.colors.border,
                    "border-2"
                  )}>
                    <IconComponent 
                      className="h-16 w-16" 
                      style={{ color: rarity.colors.primary }}
                    />
                  </div>
                </motion.div>

                {/* Achievement Info */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-2"
                >
                  <h4 className="text-xl font-bold text-gray-800">
                    {achievement.title}
                  </h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {achievement.description}
                  </p>
                </motion.div>

                {/* Points and Category */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2">
                    <Star className="h-5 w-5 text-yellow-600" />
                    <span className="font-semibold text-gray-700">
                      +{achievement.points} Points
                    </span>
                  </div>
                  <div className="px-3 py-1 bg-white/60 rounded-lg text-sm text-gray-600">
                    {achievement.category}
                  </div>
                </motion.div>

                {/* Celebration Message */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6, type: "spring" }}
                  className="text-center"
                >
                  <p className="text-lg font-medium text-gray-700">
                    🎉 Congratulations! 🎉
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Keep up the excellent medical training!
                  </p>
                </motion.div>
              </div>

              {/* Animated Border for Legendary */}
              {achievement.rarity === "Legendary" && (
                <motion.div
                  className="absolute inset-0 border-2 border-yellow-400 rounded-3xl"
                  animate={{
                    borderColor: [
                      "#F59E0B",
                      "#EAB308",
                      "#FBBF24",
                      "#F59E0B"
                    ]
                  }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
              )}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Hook for managing achievement notifications
export function useAchievementNotifications() {
  const [notifications, setNotifications] = useState<Achievement[]>([]);
  const [currentNotification, setCurrentNotification] = useState<Achievement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const showNotification = (achievement: Achievement) => {
    setNotifications(prev => [...prev, achievement]);
  };

  const processQueue = () => {
    if (notifications.length > 0 && !isVisible) {
      const nextNotification = notifications[0];
      setCurrentNotification(nextNotification);
      setIsVisible(true);
      setNotifications(prev => prev.slice(1));
    }
  };

  const closeNotification = () => {
    setIsVisible(false);
    setCurrentNotification(null);
    // Process next notification after a short delay
    setTimeout(processQueue, 300);
  };

  // Process queue when notifications change
  useEffect(() => {
    processQueue();
  }, [notifications, isVisible]);

  return {
    currentNotification,
    isVisible,
    showNotification,
    closeNotification
  };
}