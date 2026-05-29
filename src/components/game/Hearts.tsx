import { motion, AnimatePresence } from 'framer-motion';

interface HeartsProps {
  hearts: number;
  maxHearts: number;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: 'w-5 h-5',
  md: 'w-7 h-7',
  lg: 'w-9 h-9',
};

export default function Hearts({ hearts, maxHearts, size = 'md' }: HeartsProps) {
  return (
    <div className="flex items-center gap-1">
      <AnimatePresence>
        {Array.from({ length: maxHearts }).map((_, i) => (
          <motion.span
            key={i}
            className={`${sizeMap[size]} ${
              i < hearts ? 'text-duo-red' : 'text-gray-300'
            }`}
            initial={i < hearts ? { scale: 1 } : { scale: 0.8, opacity: 0.5 }}
            animate={
              i < hearts
                ? {
                    scale: [1, 1.15, 1],
                    transition: { duration: 0.4, delay: i * 0.1 },
                  }
                : { scale: 0.9, opacity: 0.4 }
            }
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {i < hearts ? '❤️' : '🤍'}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}
