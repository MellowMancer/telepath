<script>
	import { themeState, toggleTheme } from '$lib/theme.svelte';
</script>

<button 
	onclick={toggleTheme}
	class="absolute top-8 right-8 w-12 h-12 rounded-full border-2 border-[var(--text-secondary)] flex items-center justify-center hover:scale-110 transition-all z-50">
	{themeState.isDark ? '☀️' : '🌙'}
</button>