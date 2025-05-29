import { NextResponse } from 'next/server';
import { getDogById } from '@/lib/neon';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const dog = await getDogById(params.id);
    
    if (!dog) {
      return NextResponse.json(
        { error: 'Dog not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(dog);
  } catch (error) {
    console.error('Error fetching dog:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dog' },
      { status: 500 }
    );
  }
} 