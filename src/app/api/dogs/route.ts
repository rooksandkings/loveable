import { NextResponse } from 'next/server';
import { getAllDogs } from '@/lib/neon';

export async function GET() {
  try {
    const dogs = await getAllDogs();
    
    // Transform to match your current frontend format
    const transformedDogs = dogs.map(dog => ({
      "Dog ID": dog.dog_id,
      "Name": dog.name,
      "Breed AI": dog.breed_ai,
      "Photo_1": dog.photo_1,
      "Photo_2": dog.photo_2,
      "Photo_3": dog.photo_3,
      "Gender": dog.gender,
      "Approx_Age": dog.approx_age,
      "Weight": dog.weight,
      "Level": dog.level,
      "Location_kennel": dog.location_kennel,
      "Location_room": dog.location_room,
      "Spay_Neuter_status": dog.spay_neuter_status,
      "Sociability_status": dog.sociability_status,
      "Sociablity_playstyle": dog.sociablity_playstyle,
      "Petpoint_url": dog.petpoint_url,
      "Breed_AI_1": dog.breed_ai_1,
      "Breed_AI_2": dog.breed_ai_2,
      "Breed_AI_3": dog.breed_ai_3,
      "DOB": dog.dob,
      "Intake_Date": dog.intake_date,
      "Days_in_DCAS": dog.days_in_dcas,
      "Color_pimary": dog.color_pimary,
      "Color_seconday": dog.color_seconday,
      "Adoption_restriction": dog.adoption_restriction,
      "DA2PPV_vax_date": dog.da2ppv_vax_date,
      "Rabies_vax_date": dog.rabies_vax_date,
      "HW_test_date": dog.hw_test_date,
      "Heartworm_Status": dog.heartworm_status,
      "Foster_status": dog.foster_status,
      "L2_reason": dog.l2_reason,
      "Play_group_initial": dog.play_group_initial,
      "Play_group_recent": dog.play_group_recent,
      "Sociability_notes": dog.sociability_notes,
      "Adopets_url": dog.adopets_url,
      "DFTD_eligibility": dog.dftd_eligibility,
      "Mini_pic_1": dog.mini_pic_1,
      "Mini_pic_2": dog.mini_pic_2,
      "Mini_pic_3": dog.mini_pic_3,
      "Adopets_status": dog.adopets_status
    }));

    return NextResponse.json(transformedDogs);
  } catch (error) {
    console.error('Error fetching dogs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dogs' },
      { status: 500 }
    );
  }
} 