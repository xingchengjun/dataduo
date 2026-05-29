import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface HintProps {
  hints: string[];
}

export default function Hint({ hints }: HintProps) {
  const [showHints, setShowHints] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);

  const currentHint = hints[hintIndex];
  const hasMore = hintIndex < hints.length - 1;

  const handleShowHint = () => {
    if (!showHints) {
      setShowHints(true);
      setHintIndex(0);
    } else if (hasMore) {
      setHintIndex((i) => i + 1);
    }
  };

  if (hints.length === 0) return null;

  return (
    <div className="mt-2">
      <button
        onClick={handleShowHint}
        className="text-sm text-duo-text-secondary hover:text-duo-blue font-semibold transition-colors flex items-center gap-1 cursor-pointer"
      >
        <span>💡</span>
        {!showHints
          ? '需要提示？'
          : hasMore
          ? `还有 ${hints.length - hintIndex - 1} 个提示 (点击查看下一个)`
          : '没有更多提示了'}
      </button>
      <AnimatePresence>
        {showHints && (
          <motion.div
            className="mt-2 p-3 bg-duo-orange-light rounded-xl border border-duo-orange/30"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <p className="text-sm text-duo-text font-medium">
              💡 提示 {hintIndex + 1}/{hints.length}：{currentHint}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
