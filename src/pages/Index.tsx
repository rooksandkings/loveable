import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Heart, MapPin, Calendar, Weight, Grid, List, Filter, ArrowUpDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import DogList from '@/components/DogList';
import BreedFilter from '@/components/BreedFilter';
import FosterFilter from '@/components/FosterFilter';
import { parseAge } from '@/utils/dogUtils';
import { getAllDogs } from '@/lib/neon-api';

interface Dog {
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
  "Adopets_status": string;
  "Cuddle_Meter": string;
  "Kid_Interaction": string;
  "Cat_Interaction": string;
  "Dog_Interaction": string;
  "Potty_Skills": string;
  "Crate_Trained": string;
  "Energy_Activity_Level": string;
  "Leash_Skills": string;
  "shelter_location": string;
}

type SortOption = 'name' | 'age' | 'size' | 'level' | 'weight' | 'dftdEligible' | 'daysInCare' | 'daysInCareDesc';

const RunningDog = () => (
  <div className="relative">
    {/* Dog body */}
    <div className="animate-dog-run">
      <svg width="120" height="80" viewBox="0 0 120 80" className="text-orange-600">
        {/* Dog body */}
        <ellipse cx="60" cy="45" rx="35" ry="20" fill="currentColor" />
        
        {/* Dog head */}
        <circle cx="85" cy="35" r="18" fill="currentColor" />
        
        {/* Dog ears */}
        <ellipse cx="78" cy="25" rx="6" ry="12" fill="currentColor" transform="rotate(-20 78 25)" />
        <ellipse cx="92" cy="25" rx="6" ry="12" fill="currentColor" transform="rotate(20 92 25)" />
        
        {/* Dog tail */}
        <ellipse cx="25" cy="35" rx="4" ry="15" fill="currentColor" transform="rotate(45 25 35)" />
        
        {/* Front legs */}
        <g className="animate-leg-front" style={{transformOrigin: '70px 60px'}}>
          <rect x="68" y="60" width="4" height="15" fill="currentColor" />
        </g>
        <g className="animate-leg-front" style={{transformOrigin: '78px 60px', animationDelay: '0.3s'}}>
          <rect x="76" y="60" width="4" height="15" fill="currentColor" />
        </g>
        
        {/* Back legs */}
        <g className="animate-leg-back" style={{transformOrigin: '45px 60px'}}>
          <rect x="43" y="60" width="4" height="15" fill="currentColor" />
        </g>
        <g className="animate-leg-back" style={{transformOrigin: '55px 60px', animationDelay: '0.3s'}}>
          <rect x="53" y="60" width="4" height="15" fill="currentColor" />
        </g>
        
        {/* Dog nose */}
        <circle cx="95" cy="35" r="2" fill="#1f2937" />
        
        {/* Dog eye */}
        <circle cx="88" cy="30" r="2" fill="#1f2937" />
      </svg>
    </div>
    
    {/* Bouncing ball */}
    <div className="absolute top-0 left-0">
      <div className="animate-ball-bounce text-2xl">🎾</div>
    </div>
  </div>
);

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBreed, setSelectedBreed] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [viewMode, setViewMode] = useState('cards');
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  const toggleFavorite = (dogId: number) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(dogId)) {
        newFavorites.delete(dogId);
      } else {
        newFavorites.add(dogId);
      }
      return newFavorites;
    });
  };

  const { data: dogs = [], isLoading, error } = useQuery({
    queryKey: ['dogs'],
    queryFn: async () => {
      try {
        console.log('Fetching dogs...');
        const dogs = await getAllDogs();
        console.log('Raw dogs from API:', dogs);
        console.log('Number of dogs fetched:', dogs?.length);
        
        // Transform to match your current frontend format
        const transformedDogs = dogs.map((dog) => {
          console.log('Processing dog:', dog.dog_id, dog.name);
          const transformed = {
            "Dog ID": dog.dog_id,
            "Name": dog.name,
            "Breed AI": dog.breed_ai,
            "mini_pic_1": dog.mini_pic_1?.replace(/\n/g, '').trim() || '',
            "mini_pic_2": dog.mini_pic_2?.replace(/\n/g, '').trim() || '',
            "mini_pic_3": dog.mini_pic_3?.replace(/\n/g, '').trim() || '',
            "Gender": dog.gender?.trim() || 'Unknown',
            "Approx_Age": dog.approx_age,
            "Weight": dog.weight || 0,
            "Level": dog.level || 0,
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
            "Days_in_DCAS": dog.days_in_dcas || 0,
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
            "Sociability_notes": dog.sociability_notes?.replace(/\n/g, '').trim() || '',
            "Adopets_url": dog.adopets_url,
            "DFTD_eligibility": dog.dftd_eligibility,
            "Adopets_status": dog.adopets_status,
            "Cuddle_Meter": dog.Cuddle_Meter || '',
            "Kid_Interaction": dog.Kid_Interaction || '',
            "Cat_Interaction": dog.Cat_Interaction || '',
            "Dog_Interaction": dog.Dog_Interaction || '',
            "Potty_Skills": dog.Potty_Skills || '',
            "Crate_Trained": dog.Crate_Trained || '',
            "Energy_Activity_Level": dog.Energy_Activity_Level || '',
            "Leash_Skills": dog.Leash_Skills || '',
            "shelter_location": dog.shelter_location || '',
          };
          console.log('Transformed dog:', transformed);
          return transformed;
        });
        
        console.log('Transformed dogs:', transformedDogs);
        console.log('Number of transformed dogs:', transformedDogs?.length);
        
        const filteredDogs = transformedDogs.filter((dog: any) => {
          const isValid = dog.Name && !dog.Name.startsWith('http');
          if (!isValid) {
            console.log('Filtered out dog:', dog);
          }
          return isValid;
        });
        
        console.log('Filtered dogs:', filteredDogs);
        console.log('Number of filtered dogs:', filteredDogs?.length);
        
        if (filteredDogs.length === 0) {
          console.warn('No dogs passed the filter!');
        }
        
        return filteredDogs;
      } catch (error) {
        console.error('Fetch error:', error);
        throw error;
      }
    },
    // Optimize caching since data only updates once a day
    staleTime: 1000 * 60 * 60 * 12, // 12 hours - data is fresh for 12 hours
    gcTime: 1000 * 60 * 60 * 24, // 24 hours - keep in cache for 24 hours
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Function to consolidate similar breeds
  const consolidateBreed = (breedString: string): string => {
    if (!breedString || breedString.trim() === '') return 'Mixed Breed';
    
    const breed = breedString.toLowerCase();
    
    // Pit Bull variations
    if (breed.includes('pit bull') || breed.includes('pitbull') || 
        breed.includes('american pit bull') || breed.includes('staffordshire')) {
      return 'Pit Bull / Staffordshire';
    }
    
    // Boxer variations
    if (breed.includes('boxer')) {
      return 'Boxer';
    }
    
    // Labrador variations
    if (breed.includes('labrador') || breed.includes('lab mix')) {
      return 'Labrador Retriever';
    }
    
    // German Shepherd variations
    if (breed.includes('german shepherd')) {
      return 'German Shepherd';
    }
    
    // Husky variations
    if (breed.includes('husky') || breed.includes('alaskan malamute')) {
      return 'Husky / Northern Breed';
    }
    
    // Bulldog variations
    if (breed.includes('bulldog') || breed.includes('american bulldog') || 
        breed.includes('french bulldog') || breed.includes('english bulldog')) {
      return 'Bulldog';
    }
    
    // Belgian Malinois variations
    if (breed.includes('belgian malinois') || breed.includes('belgian shepherd')) {
      return 'Belgian Malinois';
    }
    
    // Rottweiler variations
    if (breed.includes('rottweiler')) {
      return 'Rottweiler';
    }
    
    // Cane Corso variations
    if (breed.includes('cane corso')) {
      return 'Cane Corso';
    }
    
    // Border Collie variations
    if (breed.includes('border collie')) {
      return 'Border Collie';
    }
    
    // Chihuahua variations
    if (breed.includes('chihuahua')) {
      return 'Chihuahua';
    }
    
    // Great Dane variations
    if (breed.includes('great dane')) {
      return 'Great Dane';
    }
    
    // Terrier variations (excluding pit bull terrier which is handled above)
    if (breed.includes('terrier') && !breed.includes('pit bull') && !breed.includes('staffordshire')) {
      return 'Terrier';
    }
    
    // Retriever variations (excluding Labrador which is handled above)
    if (breed.includes('retriever') && !breed.includes('labrador')) {
      return 'Retriever';
    }
    
    // Shepherd variations (excluding German Shepherd which is handled above)
    if (breed.includes('shepherd') && !breed.includes('german')) {
      return 'Shepherd';
    }
    
    // Mixed Breed variations
    if (breed.includes('mixed breed') || breed.includes('mix')) {
      return 'Mixed Breed';
    }
    
    // If no consolidation matches, return the first breed mentioned
    const firstBreed = breedString.split(',')[0].trim();
    return firstBreed || 'Mixed Breed';
  };

  // Get unique consolidated breeds for the dropdown
  const uniqueBreeds = useMemo(() => {
    const breeds = dogs.map(dog => consolidateBreed(dog["Breed AI"]));
    return [...new Set(breeds)].sort();
  }, [dogs]);

  // Updated filtering logic
  const filteredDogs = useMemo(() => {
    return dogs.filter(dog => {
      const matchesSearch = searchTerm === '' || 
        dog.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        consolidateBreed(dog["Breed AI"]).toLowerCase().includes(searchTerm.toLowerCase()) ||
        dog["Dog ID"].toString().includes(searchTerm);
      const matchesBreed = selectedBreed === 'all' || 
        consolidateBreed(dog["Breed AI"]) === selectedBreed;
      const isFoster =
        (dog.Location_kennel && dog.Location_kennel.toLowerCase().includes('foster')) ||
        (dog.Location_room && dog.Location_room.toLowerCase().includes('foster'));
      let matchesLocation = true;
      switch (locationFilter) {
        case 'all':
          matchesLocation = true;
          break;
        case 'all_in_foster':
          matchesLocation = isFoster;
          break;
        case 'all_in_shelter':
          matchesLocation = !isFoster;
          break;
        case 'DCAS_in_shelter':
          matchesLocation = dog.shelter_location === 'DCAS' && !isFoster;
          break;
        case 'DCAS_in_foster':
          matchesLocation = isFoster && dog.shelter_location === 'DCAS';
          break;
        case 'FCAS_in_shelter':
          matchesLocation = dog.shelter_location === 'FCAS' && !isFoster;
          break;
        case 'FCAS_in_foster':
          matchesLocation = isFoster && dog.shelter_location === 'FCAS';
          break;
        case 'CAC_in_shelter':
          matchesLocation = dog.shelter_location === 'CAC' && !isFoster;
          break;
        case 'CAC_in_foster':
          matchesLocation = isFoster && dog.shelter_location === 'CAC';
          break;
        default:
          matchesLocation = true;
      }
      // Filter out dogs without a valid adoption URL
      const hasValidAdoptionUrl = dog.Adopets_url && dog.Adopets_url !== "Dog Not Found";
      return matchesSearch && matchesBreed && matchesLocation && hasValidAdoptionUrl;
    });
  }, [dogs, searchTerm, selectedBreed, locationFilter]);

  const sortedDogs = useMemo(() => {
    const sorted = [...filteredDogs];
    
    switch (sortBy) {
      case 'name':
        sorted.sort((a, b) => a.Name.localeCompare(b.Name));
        break;
      case 'age':
        sorted.sort((a, b) => {
          const ageA = parseAge(a.Approx_Age);
          const ageB = parseAge(b.Approx_Age);
          return ageA - ageB;
        });
        break;
      case 'size':
        sorted.sort((a, b) => parseFloat(String(a.Weight || 0)) - parseFloat(String(b.Weight || 0)));
        break;
      case 'level':
        sorted.sort((a, b) => parseInt(String(a.Level || 0)) - parseInt(String(b.Level || 0)));
        break;
      case 'weight':
        sorted.sort((a, b) => parseFloat(String(a.Weight || 0)) - parseFloat(String(b.Weight || 0)));
        break;
      case 'dftdEligible':
        sorted.sort((a, b) => {
          const aEligible = a.DFTD_eligibility === "Yes" ? 1 : 0;
          const bEligible = b.DFTD_eligibility === "Yes" ? 1 : 0;
          return bEligible - aEligible; // DFTD eligible dogs first
        });
        break;
      case 'daysInCare':
        sorted.sort((a, b) => b.Days_in_DCAS - a.Days_in_DCAS);
        break;
      case 'daysInCareDesc':
        sorted.sort((a, b) => a.Days_in_DCAS - b.Days_in_DCAS);
        break;
      default:
        break;
    }
    
    return sorted;
  }, [filteredDogs, sortBy]);

  if (isLoading) {
    // Show the main page immediately with loading state for dogs
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
        {/* Simple Header */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
              Paw Poster
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              🐾 To be seen is to be saved 🐾
            </p>

            {/* Simple Search Bar - disabled while loading */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-100 max-w-5xl mx-auto opacity-50">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1 min-w-0">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    placeholder="Loading dogs..."
                    disabled
                    className="pl-10 h-12 border-orange-200 rounded-xl text-base"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Loading state for dogs */}
        <section className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <div className="text-lg text-gray-600">Loading amazing dogs...</div>
          </div>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl mb-6">😢</div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-500 mb-4">We couldn't fetch the dogs right now</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="bg-orange-500 hover:bg-orange-600"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Simple Header */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Paw Poster
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            🐾 To be seen is to be saved 🐾
          </p>

          {/* Simple Search Bar */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-100 max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Input */}
              <div className="relative flex-1 min-w-0">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search by name, looks, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 border-orange-200 focus:border-orange-400 focus:ring-orange-400 rounded-xl text-base"
                />
              </div>

              {/* Filter Dropdowns and View Toggle */}
              <div className="flex gap-2 flex-shrink-0">
                <Select value={selectedBreed} onValueChange={setSelectedBreed}>
                  <SelectTrigger className="h-12 w-48 border-orange-200 focus:border-orange-400 focus:ring-orange-400 rounded-xl">
                    <SelectValue placeholder="Resembles All Dogs" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Resembles All Dogs</SelectItem>
                    {uniqueBreeds.map(breed => (
                      <SelectItem key={breed} value={breed}>{breed}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={locationFilter} onValueChange={setLocationFilter}>
                  <SelectTrigger className="h-12 w-64 border-orange-200 focus:border-orange-400 focus:ring-orange-400 rounded-xl">
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Dogs</SelectItem>
                    <SelectItem value="all_in_shelter">All In Shelter</SelectItem>
                    <SelectItem value="all_in_foster">All In Foster</SelectItem>
                    <SelectItem value="DCAS_in_shelter">DCAS In Shelter</SelectItem>
                    <SelectItem value="DCAS_in_foster">DCAS In Foster</SelectItem>
                    <SelectItem value="FCAS_in_shelter">FCAS In Shelter</SelectItem>
                    <SelectItem value="FCAS_in_foster">FCAS In Foster</SelectItem>
                    <SelectItem value="CAC_in_shelter">CAC In Shelter</SelectItem>
                    <SelectItem value="CAC_in_foster">CAC In Foster</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                  <SelectTrigger className="h-12 w-40 border-orange-200 focus:border-orange-400 focus:ring-orange-400 rounded-xl">
                    <ArrowUpDown className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="age">Age</SelectItem>
                    <SelectItem value="size">Size</SelectItem>
                    <SelectItem value="level">Level</SelectItem>
                    <SelectItem value="weight">Weight</SelectItem>
                    <SelectItem value="daysInCare">Oldest</SelectItem>
                    <SelectItem value="daysInCareDesc">Newest</SelectItem>
                    <SelectItem value="dftdEligible">DFTD Eligible</SelectItem>
                  </SelectContent>
                </Select>

                {/* View Toggle */}
                <ToggleGroup type="single" value={viewMode} onValueChange={setViewMode} className="bg-gray-100 rounded-xl p-1 h-12">
                  <ToggleGroupItem value="cards" className="data-[state=on]:bg-white data-[state=on]:shadow-sm h-10 px-3">
                    <Grid className="h-4 w-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="table" className="data-[state=on]:bg-white data-[state=on]:shadow-sm h-10 px-3">
                    <List className="h-4 w-4" />
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>

            {/* Results count only */}
            <div className="flex items-center justify-center mt-4">
              <span className="text-gray-600 font-medium">
                {filteredDogs.length} of {dogs.length} dogs
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Dogs Section */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <DogList
            dogs={sortedDogs}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            viewMode={viewMode}
          />

          {filteredDogs.length === 0 && (
            <div className="text-center py-16">
              <div className="text-8xl mb-6">🐕‍🦺</div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-4">No dogs found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your search criteria to find more furry friends!</p>
              <Button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedBreed('all');
                  setLocationFilter('all');
                }}
                className="bg-orange-500 hover:bg-orange-600"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Index;
