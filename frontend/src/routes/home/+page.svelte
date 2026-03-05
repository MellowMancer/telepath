<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { authState, logout } from '$lib/auth.svelte';
	import { themeState } from '$lib/theme.svelte';
	import { API_URL } from '$lib/config';

	// Your UI Components
	import BG from '$lib/components/Grid.svelte';
	import Input from '$lib/components/Input.svelte';
	import ActionButton from '$lib/components/ActionButton.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Row from '$lib/components/Row.svelte';
	import Tab from '$lib/components/Tab.svelte';
	import { redirect } from '@sveltejs/kit';

	let rooms = $state([]);
	let showCreateModal = $state(false);
	let newRoomName = $state('');
	let loading = $state(true);
	let error = $state('');

	async function fetchRooms() {
		try {
			const res = await fetch(`${API_URL}/rooms/all`, {
				headers: { Authorization: `Bearer ${authState.token}` }
			});
			if (res.ok) rooms = await res.json();
		} catch (e) {
			error = "Failed to sync with network.";
		}
	}

	async function handleCreateRoom() {
		if (!newRoomName) return;
		try {
			const res = await fetch(`${API_URL}/rooms/create`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${authState.token}`
				},
				body: JSON.stringify({ name: newRoomName })
			});

			if (res.ok) {
				newRoomName = '';
				showCreateModal = false;
				await fetchRooms();
			} else {
				const errData = await res.json();
				alert(errData.message);
			}
		} catch (e) {
			error = "Network initialization failed. Please try again.";
		}
	}

	onMount(async () => {
		// Secure the page
		const token = localStorage.getItem('token');
		if (!token) return goto('/login');
		
		await fetchRooms();
		loading = false;
	});
</script>

<ThemeToggle />

<BG>
	<!-- Sidebar: Active Identity & Menu -->
	<div class="flex flex-col gap-8">
		<div class="px-6 py-4 bg-white/40 border-l-4 border-(--accent-orange) rounded-sm">
			<p class="text-[10px] font-black opacity-40 tracking-widest uppercase">Identity</p>
			<h3 class="text-xl font-black truncate max-w-40">{authState.user?.username || 'GUEST'}</h3>
		</div>

		<Tab label='Home' redirectTo='\home' isActiveTab={true}/>
		<Tab label='Settings' redirectTo="\settings" isActiveTab={false}/>
        
        <div class="mt-auto">
            <ActionButton label="Disconnect" variant="danger" onclick={logout} />
        </div>
	</div>

	<!-- Main Content: Network List -->
	<div class="flex-1 w-full text-left">
		<header class="flex justify-between items-end mb-12">
			<div>
				<h2 class="text-5xl font-bold tracking-tighter">NETWORK</h2>
				<p class="font-bold opacity-30 text-xs uppercase tracking-[0.2em]">Available Frequencies</p>
			</div>
			<ActionButton label="Initialize" onclick={() => showCreateModal = true} />
		</header>
		
		{#if loading}
			<p class="animate-pulse font-bold opacity-20">Scanning network...</p>
		{:else if rooms.length === 0}
			<div class="py-20 border-2 border-dashed border-(--grid-color) rounded-sm text-center opacity-30">
				<p class="font-bold italic text-xl">Empty Signal</p>
			</div>
		{:else}
			<div class="flex flex-col">
				{#each rooms as room}
					<Row 
						title={room.name} 
						subtitle="STATUS: ACTIVE" 
						onclick={() => goto(`/chat/${room.id}`)}
					/>
				{/each}
			</div>
		{/if}
	</div>
</BG>

<!-- The "Mini Motorways" Style Modal Overlay -->
{#if showCreateModal}
	<div class="fixed inset-0 z-100 flex items-center justify-center bg-(--bg-color)/95 backdrop-blur-sm p-4">
		<div class="w-full max-w-md space-y-10">
			<div class="text-center">
				<h3 class="text-4xl font-bold tracking-tighter">NEW CHANNEL</h3>
				<p class="font-bold opacity-30 uppercase text-xs tracking-widest mt-2">Specify Frequency Name</p>
			</div>

			<Input label="Name" bind:value={newRoomName} placeholder="E.g. RED_ZONE" />

			<div class="flex space-between justify-between">
				<ActionButton label="Abort" onclick={() => {showCreateModal = false} } />
				<ActionButton label="Confirm" onclick={handleCreateRoom} isActive={true} />
			</div>
		</div>
	</div>
{/if}

<Footer page='Dashboard' themeState={themeState}/>