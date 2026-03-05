const STORAGE_KEY = 'telepath-theme';

// Initialize theme from localStorage or system preference
function getInitialTheme(): boolean {
    if (typeof window === 'undefined') return false;

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        return stored === 'dark';
    }

    // Fallback to system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export const themeState = $state({
    isDark: getInitialTheme()
});

// Apply theme on initialization
if (typeof document !== 'undefined') {
    document.documentElement.classList.toggle('dark', themeState.isDark);
}

export function toggleTheme() {
    themeState.isDark = !themeState.isDark;

    if (typeof document !== 'undefined') {
        document.documentElement.classList.toggle('dark', themeState.isDark);
    }

    if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, themeState.isDark ? 'dark' : 'light');
    }
}