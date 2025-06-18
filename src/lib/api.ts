import { getAllDogs } from './neon-api';
import type { Dog } from '../types/Dog';

interface RawDog {
  "Dog ID": number;
  "Name": string;
  "Breed AI": string;
  "mini_pic_1": string;
  "mini_pic_2": string;
  "mini_pic_3": string;
  "Gender": string;
  "Approx_Age": string;
  "Weight": number;
  "Level": number;
  "Location_kennel": string;
  "Location_room": string;
  "Spay_Neuter_status": string;
  "Sociability_status": string;
  "Sociablity_playstyle": string;
  "Breed_AI_1": string;
  "Breed_AI_2": string;
  "Breed_AI_3": string;
  "DOB": string;
  "Intake_Date": string;
  "Days_in_DCAS": number;
  "Color_pimary": string;
  "Color_seconday": string;
  "Foster_status": string;
  "Heartworm_Status": string;
  "Sociability_notes": string;
  "Adopets_url": string;
  "Rabies_vax_date": string;
  "DFTD_eligibility": string;
  "Cuddle_Meter": string;
  "Kid_Interaction": string;
  "Cat_Interaction": string;
  "Dog_Interaction": string;
  "Potty_Skills": string;
  "Crate_Trained": string;
  "Energy_Level": string;
  "Leash_Skills": string;
}

export async function fetchDogs(): Promise<Dog[]> {
  const rawDogs = (await getAllDogs() as unknown) as RawDog[];
  
  return rawDogs
    .filter(dog => dog["Name"] && !dog["Name"].startsWith('http'))
    .map((dog: RawDog): Dog => ({
      id: dog["Dog ID"].toString(),
      name: dog["Name"],
      breed: dog["Breed AI"],
      images: [
        dog.mini_pic_1,
        dog.mini_pic_2,
        dog.mini_pic_3
      ].filter(Boolean),
      gender: dog["Gender"],
      age: dog["Approx_Age"],
      weight: dog["Weight"],
      level: dog["Level"],
      location: {
        kennel: dog["Location_kennel"],
        room: dog["Location_room"]
      },
      status: {
        spayNeuter: dog["Spay_Neuter_status"],
        sociability: dog["Sociability_status"],
        playstyle: dog["Sociablity_playstyle"]
      },
      url: dog["Adopets_url"],
      breeds: [
        dog["Breed_AI_1"],
        dog["Breed_AI_2"],
        dog["Breed_AI_3"]
      ].filter(Boolean),
      dob: dog["DOB"],
      intakeDate: dog["Intake_Date"],
      daysInShelter: dog["Days_in_DCAS"],
      colors: {
        primary: dog["Color_pimary"],
        secondary: dog["Color_seconday"]
      },
      adoptionRestriction: dog["Foster_status"],
      vaccinations: {
        da2ppv: "",
        rabies: dog["Rabies_vax_date"],
        heartworm: dog["Heartworm_Status"]
      },
      heartwormStatus: dog["Heartworm_Status"],
      fosterStatus: dog["Foster_status"],
      l2Reason: "",
      playGroups: {
        initial: "",
        recent: ""
      },
      sociabilityNotes: dog["Sociability_notes"],
      adopetsUrl: dog["Adopets_url"],
      dftdEligibility: dog["DFTD_eligibility"],
      adopetsStatus: "",
      traits: {
        cuddleMeter: dog["Cuddle_Meter"],
        kidInteraction: dog["Kid_Interaction"],
        catInteraction: dog["Cat_Interaction"],
        dogInteraction: dog["Dog_Interaction"],
        pottySkills: dog["Potty_Skills"],
        crateTrained: dog["Crate_Trained"],
        energyLevel: dog["Energy_Level"],
        leashSkills: dog["Leash_Skills"]
      }
    }));
} 