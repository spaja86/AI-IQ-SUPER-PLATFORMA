import Link from "next/link";
import {
  type Platform,
  getStatusLabel,
  getStatusColor,
} from "@/lib/platforms";
import ProgressBar from "./ProgressBar";

interface PlatformCardProps {
  platform: Platform;
}

export default function PlatformCard({ platform }: PlatformCardProps) {
  return (
    <div className="card-glow rounded-xl bg-[#111128] border border-[#1e1e3a] p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{platform.icon}</span>
          <div>
            <h3 className="font-bold text-white">{platform.name}</h3>
            <span className={`text-xs ${getStatusColor(platform.status)}`}>
              {getStatusLabel(platform.status)}
            </span>
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-400 mb-4 line-clamp-2">
        {platform.description}
      </p>

      <ProgressBar progres={platform.progress} velicina="sm" />

      <div className="flex flex-wrap gap-1.5 mt-4">
        {platform.technologies.slice(0, 3).map((tech) => (
          <span
            key={tech}
            className="text-xs px-2 py-0.5 rounded-full bg-blue-900/30 text-blue-300 border border-blue-800/30"
          >
            {tech}
          </span>
        ))}
      </div>

      <div className="flex gap-2 mt-4 pt-4 border-t border-gray-800">
        <Link
          href={platform.repo}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-gray-400 hover:text-blue-400 transition-colors flex items-center gap-1"
        >
          🐙 GitHub
        </Link>
        {platform.url !== platform.repo && (
          <Link
            href={platform.url}
            className="text-xs text-gray-400 hover:text-blue-400 transition-colors flex items-center gap-1"
          >
            🔗 Otvori
          </Link>
        )}
      </div>
    </div>
  );
}
