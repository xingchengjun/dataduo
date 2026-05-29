import { motion } from 'framer-motion';

interface XPBarProps {
  xp: number;
  level: number;
  progress: number; // 0 to 1
  animated?: boolean;
  showLabel?: boolean;
}

export default function XPBar({
  xp,
  level,
  progress,
  animated = true,
  showLabel = true,
}: XPBarProps) {
  const percentage = Math.min(Math.max(progress * 100, 0), 100);

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-bold text-duo-text-secondary">
            等级 {level}
          </span>
          <span className="text-xs font-bold text-duo-green">
            {xp} XP
          </span>
        </div>
      )}
      <div className="w-full h-3 bg-duo-surface-dark rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-duo-green to-duo-teal"
          initial={animated ? { width: 0 } : { width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
        />
      </div>
    </div>
  );
}
