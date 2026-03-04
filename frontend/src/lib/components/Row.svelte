<script>
    let { title, subtitle, onclick } = $props();
</script>

<button 
    {onclick} 
    class="group w-full flex items-center justify-between py-6 border-b-2 border-[var(--grid-color)] hover:bg-black/5 px-2 transition-all">
    <div class="text-left">
        <h4 class="text-2xl font-bold group-hover:text-[var(--accent-orange)] transition-colors">{title}</h4>
        <p class="text-[10px] font-black opacity-40 tracking-widest uppercase">{subtitle}</p>
    </div>
    <span class="text-2xl opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all">➜</span>
</button>