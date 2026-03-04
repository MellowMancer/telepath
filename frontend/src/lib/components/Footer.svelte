<script>
	let { page, themeState } = $props();
</script>

<div class="absolute bottom-6 left-6 opacity-40 font-mono text-sm pointer-events-none">
	TELEPATH // {page.toUpperCase()} // {themeState.isDark ? 'NIGHT' : 'DAY'}
</div>