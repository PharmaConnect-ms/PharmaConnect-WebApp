import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  if (error) {
    console.error('Zoom OAuth error:', error);
    return NextResponse.redirect(new URL('/doctor?error=zoom_auth_failed', request.url));
  }

  if (!code) {
    console.error('No authorization code received from Zoom');
    return NextResponse.redirect(new URL('/doctor?error=no_auth_code', request.url));
  }

  try {
    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://zoom.us/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${process.env.NEXT_PUBLIC_ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`).toString('base64')}`
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.NEXT_PUBLIC_ZOOM_REDIRECT_URI!
      })
    });

    if (!tokenResponse.ok) {
      throw new Error(`Token exchange failed: ${tokenResponse.statusText}`);
    }

    const tokenData = await tokenResponse.json();
    
    // Store the token securely (you might want to encrypt this)
    // For now, we'll redirect back to the appointment or doctor dashboard
    let redirectUrl;
    
    if (state) {
      // If state contains appointment ID, redirect back to that appointment
      redirectUrl = new URL(`/doctor/appointments/${state}`, request.url);
      redirectUrl.searchParams.set('zoom_token', tokenData.access_token);
    } else {
      // Otherwise redirect to doctor dashboard
      redirectUrl = new URL('/doctor', request.url);
      redirectUrl.searchParams.set('zoom_token', tokenData.access_token);
    }

    return NextResponse.redirect(redirectUrl);
    
  } catch (error) {
    console.error('Error exchanging Zoom authorization code:', error);
    return NextResponse.redirect(new URL('/doctor?error=token_exchange_failed', request.url));
  }
}
