<script>
	import BG from '$lib/components/Grid.svelte';
	import Input from '$lib/components/Input.svelte';
	import AuthTabs from '$lib/components/AuthTabs.svelte';
	import ActionButton from '$lib/components/ActionButton.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
    import Footer from '$lib/components/Footer.svelte';
	import { themeState } from '$lib/theme.svelte';
    import { goto } from '$app/navigation';
    import { authState } from '$lib/auth.svelte';
	import { API_URL } from '$lib/config';

	let username = $state('');
	let password = $state('');
	let error = $state('');

	async function handleLogin() {
		try {
			const res = await fetch(`${API_URL}/auth/login`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ username, password })
			});

			const data = await res.json();

			if (res.ok) {
                localStorage.setItem('token', data.access_token);
                authState.token = data.access_token;
                authState.user = { username: data.username, userId: data.userId };
				goto('/home');
			} else {
				error = data.message || 'Login failed';
			}
		} catch (e) {
			error = 'Server is unreachable. Please check your connection.';
		}
	}
</script>

<ThemeToggle />

<BG>
	<AuthTabs activeTab="login" />

	<div class="flex-1 w-full text-left">
		<h2 class="text-5xl font-bold mb-12">Login</h2>
		
		{#if error}
			<p class="text-red-500 font-bold mb-4">✕ {error}</p>
		{/if}

		<div class="space-y-6">
			<Input label="User ID" bind:value={username} placeholder="Guest" />
			<Input label="Pass Key" type="password" bind:value={password} placeholder="••••" />
		</div>

		<div class="mt-12 flex justify-end">
			<ActionButton label="Go" onclick={handleLogin} />
		</div>
	</div>
</BG>

<Footer page='Login' themeState={themeState}/>