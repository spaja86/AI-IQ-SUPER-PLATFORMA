interface Props {
  progres?: number;
  progress?: number;
  velicina?: 'sm' | 'md' | 'lg';
  size?: 'sm' | 'md' | 'lg';
  oznaka?: boolean;
}

export default function ProgressBar({ progres, progress, velicina, size, oznaka = false }: Props) {
  const value = progres ?? progress ?? 0;
  const resolvedSize = velicina ?? size ?? 'md';
  const visina = resolvedSize === 'sm' ? 'h-1.5' : resolvedSize === 'lg' ? 'h-4' : 'h-2.5';
  const boja = value >= 90 ? 'bg-green-500' : value >= 70 ? 'bg-blue-500' : value >= 50 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div>
      {oznaka && (
        <div className="mb-1 flex justify-between text-xs text-gray-400">
          <span>Progres</span>
          <span>{value}%</span>
        </div>
      )}
      <div className={`${visina} overflow-hidden rounded-full bg-gray-700`} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
        <div className={`h-full rounded-full ${boja} transition-all duration-300`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}