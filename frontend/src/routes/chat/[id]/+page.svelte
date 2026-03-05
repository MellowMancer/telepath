<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { io } from 'socket.io-client';
	import { authState } from '$lib/auth.svelte';
	import { themeState } from '$lib/theme.svelte';
	import { API_URL, WS_URL } from '$lib/config';

	import BG from '$lib/components/Grid.svelte';
	import Input from '$lib/components/Input.svelte';
	import ActionButton from '$lib/components/ActionButton.svelte';
	import Footer from '$lib/components/Footer.svelte';
    import type { ChatMessage, ChatRoom } from '$lib/types';

	const roomId = page.params.id;
	let socket: any;
	let newMessage = $state('');
    let messages = $state<ChatMessage[]>([]);
	let messageContainer: HTMLElement | undefined = $state();

	async function scrollToBottom() {
		await tick();
		if (messageContainer) messageContainer.scrollTop = messageContainer.scrollHeight;
	}

	onMount(async () => {
		if (!authState.token) return goto('/login');

		// 1. Fetch History
		const res = await fetch(`${API_URL}/rooms/${roomId}/messages`, {
			headers: { Authorization: `Bearer ${authState.token}` }
		});
		messages = await res.json();
		scrollToBottom();

		// 2. Connect WebSockets with authentication
		socket = io(WS_URL, {
			auth: { token: authState.token }
		});
		socket.emit('join_room', roomId);

		socket.on('new_message', (msg: any) => {
			messages.push(msg);
			scrollToBottom();
		});
	});

	function sendMessage() {
		if (!newMessage) return;
		// Note: senderId is extracted from JWT token on the backend
		socket.emit('send_message', {
			content: newMessage,
			roomId
		});
		newMessage = '';
	}
</script>

<BG>
	<!-- Sidebar: Navigation -->
	<div class="flex flex-col gap-4">
		<button 
			onclick={() => goto('/home')}
			class="px-6 py-2 text-2xl font-bold bg-(--accent-teal)/20 text-(--text-secondary) rounded-sm hover:bg-(--accent-teal)/40 text-left">
			← Back
		</button>
		<div class="mt-8 p-4 bg-(--accent-orange) text-white font-black uppercase text-xs tracking-widest">
			Connected // Frequency_{roomId.slice(-4)}
		</div>
	</div>

	<!-- Main Chat Terminal -->
	<div class="flex-1 flex flex-col h-[70vh] w-full">
		<!-- Message Feed -->
		<div 
			bind:this={messageContainer}
			class="flex-1 overflow-y-auto space-y-4 pr-4 scroll-smooth"
		>
			{#each messages as msg}
				<div class="flex flex-col {msg.senderId === authState.user?.userId ? 'items-end' : 'items-start'}">
					<span class="text-[10px] font-black opacity-30 uppercase tracking-widest mb-1">
						{msg.sender.username} // {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
					</span>
					<div class="px-4 py-2 rounded-sm text-lg font-bold
						{msg.senderId === authState.user?.userId 
							? 'bg-(--accent-orange) text-white' 
							: 'bg-(--accent-teal)/20 text-(--text-primary) border-l-4 border-(--accent-teal)'}">
						{msg.content}
					</div>
				</div>
			{/each}
		</div>

		<!-- Input Area -->
		<div class="mt-8 pt-6 border-t-2 border-(--grid-color) flex gap-4 items-end">
			<div class="flex-1">
				<Input label="Input Signal" bind:value={newMessage} placeholder="Type packet content..." />
			</div>
			<ActionButton label="Transmit" onclick={sendMessage} />
		</div>
	</div>
</BG>

<Footer page='Terminal' themeState={themeState}/>