<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { logout, authState } from '$lib/auth.svelte';

    let loading = $state(true);

    onMount(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            goto('/login');
        } else {
            loading = false;
        }
    });
</script>

{#if !loading}
    <div class="min-h-screen bg-slate-50">
        <nav class="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
            <div class="flex items-center gap-2">
                <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">T</div>
                <h1 class="text-xl font-bold text-slate-800">Telepath</h1>
            </div>
            <button onclick={logout} class="text-slate-500 hover:text-red-600 font-medium transition">
                Logout
            </button>
        </nav>

        <main class="max-w-4xl mx-auto p-8">
            <h2 class="text-4xl font-extrabold text-slate-900 mb-4">Dashboard</h2>
            <p class="text-lg text-slate-600 mb-10">Select an action to get started.</p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Chatrooms Link -->
                <a href="/chat" class="group bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div class="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </div>
                    <h3 class="text-2xl font-bold text-slate-800 mb-2">Chatrooms</h3>
                    <p class="text-slate-500">Join existing rooms or create your own to chat in real-time.</p>
                </a>
            </div>
        </main>
    </div>
{/if}