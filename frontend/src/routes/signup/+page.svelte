<script>
	import BG from '$lib/components/Grid.svelte';
	import Input from '$lib/components/Input.svelte';
	import AuthTabs from '$lib/components/AuthTabs.svelte';
	import ActionButton from '$lib/components/ActionButton.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
    import Footer from '$lib/components/Footer.svelte';
	import { themeState } from '$lib/theme.svelte';
    import { goto } from '$app/navigation';

	let username = $state('');
	let password = $state('');
    let confirmPassword = $state('');
	let error = $state('');

	async function handleSignup() {
		error = '';

		// 1. Basic Validation
		if (password !== confirmPassword) {
			error = 'Passkeys do not match';
			return;
		}

		try {
			// 2. Call NestJS Backend
			const res = await fetch('http://localhost:4000/auth/signup', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ username, password })
			});

			const data = await res.json();

			if (res.ok) {
				// 3. Redirect to Login
				goto('/login');
			} else {
				// 4. Error: Show message from NestJS (e.g. "Username already taken")
				error = data.message || 'Signup failed';
			}
		} catch (e) {
			error = 'Server is unreachable, lol developer messed up';
		}
	}
</script>

<ThemeToggle />

<BG>
	<AuthTabs activeTab="signup" />

	<div class="flex-1 w-full text-left">
		<h2 class="text-5xl font-bold mb-12">Signup</h2>
		
		{#if error}
			<p class="text-red-500 font-bold mb-4">✕ {error}</p>
		{/if}

		<div class="space-y-6">
			<Input label="Username" bind:value={username} placeholder="Guest" />
			<Input label="Passkey" type="password" bind:value={password} placeholder="••••" />
            <Input label="Confirm Passkey" type="password" bind:value={confirmPassword} placeholder="••••" />
		</div>

		<div class="mt-12 flex justify-end">
			<ActionButton label="Signup" onclick={handleSignup} />
		</div>
	</div>
</BG>

<Footer page='Signup' themeState={themeState}/>