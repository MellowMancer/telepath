<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { authState, logout } from '$lib/auth.svelte';
	import { API_URL } from '$lib/config.js';
	import { UI_TEXT, SPACING } from '$lib/constants/index.js';
	import type { ChatRoom } from '$lib/types.js';

	// Your UI Components
	import PageLayout from '$lib/layouts/PageLayout.svelte';
	import Input from '$lib/components/Input.svelte';
	import ActionButton from '$lib/components/ActionButton.svelte';
	import Row from '$lib/components/Row.svelte';
	import Tab from '$lib/components/Tab.svelte';

	let rooms = $state<ChatRoom[]>([]);
	let showCreateModal = $state(false);
	let showCodeModal = $state(false);
	let newRoomName = $state('');
	let roomCode = $state('');
	let selectedRoom = $state<ChatRoom | null>(null);
	let loading = $state(true);
	let error = $state('');
	let codeError = $state('');

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
				const data = await res.json();
				newRoomName = '';
				showCreateModal = false;
				await fetchRooms();
				// Show the code to the creator
				alert(`Room created! Your room code is: ${data.code}`);
			} else {
				const errData = await res.json();
				alert(errData.message);
			}
		} catch (e) {
			error = "Network initialization failed. Please try again.";
		}
	}

	function openCodeModal(room: ChatRoom) {
		selectedRoom = room;
		roomCode = '';
		codeError = '';
		showCodeModal = true;
	}

	async function handleJoinRoom() {
		if (!roomCode || !selectedRoom) return;

		codeError = '';

		try {
			const res = await fetch(`${API_URL}/rooms/${selectedRoom.id}/join`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${authState.token}`
				},
				body: JSON.stringify({ code: roomCode })
			});

			const data = await res.json();

			if (res.ok) {
				showCodeModal = false;
				roomCode = '';
				goto(`/chat/${selectedRoom.id}`);
			} else {
				codeError = data.message || 'Invalid room code';
			}
		} catch (e) {
			codeError = 'Failed to join room. Please try again.';
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

<PageLayout footerPage={UI_TEXT.footer.pages.dashboard}>
	<!-- Sidebar -->
	<div class="hidden md:flex flex-col gap-6 lg:gap-8">
		<div class="px-4 sm:px-6 py-3 sm:py-4 bg-white/40 border-l-4 border-(--accent-orange) rounded-sm">
			<p class="text-[10px] font-black opacity-40 tracking-widest uppercase">{UI_TEXT.home.identityLabel}</p>
			<h3 class="text-lg sm:text-xl font-black truncate max-w-32 sm:max-w-40">{authState.user?.username || UI_TEXT.home.guestUsername}</h3>
		</div>

		<Tab label={UI_TEXT.nav.tabs.home} redirectTo='\home' isActiveTab={true}/>
		<Tab label={UI_TEXT.nav.tabs.settings} redirectTo="\settings" isActiveTab={false}/>

        <div class="mt-auto">
            <ActionButton label={UI_TEXT.nav.buttons.disconnect} variant="danger" onclick={logout} fullWidth={true} />
        </div>
	</div>

	<!-- Main Content: Network List -->
	<div class="flex-1 w-full text-left">
		<header class="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-8 sm:mb-12">
			<div>
				<h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tighter">{UI_TEXT.home.title}</h2>
				<p class="font-bold opacity-30 text-xs uppercase tracking-[0.2em]">{UI_TEXT.home.subtitle}</p>
			</div>
			<ActionButton label={UI_TEXT.home.createButton} onclick={() => showCreateModal = true} fullWidth={false}  />
		</header>

		{#if loading}
			<p class="animate-pulse font-bold opacity-20">Scanning network...</p>
		{:else if rooms.length === 0}
			<div class="py-16 sm:py-20 border-2 border-dashed border-(--grid-color) rounded-sm text-center opacity-30">
				<p class="font-bold italic text-lg sm:text-xl">{UI_TEXT.home.emptyState}</p>
			</div>
		{:else}
			<div class="flex flex-col">
				{#each rooms as room}
					<Row
						title={room.name}
						subtitle={UI_TEXT.home.roomStatus}
						onclick={() => openCodeModal(room)}
					/>
				{/each}
			</div>
		{/if}
	</div>
</PageLayout>

<!-- Create Room Modal -->
{#if showCreateModal}
	<div class="fixed inset-0 z-100 flex items-center justify-center bg-(--bg-color)/95 backdrop-blur-sm p-4 sm:p-6">
		<div class="w-full max-w-full sm:max-w-md space-y-6 sm:space-y-10">
			<div class="text-center">
				<h3 class="text-3xl sm:text-4xl font-bold tracking-tighter">{UI_TEXT.home.modal.title}</h3>
				<p class="font-bold opacity-30 uppercase text-xs tracking-widest mt-2">{UI_TEXT.home.modal.subtitle}</p>
			</div>

			<Input label={UI_TEXT.home.modal.nameLabel} bind:value={newRoomName} placeholder={UI_TEXT.home.modal.namePlaceholder} />

			<div class="flex flex-col sm:flex-row gap-3 sm:gap-0 sm:justify-between">
				<ActionButton label={UI_TEXT.home.modal.abortButton} onclick={() => {showCreateModal = false} } fullWidth={true} />
				<ActionButton label={UI_TEXT.home.modal.confirmButton} onclick={handleCreateRoom} isActive={true} fullWidth={true} />
			</div>
		</div>
	</div>
{/if}

<!-- Enter Room Code Modal -->
{#if showCodeModal && selectedRoom}
	<div class="fixed inset-0 z-100 flex items-center justify-center bg-(--bg-color)/95 backdrop-blur-sm p-4 sm:p-6">
		<div class="w-full max-w-full sm:max-w-md space-y-6 sm:space-y-10">
			<div class="text-center">
				<h3 class="text-3xl sm:text-4xl font-bold tracking-tighter">ENTER CODE</h3>
				<p class="font-bold opacity-30 uppercase text-xs tracking-widest mt-2">Access // {selectedRoom.name}</p>
			</div>

			{#if codeError}
				<p class="text-red-500 font-bold text-center"> {codeError}</p>
			{/if}

			<Input
				label="4-Digit Code"
				bind:value={roomCode}
				placeholder="1234"
				onEnter={handleJoinRoom}
			/>

			<div class="flex flex-col sm:flex-row gap-3 sm:gap-0 sm:justify-between">
				<ActionButton label="Cancel" onclick={() => {showCodeModal = false} } fullWidth={true} />
				<ActionButton label="Enter" onclick={handleJoinRoom} isActive={true} fullWidth={true} disabled={!roomCode} />
			</div>
		</div>
	</div>
{/if}