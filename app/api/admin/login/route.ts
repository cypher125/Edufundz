import { NextRequest, NextResponse } from 'next/server';

// Define base URL without /api suffix since we'll add it in the path
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, '') || 'http://localhost:8000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('Admin login request:', { email: body.email, passwordLength: body.password?.length });
    console.log('Backend URL:', BACKEND_URL);
    
    // Forward the request to the backend API with the correct path
    const response = await fetch(`${BACKEND_URL}/api/admin/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': 'frontend_csrf_token',
      },
      body: JSON.stringify(body),
      credentials: 'include',
    });
    
    console.log('Backend login response status:', response.status);
    console.log('Backend login response headers:', Object.fromEntries(response.headers.entries()));
    
    // First try to get the text response
    const responseText = await response.text();
    console.log('Backend login response text (first 150 chars):', responseText.substring(0, 150));
    
    let data;
    try {
      // Then parse it as JSON if possible
      data = JSON.parse(responseText);
    } catch (jsonError) {
      console.error('Failed to parse response as JSON:', jsonError);
      // Return a more helpful error
      return NextResponse.json(
        { 
          message: 'Server returned an invalid response format. Check backend logs.',
          responseText: responseText.substring(0, 500),
          status: response.status
        }, 
        { status: 500 }
      );
    }
    
    if (!response.ok) {
      console.error('Admin login failed:', data);
      return NextResponse.json(
        { message: data.detail || 'Authentication failed' }, 
        { status: response.status }
      );
    }
    
    console.log('Admin login successful');
    
    // Return the backend response with the same status code
    return NextResponse.json(data, { status: response.status });
    
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json({ 
      message: 'Internal server error', 
      error: String(error) 
    }, { status: 500 });
  }
} 