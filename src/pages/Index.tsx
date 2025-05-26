import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Heart, MapPin, Calendar, Weight, Grid, List, Filter } from 'lucide-react';
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
  const [fosterStatus, setFosterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const { data: dogs = [], isLoading, error } = useQuery({
    queryKey: ['dogs'],
    queryFn: async () => {
      try {
        console.log('Fetching dogs from Google Apps Script...');
        const response = await fetch('https://script.google.com/macros/s/AKfycbwmCI7sSpHOBevlkAFfFBJTu7wAjWLUmYOferhSC1pqDCQwxdJ0wcHeQtc0Frl_9EbKdw/exec');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Raw API response:', data);
        
        // Clean up the data but keep the original field names that DogCard expects
        const cleanedData = data
          .filter((dog: any) => dog.Name && !dog.Name.startsWith('http'))
          .map((dog: any) => ({
            ...dog,
            "Photo_1": dog["Photo_1"]?.replace(/\n/g, '').trim() || '',
            "Photo_2": dog["Photo_2"]?.replace(/\n/g, '').trim() || '',
            "Photo_3": dog["Photo_3"]?.replace(/\n/g, '').trim() || '',
            "Breed AI": dog["Breed AI"]?.replace(/\n/g, '').trim() || '',
            "Sociability_notes": dog["Sociability_notes"]?.replace(/\n/g, '').trim() || ''
          }));
        
        console.log('Cleaned data:', cleanedData.slice(0, 3));
        return cleanedData;
      } catch (error) {
        console.error('Fetch error:', error);
        throw error;
      }
    },
  });

  // Get unique breeds for filter
  const uniqueBreeds = useMemo(() => {
    const breeds = new Set<string>();
    dogs.forEach(dog => {
      if (dog["Breed AI"]) {
        breeds.add(dog["Breed AI"]);
      }
    });
    return Array.from(breeds).sort();
  }, [dogs]);

  // Filter and sort dogs
  const filteredDogs = useMemo(() => {
    let filtered = dogs.filter(dog => {
      const matchesSearch = !searchTerm || 
        dog.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dog["Breed AI"]?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesBreed = selectedBreed === 'all' || dog["Breed AI"] === selectedBreed;
      
      const matchesFoster = fosterStatus === 'all' || 
        (fosterStatus === 'yes' && dog["Foster_status"] === 'Yes') ||
        (fosterStatus === 'no' && dog["Foster_status"] !== 'Yes');
      
      return matchesSearch && matchesBreed && matchesFoster;
    });

    // Fixed sorting with proper error handling
    filtered.sort((a, b) => {
      try {
        switch (sortBy) {
          case 'size':
            const getSizeOrder = (weight: number | undefined) => {
              const w = weight || 0;
              if (w <= 25) return 1; // Small
              if (w <= 60) return 2; // Medium  
              return 3; // Large
            };
            const sizeA = getSizeOrder(a.Weight);
            const sizeB = getSizeOrder(b.Weight);
            return sizeA - sizeB;
          case 'weight':
            return (a.Weight || 0) - (b.Weight || 0);
          case 'days':
            return (b["Days_in_DCAS"] || 0) - (a["Days_in_DCAS"] || 0);
          case 'age':
            return (a["Approx_Age"] || '').localeCompare(b["Approx_Age"] || '');
          case 'name':
          default:
            return (a.Name || '').localeCompare(b.Name || '');
        }
      } catch (error) {
        console.error('Sorting error:', error);
        return 0;
      }
    });

    return filtered;
  }, [dogs, searchTerm, selectedBreed, fosterStatus, sortBy]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-8 flex justify-center">
            <RunningDog />
          </div>
          
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Fetching the best doggos...</h2>
          <p className="text-gray-500">Finding your perfect companion</p>
          
          {/* Loading dots */}
          <div className="flex justify-center space-x-1 mt-4">
            <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>

          {/* Version */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <p className="text-sm text-gray-400">v1.3.0</p>
          </div>
        </div>
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
            Find Your Perfect Companion
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Every dog deserves a loving home. Browse our adorable rescue dogs and find your new best friend today! 🐾
          </p>

          {/* Simple Search Bar */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-100 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Input */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search by name or breed..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 border-orange-200 focus:border-orange-400 focus:ring-orange-400 rounded-xl"
                />
              </div>

              {/* Filter Dropdowns */}
              <div className="flex gap-2">
                <Select value={selectedBreed} onValueChange={setSelectedBreed}>
                  <SelectTrigger className="h-12 w-48 border-orange-200 focus:border-orange-400 focus:ring-orange-400 rounded-xl">
                    <SelectValue placeholder="All Breeds" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Breeds</SelectItem>
                    {uniqueBreeds.map(breed => (
                      <SelectItem key={breed} value={breed}>{breed}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={fosterStatus} onValueChange={setFosterStatus}>
                  <SelectTrigger className="h-12 w-40 border-orange-200 focus:border-orange-400 focus:ring-orange-400 rounded-xl">
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Dogs</SelectItem>
                    <SelectItem value="yes">Foster Care</SelectItem>
                    <SelectItem value="no">At Shelter</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="h-12 w-40 border-orange-200 focus:border-orange-400 focus:ring-orange-400 rounded-xl">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="age">Age</SelectItem>
                    <SelectItem value="size">Size</SelectItem>
                    <SelectItem value="weight">Weight</SelectItem>
                    <SelectItem value="days">Days in Shelter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Results and View Toggle */}
            <div className="flex items-center justify-between mt-4">
              <span className="text-gray-600 font-medium">
                {filteredDogs.length} of {dogs.length} dogs
              </span>
              
              <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as 'grid' | 'table')}>
                <ToggleGroupItem value="grid" aria-label="Grid view" className="data-[state=on]:bg-orange-100 data-[state=on]:text-orange-700">
                  <Grid className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="table" aria-label="Table view" className="data-[state=on]:bg-orange-100 data-[state=on]:text-orange-700">
                  <List className="h-4 w-4" />
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>
        </div>
      </section>

      {/* Dogs Section */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredDogs.map((dog) => (
                <DogCard
                  key={dog["Dog ID"]}
                  dog={dog}
                  isFavorite={false}
                  onToggleFavorite={() => {}}
                />
              ))}
            </div>
          ) : (
            <DogTable
              dogs={filteredDogs}
              favorites={[]}
              onToggleFavorite={() => {}}
            />
          )}

          {filteredDogs.length === 0 && (
            <div className="text-center py-16">
              <div className="text-8xl mb-6">🐕‍🦺</div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-4">No dogs found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your search criteria to find more furry friends!</p>
              <Button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedBreed('all');
                  setFosterStatus('all');
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
