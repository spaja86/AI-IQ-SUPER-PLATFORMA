import {
  getProgressColor,
} from "@/lib/platforms";

interface ProgressBarProps {
  progress: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export default function ProgressBar({
  progress,
  size = "md",
  showLabel = true,
}: ProgressBarProps) {
  const heights = { sm: "h-1.5", md: "h-2.5", lg: "h-4" };

  return (
    <div className="w-full">
      <div className={`w-full bg-gray-700 rounded-full ${heights[size]} overflow-hidden`}>
        <div
          className={`${getProgressColor(progress)} ${heights[size]} rounded-full progress-bar`}
          style={{ width: `${progress}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs text-gray-400 mt-1 inline-block">
          {progress}%
        </span>
      )}
    </div>
  );
}
