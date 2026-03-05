<script lang="ts">
	import Tab from '$lib/components/Tab.svelte';
	import { UI_TEXT } from '$lib/constants/index.js';

	let { activeTab } = $props<{
		activeTab: 'login' | 'signup';
	}>();
</script>

<div class="flex flex-col gap-2 sm:gap-3 shrink-0">
	<Tab label={UI_TEXT.auth.login.title} redirectTo='\login' isActiveTab={activeTab === 'login'}/>
	<Tab label={UI_TEXT.auth.signup.title} redirectTo='\signup' isActiveTab={activeTab === 'signup'}/>
</div>