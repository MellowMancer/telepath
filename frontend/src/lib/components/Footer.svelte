<script lang="ts">
	import { themeState } from '$lib/theme.svelte';
	import { UI_TEXT } from '$lib/constants/index.js';

	let { page } = $props<{
		page: string;
	}>();
</script>

<div class="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 opacity-40 font-mono text-xs sm:text-sm pointer-events-none">
	{UI_TEXT.app.name} // {page.toUpperCase()} // {themeState.isDark ? 'NIGHT' : 'DAY'}
</div>