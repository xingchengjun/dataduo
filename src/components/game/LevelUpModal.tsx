import { motion, AnimatePresence } from 'framer-motion';

interface LevelUpModalProps {
  show: boolean;
  level: number;
  onClose: () => void;
}

const LEVEL_TITLES = ['数据小白', 'SQL 新手', '查询学徒', '数据工匠', '分析达人', '算法能手', '数据大师', 'Offer 收割机'];

export default function LevelUpModal({ show, level, onClose }: LevelUpModalProps) {
  const title = LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)];

  // Confetti particles
  const confettiColors = ['#58CC02', '#1CB0F6', '#FF9600', '#CE82FF', '#FF4B4B', '#FFD700'];
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.5,
    color: confettiColors[i % confettiColors.length],
    rotation: Math.random() * 360,
  }));

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          {/* Confetti */}
          {particles.map((p) => (
            <motion.div
              key={p.id}
              className="absolute w-3 h-3 rounded-sm"
              style={{ backgroundColor: p.color, left: `${p.x}%`, top: '-5%' }}
              initial={{ y: '-10vh', rotate: 0 }}
              animate={{
                y: '110vh',
                rotate: p.rotation + 360,
              }}
              transition={{
                duration: 2 + Math.random(),
                delay: p.delay,
                ease: 'easeIn',
                repeat: Infinity,
              }}
            />
          ))}

          {/* Modal */}
          <motion.div
            className="bg-white rounded-3xl p-8 mx-4 max-w-sm w-full text-center shadow-2xl"
            initial={{ scale: 0.5, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.5, opacity: 0, y: 50 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              className="text-6xl mb-4"
              animate={{ scale: [1, 1.2, 1], rotate: [0, -10, 10, 0] }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 3 }}
            >
              🎉
            </motion.div>

            <motion.div
              className="text-4xl font-extrabold text-duo-green mb-2 animate-level-up inline-block px-6 py-2 rounded-2xl"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 300 }}
            >
              LEVEL {level}!
            </motion.div>

            <h2 className="text-2xl font-bold text-duo-text mb-2">{title}</h2>
            <p className="text-duo-text-secondary mb-6">
              干得漂亮！你离 Offer 又近了一步！
            </p>

            <motion.button
              className="bg-duo-green text-white font-bold px-8 py-3 rounded-2xl shadow-[0_4px_0_#46A302] btn-press cursor-pointer"
              onClick={onClose}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              继续闯关！
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
