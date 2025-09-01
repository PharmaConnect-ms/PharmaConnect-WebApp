import { NextRequest, NextResponse } from 'next/server';
import { createHmac } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { meetingNumber, role } = await request.json();

    if (!meetingNumber) {
      return NextResponse.json({ error: 'Meeting number is required' }, { status: 400 });
    }

    // Use Client ID and Client Secret for SDK operations
    const sdkKey = process.env.NEXT_PUBLIC_ZOOM_CLIENT_ID;
    const sdkSecret = process.env.ZOOM_CLIENT_SECRET;

    if (!sdkKey || !sdkSecret) {
      console.error('Missing Zoom credentials:', { 
        hasClientId: !!sdkKey, 
        hasClientSecret: !!sdkSecret 
      });
      return NextResponse.json({ error: 'Zoom credentials not configured' }, { status: 500 });
    }

    // Generate signature for Zoom Web SDK
    const timestamp = new Date().getTime() - 30000;
    const msg = Buffer.from(sdkKey + meetingNumber + timestamp + (role || 0)).toString('base64');
    const hash = createHmac('sha256', sdkSecret).update(msg).digest('base64');
    const signature = Buffer.from(`${sdkKey}.${meetingNumber}.${timestamp}.${role || 0}.${hash}`).toString('base64');

    return NextResponse.json({
      signature,
      sdkKey,
      timestamp
    });

  } catch (error) {
    console.error('Error generating Zoom signature:', error);
    return NextResponse.json({ error: 'Failed to generate meeting signature' }, { status: 500 });
  }
}
