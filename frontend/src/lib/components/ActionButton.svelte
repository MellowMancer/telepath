<script lang="ts">


    type ButtonVariant = keyof typeof themes;

    let { 
        label, 
        onclick, 
        variant = "secondary",
        isActive = false,
        size = 'md'
    } = $props<{
        label: string;
        onclick?: (e: MouseEvent) => void;
        variant?: ButtonVariant; // This fixes the error
        isActive?: boolean;
        size?: 'md' | 'lg';
    }>();

    const themes: Record<string, string> = {
        primary: 'bg-[var(--accent-orange)] text-white shadow-lg',
        secondary: 'bg-[var(--accent-teal)]/30 text-[var(--text-secondary)] hover:bg-[var(--accent-teal)]/50',
        danger: 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white'
    };
</script>

<button 
	{onclick}
	class="px-6 py-2 font-bold rounded-sm transition-all text-left uppercase tracking-tighter
    {isActive ? themes.primary : themes[variant]} 
    {size === 'lg' ? 'text-xl px-10 py-3' : 'text-lg'}"
>
	{label} {isActive ? '➜' : ''}
</button>