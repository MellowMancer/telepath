<script>
	import Input from '$lib/components/Input.svelte';
	import AuthTabs from '$lib/components/AuthTabs.svelte';
	import ActionButton from '$lib/components/ActionButton.svelte';
	import PageLayout from '$lib/layouts/PageLayout.svelte';
	import { UI_TEXT, TYPOGRAPHY, SPACING } from '$lib/constants/index.js';
    import { goto } from '$app/navigation';
    import { authState, setUser } from '$lib/auth.svelte';
	import { API_URL } from '$lib/config.js';

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
                setUser({ username: data.username, userId: data.userId });
				goto('/home');
			} else {
				error = data.message || 'Login failed';
			}
		} catch (e) {
			error = UI_TEXT.auth.login.errorUnreachable;
		}
	}
</script>

<PageLayout footerPage={UI_TEXT.footer.pages.login}>
	<AuthTabs activeTab="login" />

	<div class="flex-1 w-full text-left">
		<h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 sm:mb-12">{UI_TEXT.auth.login.title}</h2>

		{#if error}
			<p class="text-red-500 font-bold mb-4"> {error}</p>
		{/if}

		<div class="space-y-4 sm:space-y-6">
			<Input label={UI_TEXT.auth.login.userIdLabel} bind:value={username} placeholder={UI_TEXT.auth.login.userIdPlaceholder} />
			<Input label={UI_TEXT.auth.login.passwordLabel} type="password" bind:value={password} placeholder={UI_TEXT.auth.login.passwordPlaceholder} />
		</div>

		<div class="mt-8 sm:mt-12 flex justify-end">
			<ActionButton label={UI_TEXT.auth.login.submitButton} onclick={handleLogin} />
		</div>
	</div>
</PageLayout>