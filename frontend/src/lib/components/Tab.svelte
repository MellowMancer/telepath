<script>
	import { goto } from '$app/navigation';
	let { label, redirectTo, isActiveTab } = $props();
</script>

<button 
    onclick={() => goto(redirectTo)}
    class="px-8 py-2 text-2xl font-bold rounded-sm transition-all w-48 text-left
    {isActiveTab ? 'bg-(--accent-orange) text-white shadow-lg' : 'bg-(--accent-teal)/30 text-(--text-secondary)'}">
    {label}
</button>