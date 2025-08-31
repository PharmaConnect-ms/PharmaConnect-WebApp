import { AuthUser } from '@/redux/features/authSlice';

/**
 * Validates if a token is expired by checking its structure
 * This is a basic check - you might want to implement proper JWT validation
 */
export function isTokenValid(user: AuthUser | null): boolean {
  if (!user || !user.token) {
    return false;
  }

  try {
    // Basic check for JWT structure (header.payload.signature)
    const tokenParts = user.token.split('.');
    if (tokenParts.length !== 3) {
      return false;
    }

    // Decode the payload to check expiration
    const payload = JSON.parse(atob(tokenParts[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    
    // Check if token is expired (exp claim)
    if (payload.exp && payload.exp < currentTime) {
      return false;
    }

    return true;
  } catch (error) {
    console.error('Token validation error:', error);
    return false;
  }
}

/**
 * Get token expiration time
 */
export function getTokenExpiration(token: string): number | null {
  try {
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      return null;
    }

    const payload = JSON.parse(atob(tokenParts[1]));
    return payload.exp ? payload.exp * 1000 : null; // Convert to milliseconds
  } catch (error) {
    console.error('Error getting token expiration:', error);
    return null;
  }
}

/**
 * Check if token will expire within the given minutes
 */
export function isTokenExpiringSoon(token: string, minutesBeforeExpiry: number = 5): boolean {
  const expirationTime = getTokenExpiration(token);
  if (!expirationTime) return false;
  
  const currentTime = Date.now();
  const timeUntilExpiry = expirationTime - currentTime;
  const minutesUntilExpiry = timeUntilExpiry / (1000 * 60);
  
  return minutesUntilExpiry <= minutesBeforeExpiry;
}
