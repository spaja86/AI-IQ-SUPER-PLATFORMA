import Link from 'next/link';

interface CardProps {
  icon: string;
  title: string;
  subtitle?: string;
  description: string;
  href?: string;
  className?: string;
}

export default function Card({
  icon,
  title,
  subtitle,
  description,
  href,
  className = '',
}: CardProps) {
  const content = (
    <div
      className={`spaja-card group p-6 ${className}`}
    >
      <div className="mb-3 text-3xl">{icon}</div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      {subtitle && (
        <p className="mt-0.5 text-sm text-[var(--text-muted)]">{subtitle}</p>
      )}
      <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
        {description}
      </p>
      {href && (
        <span className="mt-4 inline-flex items-center text-sm font-medium text-blue-400 transition-colors group-hover:text-blue-300">
          Saznajte više →
        </span>
      )}
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
