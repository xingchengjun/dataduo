import { motion } from 'framer-motion';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'gold';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  type?: 'button' | 'submit';
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-duo-green text-white shadow-[0_4px_0_#46A302] hover:bg-duo-green-hover active:shadow-[0_1px_0_#46A302]',
  secondary: 'bg-duo-blue text-white shadow-[0_4px_0_#1899D6] hover:bg-blue-500 active:shadow-[0_1px_0_#1899D6]',
  danger: 'bg-duo-red text-white shadow-[0_4px_0_#D63E3E] hover:bg-red-500 active:shadow-[0_1px_0_#D63E3E]',
  ghost: 'bg-white text-duo-text border-2 border-duo-surface-dark hover:bg-duo-surface active:border-gray-300',
  gold: 'bg-duo-gold text-white shadow-[0_4px_0_#DAA520] hover:bg-yellow-500 active:shadow-[0_1px_0_#DAA520]',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm rounded-xl',
  md: 'px-6 py-3 text-base rounded-2xl',
  lg: 'px-8 py-4 text-lg rounded-2xl',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  loading = false,
  className = '',
  type = 'button',
  fullWidth = false,
}: ButtonProps) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        btn-press font-bold tracking-wide
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          处理中...
        </span>
      ) : (
        children
      )}
    </motion.button>
  );
}
