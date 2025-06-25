import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArrowUpDown, ExternalLink, Dog, ChevronLeft, ChevronRight } from 'lucide-react';
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
  mini_pic_1?: string;
  mini_pic_2?: string;
  mini_pic_3?: string;
}

const Shorts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBreed, setSelectedBreed] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [splitByShelter, setSplitByShelter] = useState(false);
  const [splitByFosterStatus, setSplitByFosterStatus] = useState(false);
  const [currentImageIndices, setCurrentImageIndices] = useState<{ [key: string]: number }>({});
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

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

  // Function to extract just the description text (before the Adopets link)
  const extractDescriptionText = (fullText: string): string => {
    if (!fullText) return '';
    
    // Find the Adopets link and extract everything before it
    const adopetsLinkIndex = fullText.indexOf('https://adopt.adopets.com/');
    if (adopetsLinkIndex !== -1) {
      return fullText.substring(0, adopetsLinkIndex).trim();
    }
    
    // If no Adopets link found, return the full text
    return fullText.trim();
  };

  // Function to clean the name by removing foster-related text
  const cleanName = (name: string): string => {
    if (!name) return '';
    
    // Remove common foster-related suffixes
    return name
      .replace(/\s*-\s*in\s+foster\s*$/i, '')
      .replace(/\s*-\s*foster\s*$/i, '')
      .replace(/\s*\(foster\)\s*$/i, '')
      .replace(/\s*\[foster\]\s*$/i, '')
      .trim();
  };

  // Function to get image URL (similar to main page logic)
  const getImageUrl = (photoUrl: string): string | null => {
    if (!photoUrl || photoUrl.trim() === '' || photoUrl === 'N/A') {
      return null;
    }
    
    const cleanUrl = photoUrl.trim();
    
    if (cleanUrl.includes('petango.com')) {
      return cleanUrl;
    }
    
    if (cleanUrl.includes('drive.google.com')) {
      const fileId = cleanUrl.match(/\/d\/([a-zA-Z0-9-_]+)/)?.[1];
      return fileId ? `https://drive.google.com/uc?id=${fileId}` : null;
    }
    
    return cleanUrl;
  };

  // Function to get available photos for a dog
  const getAvailablePhotos = (item: ShortDescription): string[] => {
    const photos = [];
    if (item.mini_pic_1) photos.push(item.mini_pic_1);
    if (item.mini_pic_2) photos.push(item.mini_pic_2);
    if (item.mini_pic_3) photos.push(item.mini_pic_3);
    return photos;
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

    return filtered;
  }, [shortDescriptions, searchTerm, selectedBreed, locationFilter]);

  // Function to handle image navigation
  const nextImage = (animalId: string, totalPhotos: number) => {
    setCurrentImageIndices(prev => ({
      ...prev,
      [animalId]: (prev[animalId] || 0 + 1) % totalPhotos
    }));
  };

  const prevImage = (animalId: string, totalPhotos: number) => {
    setCurrentImageIndices(prev => ({
      ...prev,
      [animalId]: (prev[animalId] || 0 - 1 + totalPhotos) % totalPhotos
    }));
  };

  const setCurrentImageIndex = (animalId: string, index: number) => {
    setCurrentImageIndices(prev => ({
      ...prev,
      [animalId]: index
    }));
  };

  // Function to handle checkbox selection
  const toggleSelection = (animalId: string) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(animalId)) {
        newSet.delete(animalId);
      } else {
        newSet.add(animalId);
      }
      return newSet;
    });
  };

  // Function to select all visible items
  const selectAll = () => {
    const allIds = filteredAndSortedData.map(item => item.animal_id);
    setSelectedItems(new Set(allIds));
  };

  // Function to clear all selections
  const clearAll = () => {
    setSelectedItems(new Set());
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Breed Resemblance Post Generator</h1>
          <p className="text-gray-600">Generate social media posts highlighting AI-identified breed resemblances for rescue dogs</p>
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
        <div className="mb-4 flex items-center justify-between">
          <span className="text-gray-600 font-medium">
            {filteredAndSortedData.length} of {shortDescriptions.length} descriptions
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={selectAll}
              className="text-xs"
            >
              Select All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={clearAll}
              className="text-xs"
            >
              Clear All
            </Button>
          </div>
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full table-fixed">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                      Name
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                      Pictures
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-l-2 border-gray-300">
                      Short Description
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-32 border-l border-gray-200">
                      Links
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24 border-l border-gray-200">
                      Add to Post
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAndSortedData.map((item, index) => (
                    <tr key={item.animal_id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-4 text-sm font-medium text-gray-900 truncate bg-gray-50">
                        <div>
                          <div className="font-medium">{cleanName(item.name || '')}</div>
                          {item.shelter_location && (
                            <div className="text-xs text-gray-500 mt-1">
                              {item.shelter_location === 'DCAS' && 'Dekalb'}
                              {item.shelter_location === 'FCAS' && 'Fulton'}
                              {item.shelter_location === 'CAC' && 'CAC'}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        <div className="relative h-16 w-20">
                          {(() => {
                            const availablePhotos = getAvailablePhotos(item);
                            const currentIndex = currentImageIndices[item.animal_id] || 0;
                            const currentPhoto = availablePhotos[currentIndex];
                            const imageUrl = currentPhoto ? getImageUrl(currentPhoto) : null;
                            const hasMultiplePhotos = availablePhotos.length > 1;

                            if (imageUrl) {
                              return (
                                <>
                                  <img
                                    src={imageUrl}
                                    alt={`${cleanName(item.name || '')} - Photo ${currentIndex + 1}`}
                                    className="h-16 w-16 object-cover rounded border border-gray-200 mx-auto"
                                    loading="lazy"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                    }}
                                  />
                                  
                                  {hasMultiplePhotos && (
                                    <>
                                      <button
                                        onClick={() => prevImage(item.animal_id, availablePhotos.length)}
                                        className="absolute -left-6 top-1/2 transform -translate-y-1/2 bg-gray-800/90 backdrop-blur-sm p-1 rounded-full hover:bg-gray-700 transition-colors duration-200 shadow-sm"
                                      >
                                        <ChevronLeft className="h-3 w-3 text-white" />
                                      </button>
                                      <button
                                        onClick={() => nextImage(item.animal_id, availablePhotos.length)}
                                        className="absolute -right-6 top-1/2 transform -translate-y-1/2 bg-gray-800/90 backdrop-blur-sm p-1 rounded-full hover:bg-gray-700 transition-colors duration-200 shadow-sm"
                                      >
                                        <ChevronRight className="h-3 w-3 text-white" />
                                      </button>
                                      
                                      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-1">
                                        {availablePhotos.map((_, index) => (
                                          <button
                                            key={index}
                                            onClick={() => setCurrentImageIndex(item.animal_id, index)}
                                            className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${
                                              index === currentIndex ? 'bg-white shadow-sm' : 'bg-white/60'
                                            }`}
                                          />
                                        ))}
                                      </div>
                                    </>
                                  )}
                                </>
                              );
                            } else {
                              return (
                                <div className="h-16 w-16 bg-gray-100 rounded border border-gray-200 flex items-center justify-center mx-auto">
                                  <Dog className="h-6 w-6 text-gray-400" />
                                </div>
                              );
                            }
                          })()}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 border-l-2 border-gray-300">
                        <div className="whitespace-pre-wrap break-words leading-relaxed">
                          {extractDescriptionText(item.chuya_breed_ai || '')}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500 border-l border-gray-200">
                        <div className="flex flex-col gap-2">
                          {item.adopets_url && (
                            <Button
                              size="sm"
                              onClick={() => window.open(item.adopets_url, '_blank')}
                              className="w-full bg-orange-500 hover:bg-orange-600 text-white border-0 font-medium text-xs py-2 px-3 transition-colors duration-200"
                            >
                              Adopets
                            </Button>
                          )}
                          {item.asana_permalink_url && (
                            <Button
                              size="sm"
                              onClick={() => window.open(item.asana_permalink_url, '_blank')}
                              className="w-full bg-blue-500 hover:bg-blue-600 text-white border-0 font-medium text-xs py-2 px-3 transition-colors duration-200"
                            >
                              Asana
                            </Button>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500 border-l border-gray-200">
                        <div className="flex justify-center">
                          <input
                            type="checkbox"
                            checked={selectedItems.has(item.animal_id)}
                            onChange={() => toggleSelection(item.animal_id)}
                            className="h-4 w-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Create Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Create Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="splitByShelter"
                    checked={splitByShelter}
                    onChange={(e) => setSplitByShelter(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="splitByShelter" className="text-sm font-medium text-gray-700">
                    Split by shelter?
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="splitByFosterStatus"
                    checked={splitByFosterStatus}
                    onChange={(e) => setSplitByFosterStatus(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="splitByFosterStatus" className="text-sm font-medium text-gray-700">
                    Foster status?
                  </label>
                </div>
              </div>
              <Button 
                className="bg-orange-500 hover:bg-orange-600 text-white"
                onClick={() => {
                  console.log('Create button clicked with options:', {
                    splitByShelter,
                    splitByFosterStatus,
                    filteredCount: filteredAndSortedData.length
                  });
                }}
              >
                Create
              </Button>
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