import React, { useState, useMemo } from 'react';
import { Heart, MapPin, Calendar, Weight, ChevronLeft, ChevronRight, ExternalLink, Dog, Clock, Ruler, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dog as DogType } from '@/types/Dog';
import { formatLocation, getImageUrl, getLevelColor, getGenderIcon } from '@/utils/dogUtils';

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
  "Adopets_url": string;
  "Days_in_Shelter": number;
  "Fixed": string;
  "Rabies_vax_date": string;
  "DFTD_eligibility": string;
}

interface DogCardProps {
  dog: Dog;
  isFavorite: boolean;
  onToggleFavorite: (dogId: number) => void;
}

const DogCard: React.FC<DogCardProps> = React.memo<DogCardProps>(({ dog, isFavorite, onToggleFavorite }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const getImageUrl = (photoUrl: string) => {
    if (!photoUrl || photoUrl.trim() === '' || photoUrl === 'N/A') {
      return 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop&crop=face';
    }
    
    // Clean up the URL (remove any trailing newlines or whitespace)
    const cleanUrl = photoUrl.trim();
    
    // Petango URLs should work directly
    if (cleanUrl.includes('petango.com')) {
      return cleanUrl;
    }
    
    // Handle Google Drive URLs (if any)
    if (cleanUrl.includes('drive.google.com')) {
      const fileId = cleanUrl.match(/\/d\/([a-zA-Z0-9-_]+)/)?.[1];
      return fileId ? `https://drive.google.com/uc?id=${fileId}` : 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop&crop=face';
    }
    
    return cleanUrl;
  };

  // Helper functions
  const getLevelColor = (level: number) => {
    switch (level) {
      case 1:
        return "bg-green-100 text-green-800 border-green-200";
      case 2:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case 3:
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getBreedDisplay = (dog: Dog) => {
    return dog["Breed AI"] || 'Mixed Breed';
  };

  const getAgeDisplay = (dog: Dog) => {
    return dog.Approx_Age || 'Unknown';
  };

  const getSizeCategory = (weight: number) => {
    if (weight <= 25) return 'Small';
    if (weight <= 60) return 'Medium';
    return 'Large';
  };

  const getSpayNeuterText = (status: string, gender: string) => {
    if (status === "Yes") {
      return gender?.toLowerCase() === 'female' ? 'Spayed' : 'Neutered';
    } else {
      return gender?.toLowerCase() === 'female' ? 'Not Spayed' : 'Not Neutered';
    }
  };

  const getSpayNeuterColor = (status: string) => {
    return status === "Yes" 
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-yellow-100 text-yellow-800 border-yellow-200";
  };

  const getHeartwormColor = (status: string) => {
    return status === "Neg" 
      ? "bg-green-50 text-green-700 border-green-200"
      : "bg-red-50 text-red-700 border-red-200";
  };

  const getGenderIcon = (gender: string) => {
    if (gender.toLowerCase() === 'male') {
      return { icon: '♂', className: 'text-blue-500 text-lg' };
    } else if (gender.toLowerCase() === 'female') {
      return { icon: '♀', className: 'text-pink-500 text-lg' };
    }
    return null;
  };

  // Get available photos
  const availablePhotos = [dog["Photo_1"], dog["Photo_2"], dog["Photo_3"]]
    .filter(photo => photo && photo.trim() !== '' && photo !== 'N/A');
  
  const hasMultiplePhotos = availablePhotos.length > 1;

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'yes': return 'bg-green-100 text-green-800';
      case 'no': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const nextImage = () => {
    if (hasMultiplePhotos) {
      setCurrentImageIndex((prev) => (prev + 1) % availablePhotos.length);
    }
  };

  const prevImage = () => {
    if (hasMultiplePhotos) {
      setCurrentImageIndex((prev) => (prev - 1 + availablePhotos.length) % availablePhotos.length);
    }
  };

  // Function to format sociability information
  const formatSociabilityInfo = () => {
    const status = dog["Sociability_status"];
    const playstyle = dog["Sociablity_playstyle"];
    const notes = dog["Sociability_notes"];

    // If we have status or playstyle, show those
    if (status || playstyle) {
      return (
        <div className="text-xs text-gray-600 mt-2 space-y-1">
          {status && (
            <div>
              <span className="font-medium">Sociability status:</span> {status}
            </div>
          )}
          {playstyle && (
            <div>
              <span className="font-medium">Sociability playstyle:</span> {playstyle}
            </div>
          )}
        </div>
      );
    }

    // Otherwise, show the notes but clean up the formatting
    if (notes) {
      const cleanedNotes = notes.replace(/^PLAYGROUP ASSESSMENT:\s*/i, '');
      return (
        <div className="text-xs text-gray-600 mt-2">
          <div className="font-medium mb-1">Sociability Assessment:</div>
          <div className="line-clamp-2">{cleanedNotes}</div>
        </div>
      );
    }

    return null;
  };

  // Optimize image handling - memoize the image URL calculation
  const imageUrl = useMemo(() => getImageUrl(availablePhotos[currentImageIndex] || dog["Photo_1"]), [availablePhotos, currentImageIndex, dog["Photo_1"]]);

  // Memoize expensive calculations
  const dftdEligible = useMemo(() => dog.DFTD_eligibility === "Yes", [dog.DFTD_eligibility]);
  const sizeCategory = useMemo(() => getSizeCategory(dog.Weight), [dog.Weight]);
  const breedDisplay = useMemo(() => getBreedDisplay(dog), [dog]);

  const genderInfo = getGenderIcon(dog.Gender);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200 flex flex-col h-full">
      <div className="relative h-64 bg-gradient-to-br from-orange-100 to-yellow-100 overflow-hidden rounded-t-lg">
        <img
          src={imageUrl}
          alt={dog.Name}
          className="w-full h-full object-contain"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop&crop=face';
          }}
        />

        {/* Navigation arrows */}
        {hasMultiplePhotos && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm p-1 rounded-full hover:bg-white transition-colors duration-200 shadow-sm"
            >
              <ChevronLeft className="h-4 w-4 text-gray-700" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm p-1 rounded-full hover:bg-white transition-colors duration-200 shadow-sm"
            >
              <ChevronRight className="h-4 w-4 text-gray-700" />
            </button>
          </>
        )}

        {/* Photo indicators */}
        {hasMultiplePhotos && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {availablePhotos.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                  index === currentImageIndex ? 'bg-white shadow-sm' : 'bg-white/60'
                }`}
              />
            ))}
          </div>
        )}

        {/* Level Badge */}
        {dog.Level && dog.Level > 0 && (
          <Badge 
            variant="outline" 
            className={`absolute top-2 right-2 text-xs font-medium ${getLevelColor(dog.Level)}`}
          >
            Level {dog.Level}
          </Badge>
        )}

        {/* Dog Name, Gender, and ID on same line */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-gray-900">{dog.Name}</h3>
            {genderInfo && (
              <span className={genderInfo.className}>
                {genderInfo.icon}
              </span>
            )}
          </div>
          <Badge variant="outline" className="text-xs bg-white/80 backdrop-blur-sm">
            ID: {dog["Dog ID"]}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4 flex flex-col flex-1">
        {/* Dog Name, Gender, and ID on same line */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-gray-900">{dog.Name}</h3>
            {genderInfo && (
              <span className={genderInfo.className}>
                {genderInfo.icon}
              </span>
            )}
          </div>
          <Badge variant="outline" className="text-xs bg-white/80 backdrop-blur-sm">
            ID: {dog["Dog ID"]}
          </Badge>
        </div>

        {/* Dog details */}
        <div className="space-y-2 mb-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Dog className="h-4 w-4" />
            <div className="relative group">
              <span className="font-medium cursor-help underline decoration-dotted">Breed:</span>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                AI-identified breed. DNA test may be required to verify.
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
              </div>
            </div>
            <span>{breedDisplay}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span className="font-medium">Age:</span>
            <span>{dog.Approx_Age}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Weight className="h-4 w-4" />
            <span className="font-medium">Weight:</span>
            <span>{dog.Weight} lbs</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>{dog.Days_in_DCAS} days in shelter</span>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
          <MapPin className="h-4 w-4" />
          <span className="font-medium">Location:</span>
          <span>{formatLocation(dog.Location_kennel, dog.Location_room)}</span>
        </div>

        {/* DFTD and Size badges */}
        <div className="flex flex-wrap gap-2 mb-3">
          {dftdEligible && (
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 font-medium">
              <Star className="h-3 w-3 mr-1" />
              DFTD Eligible
            </Badge>
          )}
          <Badge className="bg-blue-100 text-blue-800 border-blue-200 flex items-center gap-1">
            <Ruler className="h-3 w-3" />
            {sizeCategory}
          </Badge>
        </div>

        {/* Status badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="outline" className={getSpayNeuterColor(dog["Spay_Neuter_status"])}>
            {getSpayNeuterText(dog["Spay_Neuter_status"], dog.Gender)}
          </Badge>
          
          {dog["Sociability_status"] && (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              {dog["Sociability_status"]}
            </Badge>
          )}
          
          {dog["Sociablity_playstyle"] && (
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
              {dog["Sociablity_playstyle"]}
            </Badge>
          )}
        </div>

        {/* Spacer to push button to bottom */}
        <div className="flex-1"></div>

        {/* Adoption Details Button */}
        <Button 
          className="w-full bg-orange-500 hover:bg-orange-600 text-white"
          onClick={() => {
            if (dog.Adopets_url && dog.Adopets_url !== "Dog Not Found") {
              window.open(dog.Adopets_url, '_blank');
            }
          }}
          disabled={!dog.Adopets_url || dog.Adopets_url === "Dog Not Found"}
        >
          {!dog.Adopets_url || dog.Adopets_url === "Dog Not Found" 
            ? "Currently Unavailable" 
            : "View Adoption Details"
          }
        </Button>
      </CardContent>
    </Card>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.dog["Dog ID"] === nextProps.dog["Dog ID"] &&
    prevProps.isFavorite === nextProps.isFavorite
  );
});

export default DogCard;
