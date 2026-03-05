<script lang="ts">
	let { label, value = $bindable(), type = "text", placeholder = "", size = 'md', onEnter } = $props<{
		label?: string;
		value: string;
		type?: string;
		placeholder?: string;
		size?: 'sm' | 'md' | 'lg';
		onEnter?: () => void;
	}>();

	const textSizes: Record<string, string> = {
		sm: 'text-base sm:text-lg',
		md: 'text-lg sm:text-xl',
		lg: 'text-xl sm:text-2xl'
	};

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Enter' && onEnter) {
			e.preventDefault();
			onEnter();
		}
	}
</script>

<div class="border-(--grid-color) pb-2 flex justify-between items-center p-2 rounded-sm transition-colors">
	{#if label}
		<span class="{textSizes[size]} font-bold opacity-70 bg-transparent">{label}</span>
	{/if}
	<input
		{type}
		bind:value
		onkeydown={handleKeyDown}
		class="bg-transparent text-right {textSizes[size]} font-bold outline-none w-full sm:w-1/2 text-(--text-primary) rounded-sm"
		{placeholder}
	/>
</div>