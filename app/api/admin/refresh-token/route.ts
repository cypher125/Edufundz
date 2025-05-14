import { NextRequest, NextResponse } from 'next/server';

// Define base URL without /api suffix since we'll add it in the path
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, '') || 'http://localhost:8000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('Admin token refresh request');
    
    // Forward the request to the backend API with the correct path
    const response = await fetch(`${BACKEND_URL}/api/admin/refresh-token/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('Admin token refresh failed:', data);
      return NextResponse.json(
        { message: data.detail || 'Token refresh failed' }, 
        { status: response.status }
      );
    }
    
    console.log('Admin token refresh successful');
    
    // Return the backend response with the same status code
    return NextResponse.json(data, { status: response.status });
    
  } catch (error) {
    console.error('Admin token refresh error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
} 