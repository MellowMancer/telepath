<script>
	let { label, onclick } = $props();
</script>

<button 
	{onclick}
	class="bg-[var(--accent-orange)] text-white px-12 py-3 text-2xl font-black rounded-sm hover:brightness-110 transition-all shadow-xl active:translate-y-1 space-between">
	<span>{label}</span><span>-></span>
</button>