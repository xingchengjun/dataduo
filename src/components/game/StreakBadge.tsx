import { motion } from 'framer-motion';

interface StreakBadgeProps {
  streak: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function StreakBadge({ streak, size = 'md' }: StreakBadgeProps) {
  const isFireActive = streak > 1;

  const flames = ['🔥', '🔥', '🔥'];

  return (
    <div className="flex items-center gap-1.5">
      {isFireActive && streak >= 7 && (
        <motion.span
          className="text-sm"
          animate={{ scale: [1, 1.2, 1], opacity: [1, 0.8, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          {streak >= 30 ? '💎' : streak >= 14 ? '🌟' : '🔥'}
        </motion.span>
      )}
      {streak > 1 && (
        <motion.div
          className="flex items-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
        >
          <motion.span
            className={`
              font-extrabold
              ${streak >= 30 ? 'text-purple-500' : streak >= 14 ? 'text-duo-orange' : 'text-duo-orange'}
              ${size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-2xl' : 'text-lg'}
            `}
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 2 }}
          >
            🔥
          </motion.span>
          <span
            className={`
              font-extrabold ml-0.5
              ${streak >= 30 ? 'text-purple-500' : streak >= 14 ? 'text-duo-orange' : 'text-duo-text'}
              ${size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-2xl' : 'text-lg'}
            `}
          >
            {streak}
          </span>
        </motion.div>
      )}
      {streak <= 1 && (
        <div className="flex items-center">
          <span className={`text-duo-text-secondary ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
            🔥 0
          </span>
        </div>
      )}
    </div>
  );
}
