<script>
	import { goto } from '$app/navigation';
	let { label, redirectTo, isActiveTab } = $props();
</script>

<button 
    onclick={() => goto(redirectTo)}
    class="px-8 py-2 text-2xl font-bold rounded-sm transition-all w-48 text-left
    {isActiveTab ? 'bg-[var(--accent-orange)] text-white shadow-lg' : 'bg-[var(--accent-teal)]/30 text-[var(--text-secondary)]'}">
    {label}
</button>