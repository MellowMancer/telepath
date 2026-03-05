<script>
    import { page } from '$app/state';
    import { goto } from '$app/navigation';
    import PageLayout from '$lib/layouts/PageLayout.svelte';
    import ActionButton from '$lib/components/ActionButton.svelte';
    import { UI_TEXT } from '$lib/constants/index.js';
</script>

<PageLayout showFooter={false}>
    <div class="flex-1 flex flex-col items-center justify-center text-center space-y-6 sm:space-y-8">
        <h1 class="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tighter uppercase">
            {page.error?.message || UI_TEXT.error.title}
        </h1>

        <p class="text-base sm:text-lg lg:text-xl font-bold opacity-60 max-w-md px-4">
            {UI_TEXT.error.message}
        </p>

        <div class="pt-6 sm:pt-8">
            <ActionButton
                label="Exit to Menu"
                onclick={() => goto('/home')}
            />
        </div>
    </div>
</PageLayout>

<div class="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 opacity-40 font-mono text-xs sm:text-sm">
    STATUS_CODE // {page.status}
</div>