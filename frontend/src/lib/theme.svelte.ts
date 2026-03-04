export const themeState = $state({
    isDark: false
});

export function toggleTheme() {
    themeState.isDark = !themeState.isDark;
    if (typeof document !== 'undefined') {
        document.documentElement.classList.toggle('dark', themeState.isDark);
    }
}