interface Props {
  progres: number;
  velicina?: 'sm' | 'md' | 'lg';
  oznaka?: boolean;
}

export default function ProgressBar({ progres, velicina = 'md', oznaka = false }: Props) {
  const visina = velicina === 'sm' ? 'h-1.5' : velicina === 'lg' ? 'h-4' : 'h-2.5';
  const boja = progres >= 90 ? 'bg-green-500' : progres >= 70 ? 'bg-blue-500' : progres >= 50 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div>
      {oznaka && (
        <div className="mb-1 flex justify-between text-xs text-gray-400">
          <span>Progres</span>
          <span>{progres}%</span>
        </div>
      )}
      <div className={`${visina} overflow-hidden rounded-full bg-gray-700`} role="progressbar" aria-valuenow={progres} aria-valuemin={0} aria-valuemax={100}>
        <div className={`h-full rounded-full ${boja} transition-all duration-300`} style={{ width: `${progres}%` }} />
      </div>
    </div>
  );
}
