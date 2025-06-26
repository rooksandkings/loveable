import { neon } from '@neondatabase/serverless';

// Use your connection string from earlier
const sql = neon('postgresql://neondb_owner:npg_mD7PdS5XIhKH@ep-flat-smoke-a5gx7mdm-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require');

export type Dog = {
  dog_id: string;
  name: string;
  breed_ai: string;
  mini_pic_1?: string;
  mini_pic_2?: string;
  mini_pic_3?: string;
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
  adopets_status: string;
  Cuddle_Meter: string;
  Kid_Interaction: string;
  Cat_Interaction: string;
  Dog_Interaction: string;
  Potty_Skills: string;
  Crate_Trained: string;
  Energy_Activity_Level: string;
  Leash_Skills: string;
  shelter_location: string;
};

export type ShortDescription = {
  animal_id: string;
  chuya_breed_ai: string;
  name: string;
  breed_ai: string;
  adopets_url: string;
  asana_permalink_url: string;
  location_kennel: string;
  location_room: string;
  shelter_location: string;
  mini_pic_1?: string;
  mini_pic_2?: string;
  mini_pic_3?: string;
};

export type AsanaProposedChange = {
  comment_gid: number;
  animal_id: string;
  name: string;
  shelter_location: string;
  created_at: string;
  asana_category: string;
  comments_sanitized: string;
  current_value: string;
  proposed_value: string;
  foster_status: string;
};

export async function getAllDogs(): Promise<Dog[]> {
  try {
    const result = await sql`
      SELECT 
        dog_id, name, breed_ai, photo_1, photo_2, photo_3, gender, approx_age, 
        weight, level, location_kennel, location_room, spay_neuter_status, 
        sociability_status, sociablity_playstyle, petpoint_url, breed_ai_1, 
        breed_ai_2, breed_ai_3, dob, intake_date, days_in_dcas, color_pimary, 
        color_seconday, adoption_restriction, da2ppv_vax_date, rabies_vax_date, 
        hw_test_date, heartworm_status, foster_status, l2_reason, play_group_initial, 
        play_group_recent, sociability_notes, adopets_url, dftd_eligibility, 
        mini_pic_1, mini_pic_2, mini_pic_3, adopets_status, "Cuddle_Meter", 
        "Kid_Interaction", "Cat_Interaction", "Dog_Interaction", "Potty_Skills",
        "Crate_Trained", "Energy_Activity_Level", "Leash_Skills", shelter_location
      FROM dogs 
      ORDER BY intake_date DESC
    `;
    console.log('Raw database result:', result);
    console.log('First row sample:', result && (result as any).rows && (result as any).rows[0]);
    
    // Check if result has rows property (array format)
    if (result && (result as any).rows && Array.isArray((result as any).rows)) {
      console.log('Converting array-based response to objects');
      const dogs = (result as any).rows.map((row: any[]) => {
        const dog = {
          dog_id: row[0] || '',
          name: row[1] || '',
          breed_ai: row[2] || '',
          gender: row[6] || '',
          approx_age: row[7] || '',
          weight: parseFloat(row[8]) || 0,
          level: parseInt(row[9]) || 1,
          location_kennel: row[10] || '',
          location_room: row[11] || '',
          spay_neuter_status: row[12] || '',
          sociability_status: row[13] || '',
          sociablity_playstyle: row[14] || '',
          petpoint_url: row[15] || '',
          breed_ai_1: row[16] || '',
          breed_ai_2: row[17] || '',
          breed_ai_3: row[18] || '',
          dob: row[19] || '',
          intake_date: row[20] || '',
          days_in_dcas: parseInt(row[21]) || 0,
          color_pimary: row[22] || '',
          color_seconday: row[23] || '',
          adoption_restriction: row[24] || '',
          da2ppv_vax_date: row[25] || '',
          rabies_vax_date: row[26] || '',
          hw_test_date: row[27] || '',
          heartworm_status: row[28] || '',
          foster_status: row[29] || '',
          l2_reason: row[30] || '',
          play_group_initial: row[31] || '',
          play_group_recent: row[32] || '',
          sociability_notes: row[33] || '',
          adopets_url: row[34] || '',
          dftd_eligibility: row[35] || '',
          mini_pic_1: row[36] || '',
          mini_pic_2: row[37] || '',
          mini_pic_3: row[38] || '',
          adopets_status: row[39] || '',
          Cuddle_Meter: row[40] || '',
          Kid_Interaction: row[41] || '',
          Cat_Interaction: row[42] || '',
          Dog_Interaction: row[43] || '',
          Potty_Skills: row[44] || '',
          Crate_Trained: row[45] || '',
          Energy_Activity_Level: row[46] || '',
          Leash_Skills: row[47] || '',
          shelter_location: row[48] || '',
        };
        console.log('Processed dog:', dog.name, {
          Cuddle_Meter: dog.Cuddle_Meter,
          Kid_Interaction: dog.Kid_Interaction,
          Cat_Interaction: dog.Cat_Interaction,
          Dog_Interaction: dog.Dog_Interaction
        });
        return dog;
      });
      return dogs;
    }
    
    // Fallback for object-based response
    return result as Dog[];
  } catch (error) {
    console.error('Error fetching dogs from Neon:', error);
    throw error;
  }
}

