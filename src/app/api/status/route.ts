import { NextResponse } from "next/server";
import { platforms, getOverallProgress } from "@/lib/platforms";
import { itProducts } from "@/lib/it-products";

export async function GET() {
  const overallProgress = getOverallProgress();

  return NextResponse.json({
    company: "Kompanija SPAJA",
    platform: "AI IQ SUPER PLATFORMA",
    timestamp: new Date().toISOString(),
    overallProgress,
    vercelReady: overallProgress >= 100,
    summary: {
      totalPlatforms: platforms.length,
      activePlatforms: platforms.filter(
        (p) => p.status === "active" || p.status === "development"
      ).length,
      readyPlatforms: platforms.filter((p) => p.status === "ready").length,
      totalITProducts: itProducts.length,
    },
    platforms: platforms.map((p) => ({
      id: p.id,
      name: p.name,
      status: p.status,
      progress: p.progress,
      category: p.category,
    })),
  });
}
