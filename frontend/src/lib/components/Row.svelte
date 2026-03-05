<script lang="ts">
    let { title, subtitle, onclick, showArrow = true, arrow = '' } = $props<{
        title: string;
        subtitle: string;
        onclick?: () => void;
        showArrow?: boolean;
        arrow?: string;
    }>();
</script>

<button
    {onclick}
    class="group w-full flex items-center justify-between py-4 sm:py-5 md:py-6 border-b-2 border-(--grid-color) hover:bg-black/5 px-2 transition-all">
    <div class="text-left">
        <h4 class="text-xl sm:text-2xl font-bold group-hover:text-(--accent-orange) transition-colors">{title}</h4>
        <p class="text-[10px] font-black opacity-40 tracking-widest uppercase">{subtitle}</p>
    </div>
    {#if showArrow}
        <span class="text-xl sm:text-2xl opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all">{arrow}</span>
    {/if}
</button>