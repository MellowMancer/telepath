<script lang="ts">
    import { SPACING, TYPOGRAPHY } from '$lib/constants/index.js';

    type ButtonVariant = keyof typeof themes;

    let {
        label,
        onclick,
        variant = "secondary",
        isActive = false,
        size = 'md',
        fullWidth = false,
        disabled = false
    } = $props<{
        label: string;
        onclick?: (e: MouseEvent) => void;
        variant?: ButtonVariant;
        isActive?: boolean;
        size?: 'sm' | 'md' | 'lg';
        fullWidth?: boolean;
        disabled?: boolean;
    }>();

    const themes: Record<string, string> = {
        primary: 'bg-[var(--accent-orange)] text-white shadow-lg',
        secondary: 'bg-[var(--accent-teal)]/30 text-[var(--text-secondary)] hover:bg-[var(--accent-teal)]/80 hover:text-white',
        danger: 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white'
    };

    const sizeClasses: Record<string, string> = {
        sm: 'text-base px-4 py-1.5',
        md: 'text-lg px-6 py-2',
        lg: 'text-xl px-8 sm:px-10 py-2 sm:py-3'
    };
</script>

<button
	{onclick}
	{disabled}
	class="font-bold rounded-sm transition-all text-left uppercase {TYPOGRAPHY.tracking.tighter}
    {isActive ? themes.primary : themes[variant]}
    {sizeClasses[size]}
    {fullWidth ? 'w-full' : ''}
    {disabled ? 'opacity-50 cursor-not-allowed' : ''}"
>
	{label} {isActive ? '' : ''}
</button>