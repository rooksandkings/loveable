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
                          <div className="text-xs text-gray-500 mt-1">
                            {(() => {
                              const isFoster = 
                                (item.location_kennel && item.location_kennel.toLowerCase().includes('foster')) ||
                                (item.location_room && item.location_room.toLowerCase().includes('foster'));
                              
                              if (isFoster) {
                                return 'In Foster';
                              } else if (item.shelter_location === 'DCAS') {
                                return 'Dekalb';
                              } else if (item.shelter_location === 'FCAS') {
                                return 'Fulton';
                              } else if (item.shelter_location === 'CAC') {
                                return 'CAC';
                              } else {
                                return item.shelter_location || 'Unknown';
                              }
                            })()}
                          </div>
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

        {/* Generate Posts Button */}
        <div className="mt-6 flex justify-center">
          <Button 
            size="lg"
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg font-semibold"
            onClick={() => {
              // Get selected items
              const selectedDogs = filteredAndSortedData.filter(item => 
                selectedItems.has(item.animal_id)
              );
              
              if (selectedDogs.length === 0) {
                alert('Please select at least one dog to generate posts.');
                return;
              }
              
              // Group dogs by location
              const groupedDogs = selectedDogs.reduce((groups, dog) => {
                const isFoster = 
                  (dog.location_kennel && dog.location_kennel.toLowerCase().includes('foster')) ||
                  (dog.location_room && dog.location_room.toLowerCase().includes('foster'));
                
                let location = 'Other';
                if (isFoster) {
                  location = 'In Foster';
                } else if (dog.shelter_location === 'DCAS') {
                  location = 'Dekalb - In Shelter';
                } else if (dog.shelter_location === 'FCAS') {
                  location = 'Fulton - In Shelter';
                } else if (dog.shelter_location === 'CAC') {
                  location = 'Community Animal Center';
                }
                
                if (!groups[location]) {
                  groups[location] = [];
                }
                groups[location].push(dog);
                return groups;
              }, {} as Record<string, typeof selectedDogs>);
              
              // Create plain text content
              let textContent = '';
              
              // Add the selected breed at the top
              if (selectedBreed !== 'all') {
                textContent += '<b>Resembles ' + selectedBreed + '</b>\n\n';
              }
              
              // Define the order we want to display locations
              const locationOrder = ['Fulton - In Shelter', 'Dekalb - In Shelter', 'Community Animal Center', 'In Foster', 'Other'];
              
              locationOrder.forEach(location => {
                if (groupedDogs[location] && groupedDogs[location].length > 0) {
                  // Add location address at the top
                  if (location === 'Dekalb - In Shelter') {
                    textContent += '<b>🌾 Dekalb - In Shelter: <i>3280 Chamblee Dunwoody Rd, Chamblee, GA 30341</i></b>\n\n';
                  } else if (location === 'Community Animal Center') {
                    textContent += '<b>🐶 Community Animal Center: <i>3180 Presidential Dr, Atlanta, GA 30340</i></b>\n\n';
                  } else if (location === 'Fulton - In Shelter') {
                    textContent += '<b>🏛️ Fulton - In Shelter: <i>1251 Fulton Industrial Blvd NW, Atlanta, GA 30336</i></b>\n\n';
                  } else if (location === 'In Foster') {
                    textContent += '🏡 Available now in foster. Apply at the link — if you don\'t hear back within a day, follow up here: facebook.com/groups/adoptablepetsoflifeline 🐾\n\n';
                  }
                  
                  groupedDogs[location].forEach(dog => {
                    const description = extractDescriptionText(dog.chuya_breed_ai || '');
                    const dogName = cleanName(dog.name || '');
                    
                    // Make the name bold by finding it in the description
                    let formattedDescription = description;
                    if (description.includes(dogName + ' -')) {
                      formattedDescription = description.replace(dogName + ' -', '<b>' + dogName + '</b> -');
                    } else if (description.startsWith(dogName)) {
                      // If name is at the start but without the dash
                      formattedDescription = '<b>' + dogName + '</b>' + description.substring(dogName.length);
                    }
                    
                    textContent += formattedDescription + '\n\n';
                    if (dog.adopets_url) {
                      textContent += dog.adopets_url + '\n\n';
                    }
                  });
                }
              });
              
              // Add disclaimer at the end
              textContent += '🎭 Resemblance ≠ reality. We don\'t DNA test — so your "Husky mix" might just be a dramatic mutt with eyeliner. 🧬';
              
              // Create content for the new window
              const windowContent = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Breed Resemblance Posts - ${selectedDogs.length} Dogs</title>
                    <style>
                        body {
                            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                            line-height: 1.6;
                            margin: 0;
                            padding: 20px;
                            background: linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%);
                            min-height: 100vh;
                        }
                        .container {
                            max-width: 600px;
                            margin: 0 auto;
                            background: white;
                            border-radius: 12px;
                            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                            overflow: hidden;
                        }
                        .header {
                            background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
                            color: white;
                            padding: 20px;
                            text-align: center;
                        }
                        .header h1 {
                            margin: 0;
                            font-size: 24px;
                            font-weight: bold;
                        }
                        .header p {
                            margin: 10px 0 0 0;
                            opacity: 0.9;
                        }
                        .content {
                            padding: 20px;
                        }
                        .text-box {
                            background: #f9fafb;
                            border: 2px solid #e5e7eb;
                            border-radius: 8px;
                            padding: 20px;
                            font-family: 'Courier New', monospace;
                            font-size: 14px;
                            line-height: 1.6;
                            white-space: pre-wrap;
                            color: #374151;
                            min-height: 400px;
                            overflow-y: auto;
                        }
                        .copy-button {
                            background: #f97316;
                            color: white;
                            border: none;
                            padding: 12px 24px;
                            border-radius: 6px;
                            cursor: pointer;
                            font-weight: 500;
                            margin-top: 15px;
                            width: 100%;
                        }
                        .copy-button:hover {
                            background: #ea580c;
                        }
                        .footer {
                            text-align: center;
                            padding: 20px;
                            color: #6b7280;
                            font-size: 14px;
                            border-top: 1px solid #e5e7eb;
                        }
                        .print-button {
                            position: fixed;
                            top: 20px;
                            right: 20px;
                            background: #f97316;
                            color: white;
                            border: none;
                            padding: 10px 16px;
                            border-radius: 6px;
                            cursor: pointer;
                            font-weight: 500;
                        }
                        .print-button:hover {
                            background: #ea580c;
                        }
                        @media print {
                            .print-button, .copy-button {
                                display: none;
                            }
                            body {
                                background: white;
                            }
                            .container {
                                box-shadow: none;
                            }
                        }
                    </style>
                </head>
                <body>
                    <button class="print-button" onclick="window.print()">🖨️ Print</button>
                    <div class="container">
                        <div class="header">
                            <h1>Breed Resemblance Posts</h1>
                            <p>${selectedDogs.length} selected dog${selectedDogs.length !== 1 ? 's' : ''} ready for social media</p>
                        </div>
                        <div class="content">
                            <div class="text-box" id="copyText">${textContent}</div>
                            <button class="copy-button" onclick="copyToClipboard()">📋 Copy to Clipboard</button>
                        </div>
                        <div class="footer">
                            <p>Generated by Paw Poster • To be seen is to be saved</p>
                        </div>
                    </div>
                    
                    <script>
                        function copyToClipboard() {
                            const textBox = document.getElementById('copyText');
                            const text = textBox.textContent || textBox.innerText;
                            
                            navigator.clipboard.writeText(text).then(function() {
                                const button = document.querySelector('.copy-button');
                                button.textContent = '✅ Copied!';
                                button.style.background = '#10b981';
                                
                                setTimeout(function() {
                                    button.textContent = '📋 Copy to Clipboard';
                                    button.style.background = '#f97316';
                                }, 2000);
                            }).catch(function(err) {
                                console.error('Could not copy text: ', err);
                                alert('Copy failed. Please manually select and copy the text.');
                            });
                        }
                    </script>
                </body>
                </html>
              `;
              
              // Open new window with the content
              const newWindow = window.open('', '_blank', 'width=700,height=800,scrollbars=yes,resizable=yes');
              if (newWindow) {
                newWindow.document.write(windowContent);
                newWindow.document.close();
              } else {
                alert('Please allow pop-ups to view the breed resemblance posts.');
              }
            }}
          >
            Generate Breed Resemblance Posts
          </Button>
        </div>

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