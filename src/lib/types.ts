// ============================================================================
// AI-IQ SUPER PLATFORMA — Core Type Definitions
// Digitalna Industrija | Kompanija SPAJA
// ============================================================================

/** Status of any entity in the ecosystem */
export type EntityStatus = 'active' | 'development' | 'planned' | 'archived';

/** Priority level */
export type Priority = 'critical' | 'high' | 'medium' | 'low';

// ----------------------------------------------------------------------------
// Platforma (Platform)
// ----------------------------------------------------------------------------

export type PlatformCategory =
  | 'core'
  | 'finance'
  | 'global'
  | 'ai'
  | 'social'
  | 'tools'
  | 'commerce'
  | 'education'
  | 'media';

export interface Platform {
  id: string;
  name: string;
  description: string;
  category: PlatformCategory;
  status: EntityStatus;
  icon: string;
  url?: string;
  techStack: string[];
  features: string[];
  deploy?: DeployInfo;
}

export interface DeployInfo {
  status: 'deployed' | 'staging' | 'development' | 'planned';
  domain?: string;
  vercelProject?: string;
  framework?: string;
  buildCommand?: string;
}

// ----------------------------------------------------------------------------
// Organizacija (Organization)
// ----------------------------------------------------------------------------

export type OrganizationType =
  | 'division'
  | 'department'
  | 'team'
  | 'unit'
  | 'lab'
  | 'foundation';

export interface Organization {
  id: string;
  name: string;
  description: string;
  type: OrganizationType;
  status: EntityStatus;
  icon: string;
  parentId?: string;
  platformIds: string[];
  mission: string;
  capabilities: string[];
}

// ----------------------------------------------------------------------------
// Kompanija (Company)
// ----------------------------------------------------------------------------

export type CompanyType =
  | 'parent'
  | 'subsidiary'
  | 'joint-venture'
  | 'startup'
  | 'spin-off';

export interface Company {
  id: string;
  name: string;
  description: string;
  type: CompanyType;
  status: EntityStatus;
  icon: string;
  industry: string;
  products: string[];
  platformIds: string[];
  organizationIds: string[];
}

// ----------------------------------------------------------------------------
// Proizvod (Product)
// ----------------------------------------------------------------------------

export type ProductCategory =
  | 'acceleration'
  | 'monitoring'
  | 'security'
  | 'ai'
  | 'deployment'
  | 'integration'
  | 'data'
  | 'communication'
  | 'analytics'
  | 'automation';

export interface Product {
  id: string;
  name: string;
  description: string;
  category: ProductCategory;
  status: EntityStatus;
  icon: string;
  version: string;
  platformId?: string;
  features: string[];
  techStack: string[];
}

// ----------------------------------------------------------------------------
// Digitalna Industrija (Digital Industry — top-level entity)
// ----------------------------------------------------------------------------

export interface DigitalnaIndustrija {
  name: string;
  description: string;
  version: string;
  founded: string;
  mission: string;
  vision: string;
  stats: IndustrijaStats;
}

export interface IndustrijaStats {
  totalPlatforms: number;
  totalOrganizations: number;
  totalCompanies: number;
  totalProducts: number;
  activePlatforms: number;
  activeOrganizations: number;
  activeCompanies: number;
  activeProducts: number;
}

// ----------------------------------------------------------------------------
// Navigation
// ----------------------------------------------------------------------------

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  description?: string;
}
