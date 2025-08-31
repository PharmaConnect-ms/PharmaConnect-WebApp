import { AuthUser } from '@/redux/features/authSlice';
import { loadUser } from '@/lib/auth-storage';
import { isTokenValid, getTokenExpiration } from '@/utils/token-utils';

interface WindowWithDebug extends Window {
  debugAuth?: () => void;
  __REDUX_DEVTOOLS_EXTENSION__?: unknown;
}

declare const window: WindowWithDebug;

/**
 * Debug utility to check authentication state
 * Use this in browser console: window.debugAuth()
 */
export function debugAuth() {
  console.group('🔍 Authentication Debug Info');
  
  // Check localStorage
  const storedUser = loadUser<AuthUser>();
  console.log('📦 Stored user:', storedUser);
  
  if (storedUser) {
    // Check token validity
    const tokenValid = isTokenValid(storedUser);
    console.log('✅ Token valid:', tokenValid);
    
    // Check token expiration
    const expirationTime = getTokenExpiration(storedUser.token);
    if (expirationTime) {
      const expirationDate = new Date(expirationTime);
      const now = new Date();
      const timeUntilExpiry = expirationTime - now.getTime();
      
      console.log('⏰ Token expires:', expirationDate.toLocaleString());
      console.log('⏱️ Time until expiry:', Math.floor(timeUntilExpiry / 1000 / 60), 'minutes');
      console.log('🔴 Is expired:', expirationTime < now.getTime());
    }
    
    // Check token structure
    try {
      const tokenParts = storedUser.token.split('.');
      if (tokenParts.length === 3) {
        const payload = JSON.parse(atob(tokenParts[1]));
        console.log('🔐 Token payload:', payload);
      }
    } catch (error) {
      console.error('❌ Error parsing token:', error);
    }
  } else {
    console.log('❌ No user stored in localStorage');
  }
  
  // Check Redux state (if available)
  if (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__) {
    console.log('🔄 Check Redux DevTools for current auth state');
  }
  
  console.groupEnd();
}

// Make it available globally for debugging
if (typeof window !== 'undefined') {
  window.debugAuth = debugAuth;
}
