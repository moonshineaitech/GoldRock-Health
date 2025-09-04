import { motion } from "framer-motion";
import { Crown, Star, Award, Zap, Clock, Users, CheckCircle } from "lucide-react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  earned: boolean;
  rarity: "Common" | "Rare" | "Epic" | "Legendary";
  points: number;
  category: string;
  progress?: number;
  maxProgress?: number;
  specialty?: string;
  unlockedAt?: string;
}

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: "sm" | "md" | "lg";
  showProgress?: boolean;
  onClick?: () => void;
}

const rarityStyles = {
  Common: {
    gradient: "from-gray-100 to-gray-200",
    border: "border-gray-300",
    glow: "shadow-gray-500/20",
    icon: "text-gray-600",
    badge: "bg-gray-100 text-gray-700"
  },
  Rare: {
    gradient: "from-blue-100 to-blue-200",
    border: "border-blue-300",
    glow: "shadow-blue-500/30",
    icon: "text-blue-600",
    badge: "bg-blue-100 text-blue-700"
  },
  Epic: {
    gradient: "from-purple-100 to-purple-200",
    border: "border-purple-300",
    glow: "shadow-purple-500/40",
    icon: "text-purple-600",
    badge: "bg-purple-100 text-purple-700"
  },
  Legendary: {
    gradient: "from-yellow-100 via-amber-100 to-orange-200",
    border: "border-yellow-400",
    glow: "shadow-yellow-500/50",
    icon: "text-yellow-600",
    badge: "bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800"
  }
};

const sizeStyles = {
  sm: {
    container: "w-16 h-20",
    icon: "w-6 h-6",
    badge: "w-12 h-12",
    text: "text-xs",
    points: "text-xs"
  },
  md: {
    container: "w-20 h-24",
    icon: "w-8 h-8",
    badge: "w-16 h-16",
    text: "text-sm",
    points: "text-sm"
  },
  lg: {
    container: "w-24 h-28",
    icon: "w-10 h-10",
    badge: "w-20 h-20",
    text: "text-base",
    points: "text-base"
  }
};

export function AchievementBadge({ 
  achievement, 
  size = "md", 
  showProgress = true,
  onClick 
}: AchievementBadgeProps) {
  const IconComponent = achievement.icon;
  const rarity = rarityStyles[achievement.rarity];
  const sizing = sizeStyles[size];
  const progressPercentage = achievement.progress && achievement.maxProgress 
    ? (achievement.progress / achievement.maxProgress) * 100 
    : 0;

  return (
    <motion.div
      className={`${sizing.container} cursor-pointer`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative">
        {/* Badge Container */}
        <motion.div
          className={`${sizing.badge} rounded-2xl bg-gradient-to-br ${rarity.gradient} border-2 ${rarity.border} ${rarity.glow} shadow-xl flex items-center justify-center relative overflow-hidden ${
            !achievement.earned ? 'opacity-60 grayscale' : ''
          }`}
          animate={achievement.earned && achievement.rarity === 'Legendary' ? {
            boxShadow: [
              "0 0 20px rgba(251, 191, 36, 0.5)",
              "0 0 30px rgba(251, 191, 36, 0.7)",
              "0 0 20px rgba(251, 191, 36, 0.5)"
            ]
          } : {}}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          {/* Background Pattern for Legendary */}
          {achievement.rarity === 'Legendary' && achievement.earned && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: [-100, 100] }}
              transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
            />
          )}

          {/* Achievement Icon */}
          <IconComponent className={`${sizing.icon} ${rarity.icon} z-10`} />

          {/* Lock overlay for unearned achievements */}
          {!achievement.earned && (
            <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] rounded-2xl flex items-center justify-center">
              <motion.div
                className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="w-3 h-3 border border-white rounded-sm" />
              </motion.div>
            </div>
          )}

          {/* Progress Ring for in-progress achievements */}
          {!achievement.earned && achievement.progress && achievement.maxProgress && showProgress && (
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="3"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 45}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 45 * (1 - progressPercentage / 100) }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="text-indigo-500"
              />
            </svg>
          )}
        </motion.div>

        {/* Rarity Badge */}
        <motion.div
          className={`absolute -top-1 -right-1 px-1.5 py-0.5 rounded-lg ${rarity.badge} text-xs font-bold shadow-sm`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          {achievement.rarity}
        </motion.div>

        {/* Points Badge */}
        <motion.div
          className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-white border border-gray-200 rounded-lg px-2 py-1 shadow-sm"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <span className={`${sizing.points} font-semibold text-indigo-600`}>
            +{achievement.points}
          </span>
        </motion.div>

        {/* Check mark for earned achievements */}
        {achievement.earned && (
          <motion.div
            className="absolute -top-2 -left-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
          >
            <CheckCircle className="w-4 h-4 text-white" />
          </motion.div>
        )}

        {/* Progress text for in-progress achievements */}
        {!achievement.earned && achievement.progress && achievement.maxProgress && showProgress && (
          <motion.div
            className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 font-medium whitespace-nowrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {achievement.progress}/{achievement.maxProgress}
          </motion.div>
        )}
      </div>

      {/* Achievement Title */}
      <motion.p
        className={`${sizing.text} font-semibold text-gray-900 text-center mt-2 leading-tight`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        {achievement.title}
      </motion.p>
    </motion.div>
  );
}

interface AchievementUnlockAnimationProps {
  achievement: Achievement;
  isVisible: boolean;
  onClose: () => void;
}

export function AchievementUnlockAnimation({ 
  achievement, 
  isVisible, 
  onClose 
}: AchievementUnlockAnimationProps) {
  if (!isVisible) return null;

  const IconComponent = achievement.icon;
  const rarity = rarityStyles[achievement.rarity];

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-3xl p-8 max-w-sm w-full mx-4 text-center shadow-2xl"
        initial={{ scale: 0.5, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.5, opacity: 0, y: 50 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Celebration particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-yellow-400 rounded-full"
              initial={{ 
                x: "50%", 
                y: "50%", 
                scale: 0,
                rotate: 0 
              }}
              animate={{ 
                x: `${50 + (Math.cos(i * 30 * Math.PI / 180) * 150)}%`,
                y: `${50 + (Math.sin(i * 30 * Math.PI / 180) * 150)}%`,
                scale: [0, 1, 0],
                rotate: 360
              }}
              transition={{ 
                duration: 2, 
                delay: 0.5 + i * 0.1,
                ease: "easeOut"
              }}
            />
          ))}
        </div>

        <motion.h2
          className="text-2xl font-bold text-gray-900 mb-2"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Achievement Unlocked!
        </motion.h2>

        <motion.div
          className="my-6"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 150 }}
        >
          <AchievementBadge achievement={achievement} size="lg" showProgress={false} />
        </motion.div>

        <motion.h3
          className="text-lg font-semibold text-gray-900 mb-2"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {achievement.title}
        </motion.h3>

        <motion.p
          className="text-gray-600 mb-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          {achievement.description}
        </motion.p>

        <motion.div
          className="flex items-center justify-center space-x-4 mb-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.0 }}
        >
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-indigo-600" />
            <span className="text-indigo-600 font-semibold">+{achievement.points} points</span>
          </div>
          <div className={`px-2 py-1 rounded-lg ${rarity.badge} text-xs font-bold`}>
            {achievement.rarity}
          </div>
        </motion.div>

        <motion.button
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-2xl transition-colors"
          onClick={onClose}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Continue Training
        </motion.button>
      </motion.div>
    </motion.div>
  );
}