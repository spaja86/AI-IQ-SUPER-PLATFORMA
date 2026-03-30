import type { NavItem } from './types';

export const navigation: NavItem[] = [
  { label: 'Početna', href: '/', icon: '🏠', description: 'Digitalna Industrija — pregled' },
  { label: 'Dashboard', href: '/dashboard', icon: '📊', description: 'Statistika i stanje ekosistema' },
  { label: 'Industrija', href: '/industrija', icon: '🏭', description: 'O digitalnoj industriji' },
  { label: 'Platforme', href: '/platforme', icon: '🧩', description: 'Sve platforme u ekosistemu' },
  { label: 'Organizacije', href: '/organizacije', icon: '🏢', description: 'Organizaciona struktura' },
  { label: 'Kompanije', href: '/kompanije', icon: '🏛️', description: 'Kompanije u ekosistemu' },
  { label: 'Proizvodi', href: '/proizvodi', icon: '📦', description: 'IT proizvodi i alati' },
  { label: 'Ekosistem', href: '/ekosistem', icon: '🌐', description: 'Celokupan pregled ekosistema' },
  { label: 'Deploy', href: '/deploy', icon: '🚀', description: 'Status deploy-a platformi' },
];
