import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Extract notification data
    const { title, body: messageBody, url, token } = body;
    
    // Here you would typically send the notification to Farcaster
    // For now, we'll just log it
    console.log('Sending notification:', {
      title,
      body: messageBody,
      url,
      token
    });
    
    // In a real implementation, you would:
    // 1. Verify the token is valid
    // 2. Send the notification to Farcaster's notification service
    // 3. Handle any errors
    
    return NextResponse.json({ 
      success: true, 
      message: 'Notification sent successfully' 
    });
  } catch (error) {
    console.error('Notification error:', error);
    return NextResponse.json(
      { error: 'Failed to send notification' }, 
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Notification endpoint is active' });
}
