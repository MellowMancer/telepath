<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { io, Socket } from 'socket.io-client';
	import { authState } from '$lib/auth.svelte';
	import { API_URL, WS_URL } from '$lib/config.js';
	import { UI_TEXT } from '$lib/constants/index.js';

	import PageLayout from '$lib/layouts/PageLayout.svelte';
	import Input from '$lib/components/Input.svelte';
	import ActionButton from '$lib/components/ActionButton.svelte';
    import type { ChatMessage, ChatRoom } from '$lib/types.js';

	const roomId = page.params.id!;
	let socket: Socket | null = null;
	let newMessage = $state('');
    let messages = $state<ChatMessage[]>([]);
	let messageContainer: HTMLElement | undefined = $state();
	let isConnected = $state(false);
	let connectionError = $state('');

	async function scrollToBottom() {
		await tick();
		if (messageContainer) messageContainer.scrollTop = messageContainer.scrollHeight;
	}

	async function fetchMessages() {
		try {
			const res = await fetch(`${API_URL}/rooms/${roomId}/messages`, {
				credentials: 'include' // Include cookies
			});
			if (res.ok) {
				messages = await res.json();
				scrollToBottom();
			}
		} catch (error) {
			console.error('Failed to fetch messages:', error);
		}
	}

	function setupSocketListeners() {
		if (!socket) return;

		// Handle new messages
		socket.on('new_message', (msg: ChatMessage) => {
			// Avoid duplicates by checking if message already exists
			if (!messages.find(m => m.id === msg.id)) {
				messages = [...messages, msg];
				scrollToBottom();
			}
		});

		// Handle connection events
		socket.on('connect', () => {
			console.log('WebSocket connected');
			isConnected = true;
			connectionError = '';
			socket!.emit('join_room', roomId);
		});

		socket.on('disconnect', (reason) => {
			console.log('WebSocket disconnected:', reason);
			isConnected = false;
			if (reason === 'io server disconnect') {
				// Server disconnected, need to reconnect manually
				socket?.connect();
			}
		});

		socket.on('connect_error', (error) => {
			console.error('Connection error:', error);
			isConnected = false;
			connectionError = 'Connection lost. Reconnecting...';
		});

		socket.on('reconnect', (attemptNumber) => {
			console.log('Reconnected after', attemptNumber, 'attempts');
			isConnected = true;
			connectionError = '';
			// Refresh messages after reconnection
			fetchMessages();
		});
	}

	onMount(async () => {
		// Check if user is authenticated
		if (!authState.user) return goto('/login');

		// 1. Fetch message history
		await fetchMessages();

		// 2. Connect WebSockets with authentication and auto-reconnection
		// withCredentials: true enables sending cookies with the connection
		socket = io(WS_URL, {
			withCredentials: true,
			reconnection: true,
			reconnectionDelay: 1000,
			reconnectionDelayMax: 5000,
			reconnectionAttempts: Infinity,
		});

		// 3. Setup event listeners
		setupSocketListeners();

		// Cleanup on unmount
		return () => {
			if (socket) {
				socket.off('new_message');
				socket.off('connect');
				socket.off('disconnect');
				socket.off('connect_error');
				socket.off('reconnect');
				socket.disconnect();
			}
		};
	});

	function sendMessage() {
		if (!newMessage || !socket || !isConnected) return;

		socket.emit('send_message', {
			content: newMessage,
			roomId
		});
		newMessage = '';
	}
</script>

<PageLayout footerPage={UI_TEXT.footer.pages.terminal}>
	<!-- Top Left: Back Button & Connection Status -->
	<div class="absolute top-4 sm:top-6 lg:top-8 left-4 sm:left-6 lg:left-8 z-50 flex flex-col gap-2 sm:gap-3">
		<button
			onclick={() => goto('/home')}
			class="px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base font-bold bg-(--accent-teal)/20 text-(--text-secondary) rounded-sm hover:bg-(--accent-teal)/40 transition-all">
			{UI_TEXT.nav.buttons.back}
		</button>
		<div class="px-3 sm:px-4 py-2 text-white font-black uppercase text-[10px] sm:text-xs tracking-widest flex items-center gap-2 rounded-sm
			{isConnected ? 'bg-(--accent-orange)' : 'bg-gray-500'}">
			<span class="w-2 h-2 rounded-full {isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}"></span>
			<span class="hidden sm:inline">{isConnected ? UI_TEXT.chat.connectedLabel : 'DISCONNECTED // Frequency_'}{roomId.slice(-4)}</span>
			<span class="sm:hidden">{isConnected ? 'ONLINE' : 'OFFLINE'}</span>
		</div>
	</div>

	<!-- Main Chat Terminal -->
	<div class="flex-1 flex flex-col h-[50vh] sm:h-[60vh] lg:h-[70vh] w-full max-w-4xl mx-auto pt-24 sm:pt-28">

		<!-- Connection Error Banner -->
		{#if connectionError}
			<div class="mb-4 p-3 bg-yellow-500/20 border-l-4 border-yellow-500 text-yellow-700 dark:text-yellow-300 text-sm font-bold rounded-sm">
				 {connectionError}
			</div>
		{/if}

		<!-- Message Feed -->
		<div
			bind:this={messageContainer}
			class="flex-1 overflow-y-auto space-y-3 sm:space-y-4 pr-2 sm:pr-4 scroll-smooth"
		>
			{#each messages as msg}
				<div class="flex flex-col {msg.senderId === authState.user?.userId ? 'items-end' : 'items-start'}">
					<span class="text-[10px] font-black opacity-30 uppercase tracking-widest mb-1">
						{msg.sender.username} // {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
					</span>
					<div class="px-3 sm:px-4 py-2 rounded-sm text-base sm:text-lg font-bold max-w-[85%] sm:max-w-none
						{msg.senderId === authState.user?.userId
							? 'bg-(--accent-orange) text-white'
							: 'bg-(--accent-teal)/20 text-(--text-primary) border-l-4 border-(--accent-teal)'}">
						{msg.content}
					</div>
				</div>
			{/each}
		</div>

		<!-- Input Area -->
		<div class="mt-4 sm:mt-6 lg:mt-8 pt-4 sm:pt-6 border-t-2 border-(--grid-color) flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-end">
			<div class="flex-1">
				<Input
					bind:value={newMessage}
					placeholder={UI_TEXT.chat.inputPlaceholder}
					onEnter={sendMessage}
				/>
			</div>
			<ActionButton
				label={UI_TEXT.chat.sendButton}
				onclick={sendMessage}
				fullWidth={false}
				disabled={!isConnected || !newMessage.trim()}
			/>
		</div>
	</div>
</PageLayout>