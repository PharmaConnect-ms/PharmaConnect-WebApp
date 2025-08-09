export const AUTH_KEY = 'user';

export function saveUser(u: unknown) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(u));
}
export function loadUser<T>(): T | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(AUTH_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw) as T; } catch { return null; }
}
export function clearUser() {
  localStorage.removeItem(AUTH_KEY);
}
