import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.NEON_DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

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
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM dogs ORDER BY intake_date DESC');
    return result.rows;
  } finally {
    client.release();
  }
}

export async function getDogById(dogId: string): Promise<Dog | null> {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM dogs WHERE dog_id = $1', [dogId]);
    return result.rows[0] || null;
  } finally {
    client.release();
  }
}

export default pool; 