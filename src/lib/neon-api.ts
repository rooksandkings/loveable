import { neon } from '@neondatabase/serverless';

// Use your connection string from earlier
const sql = neon('postgresql://neondb_owner:npg_trG0JRad6sxP@ep-flat-smoke-a5gx7mdm-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require');

export type Dog = {
  dog_id: string;
  name: string;
  breed_ai: string;
  photo_1?: string;
  photo_2?: string;
  photo_3?: string;
  gender: string;
  approx_age: string;
  weight: number;
  level: number;
  location_kennel: string;
  location_room: string;
  spay_neuter_status: string;
  sociability_status: string;
  sociablity_playstyle: string;
  petpoint_url: string;
  breed_ai_1: string;
  breed_ai_2: string;
  breed_ai_3: string;
  dob: string;
  intake_date: string;
  days_in_dcas: number;
  color_pimary: string;
  color_seconday: string;
  adoption_restriction: string;
  da2ppv_vax_date: string;
  rabies_vax_date: string;
  hw_test_date: string;
  heartworm_status: string;
  foster_status: string;
  l2_reason: string;
  play_group_initial: string;
  play_group_recent: string;
  sociability_notes: string;
  adopets_url: string;
  dftd_eligibility: string;
  mini_pic_1: string;
  mini_pic_2: string;
  mini_pic_3: string;
  adopets_status: string;
};

export async function getAllDogs(): Promise<Dog[]> {
  try {
    const dogs = await sql`SELECT * FROM dogs ORDER BY intake_date DESC`;
    return dogs as Dog[];
  } catch (error) {
    console.error('Error fetching dogs from Neon:', error);
    throw error;
  }
}

export async function getDogById(dogId: string): Promise<Dog | null> {
  try {
    const dogs = await sql`SELECT * FROM dogs WHERE dog_id = ${dogId}`;
    return dogs[0] as Dog || null;
  } catch (error) {
    console.error('Error fetching dog by ID from Neon:', error);
    throw error;
  }
} 