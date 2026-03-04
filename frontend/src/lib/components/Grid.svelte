<script>
	let { children } = $props();
</script>

<div class="min-h-screen flex items-center justify-center p-6 relative transition-colors duration-500">
	<div class="w-full max-w-4xl z-10 flex flex-col md:flex-row gap-12 items-center">
		{@render children()}
	</div>
</div>