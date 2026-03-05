<script lang="ts">
  import BG from '$lib/components/Grid.svelte';
  import ThemeToggle from '$lib/components/ThemeToggle.svelte';
  import Footer from '$lib/components/Footer.svelte';

  let {
    children,
    showThemeToggle = true,
    showFooter = true,
    footerPage = '',
  }: {
    children: any;
    showThemeToggle?: boolean;
    showFooter?: boolean;
    footerPage?: string;
  } = $props();
</script>

{#if showThemeToggle}
  <ThemeToggle />
{/if}

<BG>
  {@render children()}
</BG>

{#if showFooter}
  <Footer page={footerPage} />
{/if}
