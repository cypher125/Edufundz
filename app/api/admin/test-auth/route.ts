import { NextRequest, NextResponse } from 'next/server';

// Define base URL without /api suffix since we'll add it in the path
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, '') || 'http://localhost:8000';

export async function GET(request: NextRequest) {
  try {
    // Get the authorization header from the frontend request
    const authHeader = request.headers.get('Authorization');
    console.log('Test-auth received headers:', { Authorization: authHeader });
    
    if (!authHeader) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Authorization header missing'
        }, 
        { status: 401 }
      );
    }
    
    // Forward the request to the backend with the same authorization header
    const response = await fetch(`${BACKEND_URL}/api/admin/test-auth/`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
      },
    });
    
    // Log the response from the backend
    console.log('Backend test-auth response status:', response.status);
    
    // Get the response data
    const data = await response.json();
    console.log('Backend test-auth response:', data);
    
    if (!response.ok) {
      return NextResponse.json(
        { 
          success: false, 
          message: data.detail || 'Authentication failed',
          status: response.status,
          data 
        }, 
        { status: response.status }
      );
    }
    
    // Return the backend response with the same status code
    return NextResponse.json(data, { status: response.status });
    
  } catch (error) {
    console.error('Admin test-auth error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error',
      error: String(error) 
    }, { status: 500 });
  }
} 