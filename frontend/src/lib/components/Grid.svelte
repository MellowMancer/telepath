<script>
	let { children } = $props();
</script>

<div class="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 relative transition-colors duration-500">
	<div class="w-full max-w-full sm:max-w-2xl lg:max-w-4xl xl:max-w-6xl z-10 flex flex-col md:flex-row gap-6 sm:gap-8 lg:gap-12 items-center">
		{@render children()}
	</div>
</div>