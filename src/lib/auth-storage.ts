export const AUTH_KEY = 'user';

export function saveUser(u: unknown) {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_KEY, JSON.stringify(u));
    }
  } catch (error) {
    console.error('Error saving user to localStorage:', error);
  }
}

export function loadUser<T>(): T | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    
    const parsed = JSON.parse(raw) as T;
    
    // Validate that the user object has required properties (optional validation)
    if (parsed && typeof parsed === 'object' && 'token' in parsed) {
      return parsed;
    }
    
    return null;
  } catch (error) {
    console.error('Error loading user from localStorage:', error);
    return null;
  }
}

export function clearUser() {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_KEY);
    }
  } catch (error) {
    console.error('Error clearing user from localStorage:', error);
  }
}
