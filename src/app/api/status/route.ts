import { NextResponse } from "next/server";
import { platforms, getOverallProgress, getDeployStats } from "@/lib/platforms";
import { itProducts } from "@/lib/it-products";

export async function GET() {
  try {
    const overallProgress = getOverallProgress();
    const deployStats = getDeployStats();

    const deployedPlatforms = platforms.filter((p) => p.deploy.status === "deployed");
    const failingPlatforms = platforms.filter((p) => p.deploy.status === "failing");

    return NextResponse.json({
      company: "Kompanija SPAJA",
      platform: "AI IQ SUPER PLATFORMA",
      classification: "Digitalna Industrija",
      version: "2.0.0",
      environment: "production",
      region: "fra1",
      timestamp: new Date().toISOString(),
      health: "ok",
      overallProgress,
      vercelOptimized: true,
      optimizations: [
        "SSG (Static Site Generation) za sve stranice",
        "Edge caching sa stale-while-revalidate",
        "Security headeri (CSP, HSTS, X-Frame-Options, XSS Protection)",
        "SEO (sitemap.xml, robots.txt, Open Graph, meta robots)",
        "Accessibility (ARIA, skip-nav, focus-visible, reduced-motion)",
        "Responsive mobilni dizajn sa hamburger menijem",
        "Error boundary i custom 404/error stranice",
        "Loading skeleton animacije",
        "Immutable cache za statičke resurse",
      ],
      summary: {
        totalPlatforms: platforms.length,
        activePlatforms: platforms.filter(
          (p) => p.status === "active" || p.status === "development"
        ).length,
        readyPlatforms: platforms.filter((p) => p.status === "ready").length,
        planningPlatforms: platforms.filter((p) => p.status === "planning").length,
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
        deployedList: deployedPlatforms.map((p) => p.name),
        failingList: failingPlatforms.map((p) => ({
          name: p.name,
          domain: p.deploy.domain,
          fix: p.deploy.notes,
        })),
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
  } catch (error) {
    console.error("Status API error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        health: "error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
