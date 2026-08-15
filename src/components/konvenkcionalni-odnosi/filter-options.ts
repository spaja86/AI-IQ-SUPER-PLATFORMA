import type { RelationType, RelationStatus } from '@/lib/konvenkcionalni-odnosi';

export const TYPE_FILTER_OPTIONS: { value: RelationType | ''; label: string }[] = [
  { value: '', label: 'Svi tipovi' },
  { value: 'hierarchical', label: 'Hijerarhijski' },
  { value: 'peer', label: 'Peer' },
  { value: 'mentorship', label: 'Mentorstvo' },
  { value: 'sponsorship', label: 'Sponzorstvo' },
  { value: 'collaboration', label: 'Saradnja' },
  { value: 'contractual', label: 'Ugovorni' },
  { value: 'affiliation', label: 'Afilijacija' },
];

export const STATUS_FILTER_OPTIONS: { value: RelationStatus | ''; label: string }[] = [
  { value: '', label: 'Svi statusi' },
  { value: 'DRAFT', label: 'Draft' },
  { value: 'ACTIVE', label: 'Aktivni' },
  { value: 'SUSPENDED', label: 'Suspendovani' },
  { value: 'ARCHIVED', label: 'Arhivirani' },
  { value: 'TERMINATED', label: 'Raskinuti' },
];
