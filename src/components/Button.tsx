import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { useThemeStore } from '../store';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
}

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  className = '',
  disabled,
  ...rest
}: ButtonProps) => {
  const { theme } = useThemeStore();

  const getThemeColor = () => {
    switch (theme) {
      case 'green':
        return 'cyber-green';
      case 'red':
        return 'cyber-red';
      case 'purple':
        return 'cyber-purple';
      default:
        return 'cyber-blue';
    }
  };

  // Base styles for all buttons
  const baseStyles = 'relative font-medium tracking-wider uppercase transition-all duration-300 flex items-center justify-center overflow-hidden';

  // Size styles
  const sizeStyles = {
    sm: 'px-3 py-1 text-xs',
    md: 'px-5 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  // Variant styles based on theme and variant
  const getVariantStyles = () => {
    const themeColor = getThemeColor();

    switch (variant) {
      case 'primary':
        return `border border-${themeColor}-glow bg-${themeColor}-glow/10 text-${themeColor}-light hover:bg-${themeColor}-glow/20 focus:outline-none focus:ring-2 focus:ring-${themeColor}-glow/50 active:bg-${themeColor}-glow/30`;
      case 'secondary':
        return `border border-${themeColor}-glow/50 bg-transparent text-${themeColor}-light/80 hover:border-${themeColor}-glow hover:text-${themeColor}-light focus:outline-none focus:ring-2 focus:ring-${themeColor}-glow/50`;
      case 'danger':
        return 'border border-cyber-red-glow bg-cyber-red-glow/10 text-cyber-red-light hover:bg-cyber-red-glow/20 focus:outline-none focus:ring-2 focus:ring-cyber-red-glow/50 active:bg-cyber-red-glow/30';
      case 'success':
        return 'border border-cyber-green-glow bg-cyber-green-glow/10 text-cyber-green-light hover:bg-cyber-green-glow/20 focus:outline-none focus:ring-2 focus:ring-cyber-green-glow/50 active:bg-cyber-green-glow/30';
      default:
        return `border border-${themeColor}-glow bg-${themeColor}-glow/10 text-${themeColor}-light hover:bg-${themeColor}-glow/20 focus:outline-none focus:ring-2 focus:ring-${themeColor}-glow/50 active:bg-${themeColor}-glow/30`;
    }
  };

  // Disabled styles
  const disabledStyles = disabled || isLoading
    ? 'opacity-50 cursor-not-allowed pointer-events-none'
    : '';

  // Full width style
  const widthStyle = fullWidth ? 'w-full' : '';

  // Combined styles
  const buttonStyles = `${baseStyles} ${sizeStyles[size]} ${getVariantStyles()} ${widthStyle} ${disabledStyles} ${className}`;

  return (
    <button className={buttonStyles} disabled={disabled || isLoading} {...rest}>
      {isLoading ? (
        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : null}
      {children}
    </button>
  );
};

export default Button;
