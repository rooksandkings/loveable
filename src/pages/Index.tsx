import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Heart, MapPin, Calendar, Weight, Grid, List } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import DogCard from '@/components/DogCard';
import DogTable from '@/components/DogTable';
import BreedFilter from '@/components/BreedFilter';
import FosterFilter from '@/components/FosterFilter';

interface Dog {
  "Dog ID": number;
  "Name": string;
  "Breed AI": string;
  "Photo_1": string;
  "Photo_2": string;
  "Photo_3": string;
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
}

const fetchDogs = async (): Promise<Dog[]> => {
  const response = await fetch('https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLjh44ffoe_iiF8AFXotXSeDLk7Gkn0m6LepBdW2hlAPuP06neEUc0LsSWFk9sYq0K6nFmDijUE9VSi9raD6C9B9Yh5oX3yjj16yO0e1rBo-c92iEARyHdoU0-1ve3UIftgPvKbZ41aoDok4PaiOs6ZYDgec70hnwpgn14aaC6jEQwY4GOYisEUt-QVggywSGKCFEdx1yWcylIffznFw8AwnpaVHsC8KMuJwSWb7nxXKR_Lo2qM3VD_SOENuoZE0eIujtlRThDVuz4812up_2Lgh81keAKREeNud9heK&lib=MiCfzZiaaYfsqqS1efC_mJ7dOQqPxPsnb');
  if (!response.ok) {
    throw new Error('Failed to fetch dogs data');
  }
  return response.json();
};

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBreed, setSelectedBreed] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [fosterStatus, setFosterStatus] = useState('not-foster');

  const { data: dogs = [], isLoading, error } = useQuery({
    queryKey: ['dogs'],
    queryFn: fetchDogs,
  });

  // Normalize breed names to group similar breeds
  const normalizeBreed = (breed: string): string => {
    const normalized = breed.toLowerCase().trim();
    
    // Group all husky variants
    if (normalized.includes('husky')) return 'husky';
    if (normalized.includes('shepherd')) return 'shepherd';
    if (normalized.includes('retriever')) return 'retriever';
    if (normalized.includes('terrier')) return 'terrier';
    if (normalized.includes('bulldog') || normalized.includes('bull dog')) return 'bulldog';
    if (normalized.includes('pit bull') || normalized.includes('pitbull')) return 'pit bull';
    if (normalized.includes('chihuahua')) return 'chihuahua';
    if (normalized.includes('poodle')) return 'poodle';
    if (normalized.includes('boxer')) return 'boxer';
    if (normalized.includes('beagle')) return 'beagle';
    if (normalized.includes('rottweiler')) return 'rottweiler';
    if (normalized.includes('dachshund')) return 'dachshund';
    
    return normalized.replace(/\s+mix\s*$/, '').replace(/\s+/, ' ');
  };

  // Get unique normalized breeds for filtering
  const uniqueBreeds = useMemo(() => {
    const breedSet = new Set<string>();
    dogs.forEach(dog => {
      if (dog["Breed_AI_1"]) breedSet.add(normalizeBreed(dog["Breed_AI_1"]));
      if (dog["Breed_AI_2"]) breedSet.add(normalizeBreed(dog["Breed_AI_2"]));
      if (dog["Breed_AI_3"]) breedSet.add(normalizeBreed(dog["Breed_AI_3"]));
    });
    return Array.from(breedSet).sort();
  }, [dogs]);

  // Filter and sort dogs
  const filteredDogs = useMemo(() => {
    let filtered = dogs.filter(dog => {
      const matchesSearch = dog.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           dog["Breed AI"].toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesBreed = selectedBreed === 'all' || 
                          normalizeBreed(dog["Breed_AI_1"]) === selectedBreed ||
                          normalizeBreed(dog["Breed_AI_2"]) === selectedBreed ||
                          normalizeBreed(dog["Breed_AI_3"]) === selectedBreed;
      
      const matchesFoster = fosterStatus === 'all' ||
                           (fosterStatus === 'foster' && dog["Foster_status"] === "Yes") ||
                           (fosterStatus === 'not-foster' && dog["Foster_status"] !== "Yes");
      
      return matchesSearch && matchesBreed && matchesFoster;
    });

    // Sort dogs
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'age':
          return a["Days_in_DCAS"] - b["Days_in_DCAS"];
        case 'weight':
          return a.Weight - b.Weight;
        case 'name':
        default:
          return a.Name.localeCompare(b.Name);
      }
    });
  }, [dogs, searchTerm, selectedBreed, sortBy, fosterStatus]);

  const toggleFavorite = (dogId: number) => {
    setFavorites(prev => 
      prev.includes(dogId) 
        ? prev.filter(id => id !== dogId)
        : [...prev, dogId]
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Loading adorable dogs...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600">Unable to load dog data. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              🐕 Find Your Perfect Companion
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover loving dogs waiting for their forever homes. Every adoption saves a life and makes room for another rescue.
            </p>
          </div>
        </div>
      </header>

      {/* Filters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="bg-white/80 backdrop-blur-sm border-orange-200">
          <CardHeader>
            <CardTitle className="text-center text-xl text-gray-800">Find Your Match</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name or breed..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-orange-200 focus:border-orange-400"
                />
              </div>
              
              <BreedFilter 
                breeds={uniqueBreeds}
                selectedBreed={selectedBreed}
                onBreedChange={setSelectedBreed}
              />
              
              <FosterFilter
                selectedFosterStatus={fosterStatus}
                onFosterStatusChange={setFosterStatus}
              />
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="border-orange-200">
                  <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Sort by Name</SelectItem>
                  <SelectItem value="age">Sort by Time in Shelter</SelectItem>
                  <SelectItem value="weight">Sort by Weight</SelectItem>
                </SelectContent>
              </Select>

              <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as 'grid' | 'table')}>
                <ToggleGroupItem value="grid" className="border-orange-200">
                  <Grid className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="table" className="border-orange-200">
                  <List className="h-4 w-4" />
                </ToggleGroupItem>
              </ToggleGroup>

              <div className="text-center text-sm text-gray-600 flex items-center justify-center">
                <span className="bg-orange-100 px-3 py-2 rounded-full">
                  {filteredDogs.length} dogs available
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Dogs Display */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {filteredDogs.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No dogs found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredDogs.map((dog) => (
                  <DogCard
                    key={dog["Dog ID"]}
                    dog={dog}
                    isFavorite={favorites.includes(dog["Dog ID"])}
                    onToggleFavorite={() => toggleFavorite(dog["Dog ID"])}
                  />
                ))}
              </div>
            ) : (
              <DogTable
                dogs={filteredDogs}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
              />
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default Index;
