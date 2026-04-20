// SpajaUltraOmegaCore -∞Ω+∞ — Internacionalizacija (i18n)
// Kompanija SPAJA — Digitalna Industrija
// Podrška za više jezika sa automatskom detekcijom

export type Locale = 'sr' | 'en' | 'de' | 'fr' | 'es';

export const SUPPORTED_LOCALES: { id: Locale; name: string; flag: string }[] = [
  { id: 'sr', name: 'Srpski', flag: '🇷🇸' },
  { id: 'en', name: 'English', flag: '🇬🇧' },
  { id: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { id: 'fr', name: 'Français', flag: '🇫🇷' },
  { id: 'es', name: 'Español', flag: '🇪🇸' },
];

// Translation keys for the chat interface
export interface ChatTranslations {
  welcome: string;
  welcomeSubtitle: string;
  inputPlaceholder: string;
  send: string;
  stop: string;
  newConversation: string;
  noConversations: string;
  loading: string;
  settings: string;
  customInstructions: string;
  customInstructionsHint: string;
  memory: string;
  memoryHint: string;
  defaultModel: string;
  save: string;
  cancel: string;
  share: string;
  delete: string;
  plan: string;
  shiftEnterHint: string;
  sessionExpired: string;
  networkError: string;
  viewPlans: string;
  signIn: string;
  register: string;
  signInPrompt: string;
  linkCopied: string;
}

const translations: Record<Locale, ChatTranslations> = {
  sr: {
    welcome: 'Dobrodošli u SpajaPro AI!',
    welcomeSubtitle: 'Postavite pitanje da započnete razgovor. Podržavam Markdown, kod, tabele i matematiku.',
    inputPlaceholder: 'Pošaljite poruku...',
    send: 'Pošalji',
    stop: '■ Stop',
    newConversation: 'Nova konverzacija',
    noConversations: 'Nema konverzacija',
    loading: 'Učitavanje...',
    settings: 'Podešavanja',
    customInstructions: 'Custom Instrukcije',
    customInstructionsHint: 'SpajaPro će slediti ove instrukcije u svakom razgovoru.',
    memory: 'Memorija',
    memoryHint: 'Informacije koje SpajaPro pamti između sesija.',
    defaultModel: 'Podrazumevani Model',
    save: 'Sačuvaj',
    cancel: 'Otkaži',
    share: 'Podeli',
    delete: 'Obriši',
    plan: 'Plan',
    shiftEnterHint: 'Shift+Enter za novi red • Enter za slanje',
    sessionExpired: 'Sesija je istekla. Prijavite se ponovo.',
    networkError: 'Greška u mreži. Pokušajte ponovo.',
    viewPlans: 'Pogledaj planove i prijavi se',
    signIn: 'Prijava',
    register: 'Registruj se',
    signInPrompt: 'Prijavite se da biste pristupili SpajaPro AI asistentu.',
    linkCopied: '✅ Link za deljenje kopiran u clipboard!',
  },
  en: {
    welcome: 'Welcome to SpajaPro AI!',
    welcomeSubtitle: 'Ask a question to start a conversation. I support Markdown, code, tables, and math.',
    inputPlaceholder: 'Send a message...',
    send: 'Send',
    stop: '■ Stop',
    newConversation: 'New conversation',
    noConversations: 'No conversations',
    loading: 'Loading...',
    settings: 'Settings',
    customInstructions: 'Custom Instructions',
    customInstructionsHint: 'SpajaPro will follow these instructions in every conversation.',
    memory: 'Memory',
    memoryHint: 'Information SpajaPro remembers between sessions.',
    defaultModel: 'Default Model',
    save: 'Save',
    cancel: 'Cancel',
    share: 'Share',
    delete: 'Delete',
    plan: 'Plan',
    shiftEnterHint: 'Shift+Enter for new line • Enter to send',
    sessionExpired: 'Session expired. Please sign in again.',
    networkError: 'Network error. Please try again.',
    viewPlans: 'View plans and sign in',
    signIn: 'Sign in',
    register: 'Register',
    signInPrompt: 'Sign in to access SpajaPro AI assistant.',
    linkCopied: '✅ Share link copied to clipboard!',
  },
  de: {
    welcome: 'Willkommen bei SpajaPro AI!',
    welcomeSubtitle: 'Stellen Sie eine Frage, um ein Gespräch zu beginnen. Ich unterstütze Markdown, Code, Tabellen und Mathematik.',
    inputPlaceholder: 'Nachricht senden...',
    send: 'Senden',
    stop: '■ Stopp',
    newConversation: 'Neues Gespräch',
    noConversations: 'Keine Gespräche',
    loading: 'Laden...',
    settings: 'Einstellungen',
    customInstructions: 'Benutzerdefinierte Anweisungen',
    customInstructionsHint: 'SpajaPro wird diesen Anweisungen in jedem Gespräch folgen.',
    memory: 'Gedächtnis',
    memoryHint: 'Informationen, die SpajaPro zwischen Sitzungen speichert.',
    defaultModel: 'Standardmodell',
    save: 'Speichern',
    cancel: 'Abbrechen',
    share: 'Teilen',
    delete: 'Löschen',
    plan: 'Plan',
    shiftEnterHint: 'Shift+Enter für neue Zeile • Enter zum Senden',
    sessionExpired: 'Sitzung abgelaufen. Bitte melden Sie sich erneut an.',
    networkError: 'Netzwerkfehler. Bitte versuchen Sie es erneut.',
    viewPlans: 'Pläne ansehen und anmelden',
    signIn: 'Anmelden',
    register: 'Registrieren',
    signInPrompt: 'Melden Sie sich an, um auf SpajaPro AI zuzugreifen.',
    linkCopied: '✅ Link zum Teilen in die Zwischenablage kopiert!',
  },
  fr: {
    welcome: 'Bienvenue sur SpajaPro AI !',
    welcomeSubtitle: 'Posez une question pour démarrer une conversation. Je supporte Markdown, code, tableaux et mathématiques.',
    inputPlaceholder: 'Envoyer un message...',
    send: 'Envoyer',
    stop: '■ Arrêter',
    newConversation: 'Nouvelle conversation',
    noConversations: 'Aucune conversation',
    loading: 'Chargement...',
    settings: 'Paramètres',
    customInstructions: 'Instructions personnalisées',
    customInstructionsHint: 'SpajaPro suivra ces instructions dans chaque conversation.',
    memory: 'Mémoire',
    memoryHint: "Informations que SpajaPro retient entre les sessions.",
    defaultModel: 'Modèle par défaut',
    save: 'Enregistrer',
    cancel: 'Annuler',
    share: 'Partager',
    delete: 'Supprimer',
    plan: 'Plan',
    shiftEnterHint: 'Shift+Enter pour nouvelle ligne • Enter pour envoyer',
    sessionExpired: 'Session expirée. Veuillez vous reconnecter.',
    networkError: 'Erreur réseau. Veuillez réessayer.',
    viewPlans: 'Voir les plans et se connecter',
    signIn: 'Se connecter',
    register: "S'inscrire",
    signInPrompt: 'Connectez-vous pour accéder à SpajaPro AI.',
    linkCopied: '✅ Lien de partage copié dans le presse-papiers !',
  },
  es: {
    welcome: '¡Bienvenido a SpajaPro AI!',
    welcomeSubtitle: 'Haz una pregunta para iniciar una conversación. Soporto Markdown, código, tablas y matemáticas.',
    inputPlaceholder: 'Enviar mensaje...',
    send: 'Enviar',
    stop: '■ Parar',
    newConversation: 'Nueva conversación',
    noConversations: 'Sin conversaciones',
    loading: 'Cargando...',
    settings: 'Configuración',
    customInstructions: 'Instrucciones personalizadas',
    customInstructionsHint: 'SpajaPro seguirá estas instrucciones en cada conversación.',
    memory: 'Memoria',
    memoryHint: 'Información que SpajaPro recuerda entre sesiones.',
    defaultModel: 'Modelo predeterminado',
    save: 'Guardar',
    cancel: 'Cancelar',
    share: 'Compartir',
    delete: 'Eliminar',
    plan: 'Plan',
    shiftEnterHint: 'Shift+Enter para nueva línea • Enter para enviar',
    sessionExpired: 'Sesión expirada. Inicie sesión nuevamente.',
    networkError: 'Error de red. Inténtelo de nuevo.',
    viewPlans: 'Ver planes e iniciar sesión',
    signIn: 'Iniciar sesión',
    register: 'Registrarse',
    signInPrompt: 'Inicie sesión para acceder a SpajaPro AI.',
    linkCopied: '✅ ¡Enlace para compartir copiado al portapapeles!',
  },
};

export function getTranslations(locale: Locale): ChatTranslations {
  return translations[locale] ?? translations.sr;
}

export function detectLocale(): Locale {
  if (typeof window === 'undefined') return 'sr';

  // Check localStorage preference
  const stored = localStorage.getItem('spajapro-locale') as Locale;
  if (stored && translations[stored]) return stored;

  // Auto-detect from browser
  const browserLang = navigator.language?.slice(0, 2) ?? 'sr';
  if (browserLang === 'sr' || browserLang === 'hr' || browserLang === 'bs') return 'sr';
  if (translations[browserLang as Locale]) return browserLang as Locale;

  return 'sr';
}

export function setLocale(locale: Locale): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('spajapro-locale', locale);
  }
}
