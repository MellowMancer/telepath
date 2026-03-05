import { writable } from 'svelte/store';
import { goto } from '$app/navigation';

export const user = writable(null);

// Helper to get stored user
function getStoredUser() {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
}

export const authState = $state({
    user: getStoredUser() as { username: string; userId: string } | null,
    token: typeof window !== 'undefined' ? localStorage.getItem('token') : null
});

export function setUser(user: { username: string; userId: string }) {
    authState.user = user;
    if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(user));
    }
}

export function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    authState.token = null;
    authState.user = null;
    goto('/login');
}