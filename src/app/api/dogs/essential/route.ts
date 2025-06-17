import { NextResponse } from 'next/server';
import { getAllDogs } from '@/lib/neon';

export async function GET() {
  try {
    const dogs = await getAllDogs();
    
    // Return essential fields only for faster initial load
    const essentialData = dogs.map(dog => ({
      "Dog ID": dog.dog_id,
      "Name": dog.name,
      "Breed AI": dog.breed_ai,
      "mini_pic_1": dog.mini_pic_1,
      "Gender": dog.gender,
      "Approx_Age": dog.approx_age,
      "Weight": dog.weight,
      "Level": dog.level,
      "Location_kennel": dog.location_kennel,
      "Foster_status": dog.foster_status,
      "DFTD_eligibility": dog.dftd_eligibility
    }));

    return NextResponse.json(essentialData, {
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