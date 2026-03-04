<script>
	import { goto } from '$app/navigation';
	import Tab from '$lib/components/Tab.svelte';
	let { activeTab } = $props();
</script>

<div class="flex flex-col gap-3 shrink-0">
	<Tab label='Login' redirectTo='\login' isActiveTab={activeTab === 'login'}/>
	<Tab label='Signup' redirectTo='\signup' isActiveTab={activeTab === 'signup'}/>
</div>