export async function getDogById(dogId: string): Promise<Dog | null> {
  try {
    const result = await sql`SELECT * FROM dogs WHERE dog_id = ${dogId}`;
    console.log('Raw database result for single dog:', result);
    
    if (result && (result as any).rows && Array.isArray((result as any).rows) && (result as any).rows.length > 0) {
      const row = (result as any).rows[0];
      return {
        dog_id: row[0] || '',
        name: row[1] || '',
        breed_ai: row[2] || '',
        gender: row[6] || '',
        approx_age: row[7] || '',
        weight: parseFloat(row[8]) || 0,
        level: parseInt(row[9]) || 1,
        location_kennel: row[10] || '',
        location_room: row[11] || '',
        spay_neuter_status: row[12] || '',
        sociability_status: row[13] || '',
        sociablity_playstyle: row[14] || '',
        petpoint_url: row[15] || '',
        breed_ai_1: row[16] || '',
        breed_ai_2: row[17] || '',
        breed_ai_3: row[18] || '',
        dob: row[19] || '',
        intake_date: row[20] || '',
        days_in_dcas: parseInt(row[21]) || 0,
        color_pimary: row[22] || '',
        color_seconday: row[23] || '',
        adoption_restriction: row[24] || '',
        da2ppv_vax_date: row[25] || '',
        rabies_vax_date: row[26] || '',
        hw_test_date: row[27] || '',
        heartworm_status: row[28] || '',
        foster_status: row[29] || '',
        l2_reason: row[30] || '',
        play_group_initial: row[31] || '',
        play_group_recent: row[32] || '',
        sociability_notes: row[33] || '',
        adopets_url: row[34] || '',
        dftd_eligibility: row[35] || '',
        mini_pic_1: row[36] || '',
        mini_pic_2: row[37] || '',
        mini_pic_3: row[38] || '',
        adopets_status: row[39] || '',
        Cuddle_Meter: row[40] || '',
        Kid_Interaction: row[41] || '',
        Cat_Interaction: row[42] || '',
        Dog_Interaction: row[43] || '',
        Potty_Skills: row[44] || '',
        Crate_Trained: row[45] || '',
        Energy_Activity_Level: row[46] || '',
        Leash_Skills: row[47] || '',
        shelter_location: row[48] || '',
      };
    }
    
    // Fallback for object-based response
    return (result as any)[0] as Dog || null;
  } catch (error) {
    console.error('Error fetching dog by ID from Neon:', error);
    throw error;
  }
}

export async function getAllShortDescriptions(): Promise<ShortDescription[]> {
  try {
    const result = await sql`
      SELECT 
        s.animal_id, s.chuya_breed_ai, s.name, s.breed_ai, s.adopets_url, s.asana_permalink_url,
        d.location_kennel, d.location_room, d.shelter_location, d.mini_pic_1, d.mini_pic_2, d.mini_pic_3
      FROM description_short_ai s
      LEFT JOIN dogs d ON s.animal_id::text = d.dog_id::text
      ORDER BY s.name ASC
    `;
    
    console.log('Raw short descriptions result:', result);
    console.log('First row sample:', result && (result as any).rows && (result as any).rows[0]);
    
    // Check if result has rows property (array format)
    if (result && (result as any).rows && Array.isArray((result as any).rows)) {
      console.log('Converting array-based short descriptions response to objects');
      const descriptions = (result as any).rows.map((row: any[]) => {
        const description = {
          animal_id: row[0] || '',
          chuya_breed_ai: row[1] || '',
          name: row[2] || '',
          breed_ai: row[3] || '',
          adopets_url: row[4] || '',
          asana_permalink_url: row[5] || '',
          location_kennel: row[6] || '',
          location_room: row[7] || '',
          shelter_location: row[8] || '',
          mini_pic_1: row[9] || '',
          mini_pic_2: row[10] || '',
          mini_pic_3: row[11] || '',
        };
        console.log('Processed description:', description.name, {
          animal_id: description.animal_id,
          mini_pic_1: description.mini_pic_1,
          mini_pic_2: description.mini_pic_2,
          mini_pic_3: description.mini_pic_3
        });
        return description;
      });
      return descriptions;
    }
    
    // Fallback for object-based response
    return result as ShortDescription[];
  } catch (error) {
    console.error('Error fetching short descriptions from Neon:', error);
    throw error;
  }
}

export async function getAllAsanaProposedChanges(): Promise<AsanaProposedChange[]> {
  try {
    const result = await sql`
      SELECT 
        apc.comment_gid, apc.animal_id, apc.name, apc.shelter_location, apc.created_at, 
        apc.asana_category, apc.comments_sanitized, apc.current_value, apc.proposed_value
      FROM asana_proposed_change apc
      ORDER BY apc.created_at DESC
    `;
    
    console.log('Raw asana proposed changes result:', result);
    console.log('First row sample:', result && (result as any).rows && (result as any).rows[0]);
    
    // Check if result has rows property (array format)
    if (result && (result as any).rows && Array.isArray((result as any).rows)) {
      console.log('Converting array-based asana proposed changes response to objects');
      const changes = (result as any).rows.map((row: any[]) => {
        const change = {
          comment_gid: parseInt(row[0]) || 0,
          animal_id: row[1] || '',
          name: row[2] || '',
          shelter_location: row[3] || '', // Now populated from the table
          created_at: row[4] || '',
          asana_category: row[5] || '',
          comments_sanitized: row[6] || '',
          current_value: row[7] || '',
          proposed_value: row[8] || '',
          foster_status: '', // Will be populated from dogs data if needed
        };
        console.log('Processed asana change:', change.name, {
          comment_gid: change.comment_gid,
          animal_id: change.animal_id,
          asana_category: change.asana_category,
          shelter_location: change.shelter_location
        });
        return change;
      });
      return changes;
    }
    
    // Fallback for object-based response
    return result as AsanaProposedChange[];
  } catch (error) {
    console.error('Error fetching asana proposed changes from Neon:', error);
    throw error;
  }
} 