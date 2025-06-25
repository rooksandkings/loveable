import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArrowUpDown, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getAllShortDescriptions } from '@/lib/neon-api';

interface ShortDescription {
  animal_id: string;
  chuya_breed_ai: string;
  name: string;
  breed_ai: string;
  adopets_url: string;
  asana_permalink_url: string;
  location_kennel: string;
  location_room: string;
  shelter_location: string;
}

const Shorts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBreed, setSelectedBreed] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'animal_id' | 'breed_ai'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Function to extract unique breeds from a breed string
  const extractUniqueBreeds = (breedString: string): string[] => {
    if (!breedString) return [];
    
    // Split by comma and clean up each breed
    const breeds = breedString
      .split(',')
      .map(breed => breed.trim())
      .filter(breed => breed.length > 0)
      .map(breed => breed.replace(/\s+/g, ' ').trim()); // Normalize whitespace
    
    // Consolidate breeds (similar to main page logic)
    const consolidatedBreeds = breeds.map(breed => {
      const breedLower = breed.toLowerCase();
      
      // Pit Bull variations
      if (breedLower.includes('pit bull') || breedLower.includes('pitbull') || 
          breedLower.includes('american pit bull') || breedLower.includes('staffordshire')) {
        return 'Pit Bull / Staffordshire';
      }
      
      // Boxer variations
      if (breedLower.includes('boxer')) {
        return 'Boxer';
      }
      
      // Labrador variations
      if (breedLower.includes('labrador') || breedLower.includes('lab mix')) {
        return 'Labrador Retriever';
      }
      
      // German Shepherd variations
      if (breedLower.includes('german shepherd')) {
        return 'German Shepherd';
      }
      
      // Husky variations
      if (breedLower.includes('husky') || breedLower.includes('alaskan malamute')) {
        return 'Husky / Northern Breed';
      }
      
      // Bulldog variations
      if (breedLower.includes('bulldog') || breedLower.includes('american bulldog') || 
          breedLower.includes('french bulldog') || breedLower.includes('english bulldog')) {
        return 'Bulldog';
      }
      
      // Belgian Malinois variations
      if (breedLower.includes('belgian malinois') || breedLower.includes('belgian shepherd')) {
        return 'Belgian Malinois';
      }
      
      // Rottweiler variations
      if (breedLower.includes('rottweiler')) {
        return 'Rottweiler';
      }
      
      // Cane Corso variations
      if (breedLower.includes('cane corso')) {
        return 'Cane Corso';
      }
      
      // Border Collie variations
      if (breedLower.includes('border collie')) {
        return 'Border Collie';
      }
      
      // Chihuahua variations
      if (breedLower.includes('chihuahua')) {
        return 'Chihuahua';
      }
      
      // Great Dane variations
      if (breedLower.includes('great dane')) {
        return 'Great Dane';
      }
      
      // Terrier variations (excluding pit bull terrier which is handled above)
      if (breedLower.includes('terrier') && !breedLower.includes('pit bull') && !breedLower.includes('staffordshire')) {
        return 'Terrier';
      }
      
      // Retriever variations (excluding Labrador which is handled above)
      if (breedLower.includes('retriever') && !breedLower.includes('labrador')) {
        return 'Retriever';
      }
      
      // Shepherd variations (excluding German Shepherd which is handled above)
      if (breedLower.includes('shepherd') && !breedLower.includes('german')) {
        return 'Shepherd';
      }
      
      // Mixed Breed variations
      if (breedLower.includes('mixed breed') || breedLower.includes('mix')) {
        return 'Mixed Breed';
      }
      
      // Akita variations
      if (breedLower.includes('akita')) {
        return 'Akita';
      }
      
      // If no consolidation matches, return the original breed
      return breed;
    });
    
    // Remove duplicates while preserving order
    const uniqueBreeds = [...new Set(consolidatedBreeds)];
    return uniqueBreeds;
  };

  const { data: shortDescriptions = [], isLoading, error } = useQuery({
    queryKey: ['shortDescriptions'],
    queryFn: getAllShortDescriptions,
    staleTime: 1000 * 60 * 60 * 12, // 12 hours
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Get unique breeds for filter
  const uniqueBreeds = useMemo(() => {
    const allBreeds: string[] = [];
    
    shortDescriptions.forEach(item => {
      if (item.breed_ai) {
        const breeds = extractUniqueBreeds(item.breed_ai);
        allBreeds.push(...breeds);
      }
    });
    
    // Remove duplicates and sort
    const finalBreeds = [...new Set(allBreeds)].sort();
    console.log('Available breeds in Shorts page:', finalBreeds);
    return finalBreeds;
  }, [shortDescriptions]);

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let filtered = shortDescriptions.filter(item => {
      const matchesSearch = searchTerm === '' || 
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.animal_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.breed_ai?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.chuya_breed_ai?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesBreed = selectedBreed === 'all' || 
        extractUniqueBreeds(item.breed_ai).includes(selectedBreed);
      
      // Location filtering logic
      const isFoster =
        (item.location_kennel && item.location_kennel.toLowerCase().includes('foster')) ||
        (item.location_room && item.location_room.toLowerCase().includes('foster'));
      
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
          matchesLocation = item.shelter_location === 'DCAS' && !isFoster;
          break;
        case 'DCAS_in_foster':
          matchesLocation = isFoster && item.shelter_location === 'DCAS';
          break;
        case 'FCAS_in_shelter':
          matchesLocation = item.shelter_location === 'FCAS' && !isFoster;
          break;
        case 'FCAS_in_foster':
          matchesLocation = isFoster && item.shelter_location === 'FCAS';
          break;
        case 'CAC_in_shelter':
          matchesLocation = item.shelter_location === 'CAC' && !isFoster;
          break;
        case 'CAC_in_foster':
          matchesLocation = isFoster && item.shelter_location === 'CAC';
          break;
        default:
          matchesLocation = true;
      }
      
      return matchesSearch && matchesBreed && matchesLocation;
    });

    // Sort data
    filtered.sort((a, b) => {
      let aValue = '';
      let bValue = '';

      switch (sortBy) {
        case 'name':
          aValue = a.name || '';
          bValue = b.name || '';
          break;
        case 'animal_id':
          aValue = a.animal_id || '';
          bValue = b.animal_id || '';
          break;
        case 'breed_ai':
          aValue = a.breed_ai || '';
          bValue = b.breed_ai || '';
          break;
        default:
          aValue = a.name || '';
          bValue = b.name || '';
      }

      const comparison = aValue.localeCompare(bValue);
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [shortDescriptions, searchTerm, selectedBreed, sortBy, sortOrder, locationFilter]);

  const handleSort = (field: 'name' | 'animal_id' | 'breed_ai') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="text-lg text-gray-600">Loading short descriptions...</div>
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
          <p className="text-gray-500 mb-4">We couldn't fetch the short descriptions right now</p>
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Short Descriptions</h1>
          <p className="text-gray-600">AI-generated short descriptions for rescue dogs</p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by name, ID, or resemblance..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select value={selectedBreed} onValueChange={setSelectedBreed}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Resembles All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Resembles All</SelectItem>
                  {uniqueBreeds.map(breed => (
                    <SelectItem key={breed} value={breed}>{breed}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-64">
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
            </div>
          </CardContent>
        </Card>

        {/* Results count */}
        <div className="mb-4">
          <span className="text-gray-600 font-medium">
            {filteredAndSortedData.length} of {shortDescriptions.length} descriptions
          </span>
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full table-fixed">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                      <button
                        onClick={() => handleSort('name')}
                        className="flex items-center gap-1 hover:text-gray-700"
                      >
                        Name
                        <ArrowUpDown className="h-4 w-4" />
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                      <button
                        onClick={() => handleSort('animal_id')}
                        className="flex items-center gap-1 hover:text-gray-700"
                      >
                        Animal ID
                        <ArrowUpDown className="h-4 w-4" />
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                      <button
                        onClick={() => handleSort('breed_ai')}
                        className="flex items-center gap-1 hover:text-gray-700"
                      >
                        Breed AI
                        <ArrowUpDown className="h-4 w-4" />
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-l-2 border-gray-300">
                      Short Description
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24 border-l border-gray-200">
                      Links
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAndSortedData.map((item, index) => (
                    <tr key={item.animal_id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-4 text-sm font-medium text-gray-900 truncate bg-gray-50">
                        {item.name || 'N/A'}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500 truncate bg-gray-50">
                        {item.animal_id}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500 truncate bg-gray-50">
                        {item.breed_ai || 'N/A'}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 border-l-2 border-gray-300">
                        <div className="whitespace-pre-wrap break-words leading-relaxed">
                          {item.chuya_breed_ai || 'No description available'}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500 border-l border-gray-200">
                        <div className="flex flex-col gap-1">
                          {item.adopets_url && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(item.adopets_url, '_blank')}
                              className="flex items-center gap-1 text-xs"
                            >
                              <ExternalLink className="h-3 w-3" />
                              Adopets
                            </Button>
                          )}
                          {item.asana_permalink_url && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(item.asana_permalink_url, '_blank')}
                              className="flex items-center gap-1 text-xs"
                            >
                              <ExternalLink className="h-3 w-3" />
                              Asana
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {filteredAndSortedData.length === 0 && (
          <div className="text-center py-16">
            <div className="text-8xl mb-6">📝</div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-4">No descriptions found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search criteria to find more descriptions!</p>
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
    </div>
  );
};

export default Shorts; 