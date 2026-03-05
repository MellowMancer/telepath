<script>
	import Input from '$lib/components/Input.svelte';
	import AuthTabs from '$lib/components/AuthTabs.svelte';
	import ActionButton from '$lib/components/ActionButton.svelte';
	import PageLayout from '$lib/layouts/PageLayout.svelte';
	import { UI_TEXT } from '$lib/constants/index.js';
    import { goto } from '$app/navigation';
	import { API_URL } from '$lib/config.js';

	let username = $state('');
	let password = $state('');
    let confirmPassword = $state('');
	let error = $state('');

	async function handleSignup() {
		error = '';

		if (password !== confirmPassword) {
			error = UI_TEXT.auth.signup.errorPasswordMismatch;
			return;
		}

		try {
			const res = await fetch(`${API_URL}/auth/signup`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include', // Include cookies in request/response
				body: JSON.stringify({ username, password })
			});

			const data = await res.json();

			if (res.ok) {
				goto('/login');
			} else {
				error = data.message || 'Signup failed';
			}
		} catch (e) {
			error = UI_TEXT.auth.signup.errorUnreachable;
		}
	}
</script>

<PageLayout footerPage={UI_TEXT.footer.pages.signup}>
	<AuthTabs activeTab="signup" />

	<div class="flex-1 w-full text-left">
		<h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 sm:mb-12">{UI_TEXT.auth.signup.title}</h2>

		{#if error}
			<p class="text-red-500 font-bold mb-4"> {error}</p>
		{/if}

		<div class="space-y-4 sm:space-y-6">
			<Input label={UI_TEXT.auth.signup.usernameLabel} bind:value={username} placeholder={UI_TEXT.auth.signup.usernamePlaceholder} />
			<Input label={UI_TEXT.auth.signup.passwordLabel} type="password" bind:value={password} placeholder={UI_TEXT.auth.signup.passwordPlaceholder} />
            <Input label={UI_TEXT.auth.signup.confirmPasswordLabel} type="password" bind:value={confirmPassword} placeholder={UI_TEXT.auth.signup.passwordPlaceholder} />
		</div>

		<div class="mt-8 sm:mt-12 flex justify-end">
			<ActionButton label={UI_TEXT.auth.signup.submitButton} onclick={handleSignup} />
		</div>
	</div>
</PageLayout>