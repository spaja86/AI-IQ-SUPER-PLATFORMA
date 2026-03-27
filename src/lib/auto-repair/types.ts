export type DiagnosticStatus = 'ok' | 'warning' | 'error' | 'critical';

export interface DiagnosticCheck {
  id: string;
  naziv: string;
  opis: string;
  status: DiagnosticStatus;
  poruka: string;
  timestamp: string;
}

export interface RepairAction {
  id: string;
  naziv: string;
  opis: string;
  tip: 'automatski' | 'poluautomatski' | 'rucni';
  status: 'uspesno' | 'neuspesno' | 'u_toku' | 'ceka';
  timestamp: string;
}

export interface DiagnosticReport {
  ukupnoProvera: number;
  uspesnih: number;
  upozorenja: number;
  gresaka: number;
  kriticnih: number;
  zdravlje: number;
  provere: DiagnosticCheck[];
  timestamp: string;
}

export interface RepairHistory {
  akcija: RepairAction;
  rezultat: string;
  timestamp: string;
}
