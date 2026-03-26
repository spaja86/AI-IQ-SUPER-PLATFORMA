export interface Platform {
  id: string;
  name: string;
  description: string;
  descriptionSr: string;
  category: 'core' | 'finance' | 'ai' | 'social' | 'tools' | 'global';
  icon: string;
  url?: string;
  status: 'active' | 'development' | 'planned';
  technologies: string[];
  repo?: string;
}

export interface Organization {
  id: string;
  name: string;
  description: string;
  descriptionSr: string;
  type: 'bank' | 'exchange' | 'company' | 'ai-platform' | 'organization' | 'omega-ai';
  icon: string;
  features: string[];
  status: 'active' | 'development' | 'planned';
  url?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  descriptionSr: string;
  category: 'acceleration' | 'monitoring' | 'security' | 'ai' | 'deployment' | 'integration' | 'data' | 'communication' | 'trading' | 'banking';
  icon: string;
  status: 'active' | 'development' | 'planned';
}

export interface Repository {
  id: string;
  name: string;
  fullName: string;
  description: string;
  url: string;
  language?: string;
  status: 'active' | 'skeleton' | 'concept';
  category: 'platform' | 'finance' | 'ai' | 'tools' | 'omega' | 'legacy';
  technologies: string[];
  features: string[];
}

export interface OmegaAI {
  id: string;
  name: string;
  target: string;
  description: string;
  descriptionSr: string;
  icon: string;
  status: 'concept' | 'development' | 'active';
  role: OmegaAIRole;
  responsibilities: string[];
}

export type OmegaAIRole =
  | 'architecture'
  | 'security'
  | 'repair'
  | 'build'
  | 'design'
  | 'performance'
  | 'strategy'
  | 'research'
  | 'quality'
  | 'integration'
  | 'analytics'
  | 'communication'
  | 'evolution'
  | 'testing'
  | 'documentation'
  | 'finance'
  | 'content'
  | 'scalability'
  | 'monitoring'
  | 'ecosystem'
  | 'vision';

export interface EcosystemStats {
  repositories: number;
  platforms: number;
  organizations: number;
  products: number;
  omegaAIs: number;
  technologies: string[];
  yearLaunched: number;
}
