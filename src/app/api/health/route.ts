import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Check Python backend health
    const pythonBackendUrl = process.env.PYTHON_BACKEND_URL || 'http://localhost:5001';
    
    const response = await fetch(`${pythonBackendUrl}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Timeout after 3 seconds
      signal: AbortSignal.timeout(3000),
    });

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json({ 
        status: "healthy", 
        pythonBackend: "online",
        pythonBackendData: data
      });
    } else {
      return NextResponse.json({ 
        status: "degraded", 
        pythonBackend: "offline",
        message: "Python backend is not responding"
      });
    }
  } catch (error) {
    return NextResponse.json({ 
      status: "degraded", 
      pythonBackend: "offline",
      message: "Failed to connect to Python backend"
    });
  }
}