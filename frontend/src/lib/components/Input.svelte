<script>
	let { label, value = $bindable(), type = "text", placeholder = "" } = $props();
</script>

<div class="border-[var(--grid-color)] pb-2 flex justify-between items-center p-2 rounded-sm transition-colors">
	<span class="text-xl font-bold opacity-70 bg-transparent">{label}</span>
	<input 
		{type}
		bind:value 
		class="bg-transparent text-right text-xl font-bold outline-none w-1/2 text-[var(--text-primary)] rounded-sm" 
		{placeholder} 
	/>
</div>