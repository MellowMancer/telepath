import { writable } from 'svelte/store';

export const user = writable(null);

export function logout() {
    localStorage.removeItem('token');
    user.set(null);
    window.location.href = '/login';
}