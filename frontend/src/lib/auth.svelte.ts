import { writable } from 'svelte/store';
import { goto } from '$app/navigation';
import { API_URL } from './config.ts';

export const user = writable(null);

// Helper to get stored user
function getStoredUser() {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
}

export const authState = $state({
    user: getStoredUser() as { username: string; userId: string } | null,
    // Token is now stored in HTTP-only cookies (not accessible to JS)
});

export function setUser(user: { username: string; userId: string }) {
    authState.user = user;
    if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(user));
    }
}

export async function logout() {
    try {
        // Call backend logout endpoint to clear the cookie
        await fetch(`${API_URL}/auth/logout`, {
            method: 'POST',
            credentials: 'include', // Include cookies
        });
    } catch (error) {
        console.error('Logout error:', error);
    }

    // Clear local state
    localStorage.removeItem('user');
    authState.user = null;
    goto('/login');
}