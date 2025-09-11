import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Handle different webhook events
    switch (body.type) {
      case 'FRAME_ADDED':
        console.log('Frame added:', body.data);
        // Here you could save the frame data to your database
        break;
        
      case 'FRAME_REMOVED':
        console.log('Frame removed:', body.data);
        // Handle frame removal
        break;
        
      case 'NOTIFICATION_ENABLED':
        console.log('Notifications enabled:', body.data);
        // Handle notification opt-in
        break;
        
      case 'NOTIFICATION_DISABLED':
        console.log('Notifications disabled:', body.data);
        // Handle notification opt-out
        break;
        
      default:
        console.log('Unknown webhook event:', body);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Webhook endpoint is active' });
}
