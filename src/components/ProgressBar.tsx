import {
  getProgressColor,
} from "@/lib/platforms";

interface ProgressBarProps {
  progress: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  label?: string;
}

export default function ProgressBar({
  progress,
  size = "md",
  showLabel = true,
  label,
}: ProgressBarProps) {
  const heights = { sm: "h-1.5", md: "h-2.5", lg: "h-4" };
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className="w-full">
      <div
        className={`w-full bg-gray-700 rounded-full ${heights[size]} overflow-hidden`}
        role="progressbar"
        aria-valuenow={clampedProgress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label || `Progres: ${clampedProgress}%`}
      >
        <div
          className={`${getProgressColor(clampedProgress)} ${heights[size]} rounded-full progress-bar`}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs text-gray-400 mt-1 inline-block">
          {clampedProgress}%
        </span>
      )}
    </div>
  );
}
