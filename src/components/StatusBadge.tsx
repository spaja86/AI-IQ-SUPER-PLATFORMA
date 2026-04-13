interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

const statusStyles: Record<string, string> = {
  active: 'bg-green-500/10 text-green-400 border-green-500/20',
  development: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  planned: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  concept: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
};

const sizeStyles: Record<string, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
};

export default function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const colorClasses = statusStyles[status] ?? statusStyles.concept;
  const sizeClasses = sizeStyles[size];

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium capitalize ${colorClasses} ${sizeClasses}`}
    >
      {status}
    </span>
  );
}
