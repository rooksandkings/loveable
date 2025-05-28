import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch(
      'https://script.google.com/macros/s/AKfycbwmCI7sSpHOBevlkAFfFBJTu7wAjWLUmYOferhSC1pqDCQwxdJ0wcHeQtc0Frl_9EbKdw/exec?action=getEssential',
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        cache: 'no-store'
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, max-age=300',
      },
    });
  } catch (error) {
    console.error('Error fetching essential dog data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch essential dog data' },
      { status: 500 }
    );
  }
} 