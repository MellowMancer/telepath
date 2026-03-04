<script>
	let { label, onclick } = $props();
</script>

<button {onclick} class="bg-(--accent-orange) text-white px-5 py-3 text-2xl font-black rounded-sm hover:brightness-110 transition-all shadow-xl active:translate-y-1 space-between flex">
	<p class="pr-2">{label}</p><p class="pl-2">-></p>
</button>