export type LanguageCode = 'it' | 'en';

export const languageNameMap: Record<LanguageCode, string> = {
  it: 'Italiano',
  en: 'English',
};

export const translations: Record<LanguageCode, Record<string, string>> = {
  it: {
    // Navigation
    dashboard: 'Dashboard',
    profile: 'Profilo',
    content: 'Contenuti',
    settings: 'Impostazioni',
    logout: 'Esci',

    // Dashboard
    addNewVote: 'Aggiungi Nuovo Voto',
    yourVotes: 'I Tuoi Voti',
    voteValue: 'Valore Voto',
    subject: 'Materia',
    type: 'Tipo',
    weight: 'Peso (%)',
    includeAverage: 'Includi nella media',
    addVote: 'Aggiungi Voto',

    // Averages
    totalArithmeticAverage: 'Media Aritmetica Totale',
    totalOralWrittenAverage: 'Media Orale-Scritta Totale',
    subjectAverages: 'Medie per Materia',

    // Types
    scritto: 'Scritto',
    orale: 'Orale',
    altro: 'Altro',

    // Will Chat
    askWill: 'Chiedi a Will...',
    willThinking: 'Will sta pensando...',

    // Profile
    profileSettings: 'Impostazioni Profilo',
    fullName: 'Nome Completo',
    edit: 'Modifica',
    save: 'Salva',
    cancel: 'Annulla',
    accountInfo: 'Informazioni Account',
    email: 'Email',
    account: 'Account',

    // Settings
    theme: 'Tema',
    light: 'Chiaro',
    dark: 'Scuro',
    language: 'Lingua',

    // Content
    contentComingSoon: 'Funzione condivisione contenuti in arrivo!',
    contentDescription: 'Questa sezione ti permetterà di condividere video educativi e risorse con altri studenti.',

    // Footer
    madeBy: 'Creato da',

    // Search/Other
    recent: 'Recenti',
    more: 'Altro',
    extending: 'Estendendo...',
    share: 'Condividi',
  },
  en: {
    // Navigation
    dashboard: 'Dashboard',
    profile: 'Profile',
    content: 'Content',
    settings: 'Settings',
    logout: 'Logout',

    // Dashboard
    addNewVote: 'Add New Vote',
    yourVotes: 'Your Votes',
    voteValue: 'Vote Value',
    subject: 'Subject',
    type: 'Type',
    weight: 'Weight (%)',
    includeAverage: 'Include in average',
    addVote: 'Add Vote',

    // Averages
    totalArithmeticAverage: 'Total Arithmetic Average',
    totalOralWrittenAverage: 'Total Oral-Written Average',
    subjectAverages: 'Subject Averages',

    // Types
    scritto: 'Written',
    orale: 'Oral',
    altro: 'Other',

    // Will Chat
    askWill: 'Ask Will...',
    willThinking: 'Will is thinking...',

    // Profile
    profileSettings: 'Profile Settings',
    fullName: 'Full Name',
    edit: 'Edit',
    save: 'Save',
    cancel: 'Cancel',
    accountInfo: 'Account Information',
    email: 'Email',
    account: 'Account',

    // Settings
    theme: 'Theme',
    light: 'Light',
    dark: 'Dark',
    language: 'Language',

    // Content
    contentComingSoon: 'Content sharing feature coming soon!',
    contentDescription: 'This section will allow you to share educational videos and resources with other students.',

    // Footer
    madeBy: 'Made by',

    // Search/Other
    recent: 'Recent',
    more: 'More',
    extending: 'Extending...',
    share: 'Share',
  },
};