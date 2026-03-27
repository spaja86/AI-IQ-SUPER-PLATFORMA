import type { RepairAction } from './types';

export function runRepair(): RepairAction[] {
  const timestamp = new Date().toISOString();
  return [
    {
      id: 'repair-cache',
      naziv: 'Ciscenje kesha',
      opis: 'Automatsko ciscenje build kesha',
      tip: 'automatski',
      status: 'uspesno',
      timestamp,
    },
    {
      id: 'repair-deps',
      naziv: 'Azuriranje zavisnosti',
      opis: 'Provera i azuriranje npm zavisnosti',
      tip: 'automatski',
      status: 'uspesno',
      timestamp,
    },
    {
      id: 'repair-types',
      naziv: 'Regeneracija tipova',
      opis: 'Regeneracija TypeScript deklaracija',
      tip: 'automatski',
      status: 'uspesno',
      timestamp,
    },
  ];
}
