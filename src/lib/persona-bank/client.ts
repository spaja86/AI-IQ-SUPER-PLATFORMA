// SpajaUltraOmegaCore -∞Ω+∞ — Persona Bank Client
// Kompanija SPAJA — Digitalna Industrija
//
// Shared client utility za sve agente koji koriste Persona Bank.
// Agenti pozivaju PersonaBankClient metode umesto direktnog pozivanja store-a.

import {
  registerPersona,
  getPersona,
  updatePersona,
  archivePersona,
  listPersonas,
  getPersonaBankStats,
  bulkImportPersonas,
} from './store';
import type {
  Persona,
  PersonaRegistrationInput,
  PersonaUpdateInput,
  PersonaBankListFilter,
  PersonaBankStats,
} from './types';

export class PersonaBankClient {
  constructor(private readonly agentId: string) {}

  register(input: PersonaRegistrationInput): Persona {
    return registerPersona(input, this.agentId);
  }

  get(id: string): Persona | null {
    return getPersona(id);
  }

  update(id: string, input: PersonaUpdateInput): Persona {
    return updatePersona(id, input, this.agentId);
  }

  archive(id: string): Persona {
    return archivePersona(id, this.agentId);
  }

  list(filter?: PersonaBankListFilter): Persona[] {
    return listPersonas(filter);
  }

  stats(): PersonaBankStats {
    return getPersonaBankStats();
  }

  bulkImport(inputs: PersonaRegistrationInput[]): { imported: number; errors: string[] } {
    return bulkImportPersonas(inputs, this.agentId);
  }
}

/**
 * Factory helper — creates a PersonaBankClient for the given agent.
 */
export function createPersonaBankClient(agentId: string): PersonaBankClient {
  return new PersonaBankClient(agentId);
}
