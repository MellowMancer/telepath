<script lang="ts">
	import { goto } from '$app/navigation';
    import { TYPOGRAPHY } from '$lib/constants/index.js';
	let { label, redirectTo, isActiveTab } = $props();
</script>


<button
    onclick={() => goto(redirectTo)}
    class="font-bold rounded-sm transition-all text-left uppercase px-2 py-2 sm:px-4 md:px-6 text-sm sm:text-lg md:text-md w-full sm:w-40 md:w-48
    {isActiveTab ? 'bg-(--accent-orange) text-white shadow-lg' : 'bg-(--accent-teal)/30 text-(--text-secondary)'}{TYPOGRAPHY.tracking.tighter}">
    {label}
</button>