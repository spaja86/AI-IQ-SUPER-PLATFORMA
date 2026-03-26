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
      className={`group rounded-xl border border-white/10 bg-white/5 p-6 transition-all duration-200 hover:border-[#7c3aed]/40 hover:bg-white/[0.07] hover:shadow-lg hover:shadow-[#7c3aed]/5 ${className}`}
    >
      <div className="mb-3 text-3xl">{icon}</div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      {subtitle && (
        <p className="mt-0.5 text-sm text-zinc-400">{subtitle}</p>
      )}
      <p className="mt-2 text-sm leading-relaxed text-zinc-400">
        {description}
      </p>
      {href && (
        <span className="mt-4 inline-flex items-center text-sm font-medium text-[#7c3aed] transition-colors group-hover:text-[#2563eb]">
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
