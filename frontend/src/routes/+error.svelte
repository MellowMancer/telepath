<script>
    import { page } from '$app/state';
    import { goto } from '$app/navigation';
    import BG from '$lib/components/Grid.svelte';
    import ActionButton from '$lib/components/ActionButton.svelte';
</script>

<BG>
    <div class="flex-1 flex flex-col items-center justify-center text-center space-y-8">
        <h1 class="text-7xl font-black tracking-tighter uppercase">
            {page.error?.message || 'Error'}
        </h1>
        
        <p class="text-xl font-bold opacity-60 max-w-md">
            {'An unexpected system failure occurred.'}
        </p>

        <div class="pt-8">
            <ActionButton 
                label="Exit to Menu" 
                onclick={() => goto('/home')} 
            />
        </div>
    </div>
</BG>

<div class="absolute bottom-6 left-6 opacity-40 font-mono text-sm">
    STATUS_CODE // {page.status}
</div>