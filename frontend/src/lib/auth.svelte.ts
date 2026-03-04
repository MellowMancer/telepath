import { writable } from 'svelte/store';
import { goto } from '$app/navigation';

export const user = writable(null);


export const authState = $state({
    user: null as { username: string; userId: string } | null,
    token: typeof window !== 'undefined' ? localStorage.getItem('token') : null
});

export function logout() {
    localStorage.removeItem('token');
    authState.token = null;
    authState.user = null;
    goto('/login');
}