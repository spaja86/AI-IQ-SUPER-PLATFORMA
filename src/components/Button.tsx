'use client';

import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive' | 'success' | 'warning';
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: 'spaja-btn-primary text-white',
  secondary: 'spaja-btn-secondary',
  ghost: 'spaja-btn-ghost',
  destructive: 'spaja-btn-destructive',
  success: 'border border-green-500/60 bg-green-600 text-white hover:bg-green-500',
  warning: 'border border-yellow-500/40 bg-yellow-600 text-white hover:bg-yellow-500',
};

const SIZE_CLASS: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-sm',
  icon: 'h-9 w-9 p-0 text-sm',
};

function cx(...values: Array<string | undefined | null | false>): string {
  return values.filter(Boolean).join(' ');
}

export function buttonClassName({
  variant = 'primary',
  size = 'md',
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}): string {
  return cx(
    'spaja-focus-ring inline-flex items-center justify-center gap-2 rounded-lg font-medium transition disabled:cursor-not-allowed disabled:opacity-60',
    VARIANT_CLASS[variant],
    SIZE_CLASS[size],
    className,
  );
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  loadingLabel?: ReactNode;
}

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  loadingLabel,
  className,
  children,
  disabled,
  type = 'button',
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;
  return (
    <button
      type={type}
      className={buttonClassName({ variant, size, className })}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? (
        <>
          <Spinner />
          {loadingLabel ?? children}
        </>
      ) : (
        children
      )}
    </button>
  );
}
