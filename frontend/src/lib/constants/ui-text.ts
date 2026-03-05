export const UI_TEXT = {
  app: {
    name: 'TELEPATH',
  },
  auth: {
    login: {
      title: 'Login',
      userIdLabel: 'User ID',
      passwordLabel: 'Pass Key',
      userIdPlaceholder: 'Guest',
      passwordPlaceholder: '••••',
      submitButton: 'Go',
      errorUnreachable: 'Server is unreachable. Please check your connection.',
    },
    signup: {
      title: 'Signup',
      usernameLabel: 'Username',
      passwordLabel: 'Passkey',
      confirmPasswordLabel: 'Confirm Passkey',
      usernamePlaceholder: 'Guest',
      passwordPlaceholder: '••••',
      submitButton: 'Signup',
      errorPasswordMismatch: 'Passkeys do not match',
      errorUnreachable: 'Server is unreachable. Please check your connection.',
    },
  },
  nav: {
    tabs: {
      home: 'HOME',
      settings: 'SETTINGS',
    },
    buttons: {
      disconnect: 'Disconnect',
      back: '← Back',
    },
  },
  home: {
    title: 'NETWORK',
    subtitle: 'Available Frequencies',
    identityLabel: 'Identity',
    guestUsername: 'GUEST',
    createButton: 'Initialize',
    emptyState: 'Empty Signal',
    roomStatus: 'STATUS: ACTIVE',
    modal: {
      title: 'NEW CHANNEL',
      subtitle: 'Specify Frequency Name',
      nameLabel: 'Name',
      namePlaceholder: 'E.g. RED_ZONE',
      abortButton: 'Abort',
      confirmButton: 'Confirm',
    },
  },
  chat: {
    connectedLabel: 'Connected // Frequency_',
    inputPlaceholder: 'Type packet content...',
    sendButton: 'Transmit',
  },
  error: {
    title: 'ERROR',
    message: 'An unexpected system failure occurred.',
  },
  footer: {
    pages: {
      login: 'Login',
      signup: 'Signup',
      dashboard: 'Dashboard',
      terminal: 'Terminal',
    },
  },
  theme: {
    icons: {
      light: '⏾',
      dark: '☀︎',
    },
  },
} as const;
