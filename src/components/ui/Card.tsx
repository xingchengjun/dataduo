import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  animate?: boolean;
  padding?: 'sm' | 'md' | 'lg' | 'none';
}

const paddingStyles = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

export default function Card({
  children,
  className = '',
  onClick,
  animate = false,
  padding = 'md',
}: CardProps) {
  const baseStyles = 'bg-white rounded-2xl border-2 border-duo-surface-dark';

  if (animate) {
    return (
      <motion.div
        className={`${baseStyles} ${paddingStyles[padding]} ${className}`}
        onClick={onClick}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        whileHover={onClick ? { scale: 1.02, cursor: 'pointer' } : undefined}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div
      className={`${baseStyles} ${paddingStyles[padding]} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
