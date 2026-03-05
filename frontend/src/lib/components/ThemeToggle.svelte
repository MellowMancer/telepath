<script lang="ts">
	import { themeState, toggleTheme } from '$lib/theme.svelte';
	import { UI_TEXT } from '$lib/constants/index.js';

	let {
		position = 'absolute',
		size = 'md'
	} = $props<{
		position?: 'absolute' | 'fixed';
		size?: 'sm' | 'md' | 'lg';
	}>();

	const sizeClasses: Record<string, string> = {
		sm: 'w-8 h-8 text-sm',
		md: 'w-10 h-10 sm:w-12 sm:h-12 text-base',
		lg: 'w-14 h-14 text-lg'
	};
</script>

<button
	onclick={toggleTheme}
	class="{position} top-4 sm:top-6 lg:top-8 right-4 sm:right-6 lg:right-8 {sizeClasses[size]} rounded-full border-2 border-(--text-secondary) flex items-center justify-center hover:scale-110 transition-all z-50">
	{themeState.isDark ? UI_TEXT.theme.icons.dark : UI_TEXT.theme.icons.light}
</button>