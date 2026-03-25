import { NextResponse } from "next/server";
import { platforms, getOverallProgress, getDeployStats } from "@/lib/platforms";
import { itProducts } from "@/lib/it-products";

export async function GET() {
  const overallProgress = getOverallProgress();
  const deployStats = getDeployStats();

  return NextResponse.json({
    company: "Kompanija SPAJA",
    platform: "AI IQ SUPER PLATFORMA",
    classification: "Digitalna Industrija",
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
      sectors: {
        finance: platforms.filter((p) => p.category === "finance").length,
        ai: platforms.filter((p) => p.category === "ai").length,
        core: platforms.filter((p) => p.category === "core").length,
        global: platforms.filter((p) => p.category === "global").length,
        social: platforms.filter((p) => p.category === "social").length,
        tools: platforms.filter((p) => p.category === "tools").length,
      },
    },
    deployment: {
      deployed: deployStats.deployed,
      failing: deployStats.failing,
      noDomain: deployStats.noDomain,
      notDeployed: deployStats.notDeployed,
      domainsOwned: deployStats.withDomain,
      domainsNeeded: deployStats.needDomain,
    },
    platforms: platforms.map((p) => ({
      id: p.id,
      name: p.name,
      status: p.status,
      progress: p.progress,
      category: p.category,
      deploy: {
        status: p.deploy.status,
        domain: p.deploy.domain || null,
        framework: p.deploy.framework,
      },
    })),
  });
}
