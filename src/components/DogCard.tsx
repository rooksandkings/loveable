import React, { useState } from 'react';
import { Heart, MapPin, Calendar, Weight, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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
}

interface DogCardProps {
  dog: Dog;
  isFavorite: boolean;
  onToggleFavorite: (dogId: number) => void;
}

const DogCard: React.FC<DogCardProps> = ({ dog, isFavorite, onToggleFavorite }) => {
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

  const getLocationDisplay = (dog: Dog) => {
    if (dog.Location_kennel === 'Foster Care') {
      return 'Foster Care';
    }
    return `${dog.Location_kennel || 'Unknown'} - ${dog.Location_room || 'Unknown'}`;
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
      return <span className="text-blue-500 text-lg">♂</span>;
    } else if (gender.toLowerCase() === 'female') {
      return <span className="text-pink-500 text-lg">♀</span>;
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

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200">
      <div className="relative h-64 bg-gradient-to-br from-orange-100 to-yellow-100 overflow-hidden rounded-t-lg">
        <img
          src={getImageUrl(availablePhotos[currentImageIndex] || dog["Photo_1"])}
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

        {/* Level badge in top right */}
        <div className="absolute top-2 right-2">
          <Badge variant="outline" className={`${getLevelColor(dog.Level)} backdrop-blur-sm shadow-sm`}>
            Level {dog.Level}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-semibold text-gray-800">{dog.Name}</h3>
            {getGenderIcon(dog.Gender)}
          </div>
          <Badge variant="outline" className="bg-white/80 text-gray-600 border-gray-300">
            ID: {dog["Dog ID"]}
          </Badge>
        </div>

        {/* Breed */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-1">Breed</p>
          <p className="text-sm text-gray-600">{getBreedDisplay(dog)}</p>
        </div>

        {/* Age, Weight, Days */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="h-4 w-4 text-orange-500" />
            <span>{getAgeDisplay(dog)}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Weight className="h-4 w-4 text-orange-500" />
            <span>{dog.Weight}lbs • {getSizeCategory(dog.Weight)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4 text-orange-500" />
          <span>{dog["Days_in_DCAS"]} days in shelter</span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="h-4 w-4 text-orange-500" />
          <span>{getLocationDisplay(dog)}</span>
        </div>

        {/* Status badges */}
        <div className="flex flex-wrap gap-2">
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

        {/* Adoption button */}
        {dog.Adopets_url && (
          <div className="mt-4 pt-3 border-t border-orange-100">
            <Button 
              asChild 
              className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-medium shadow-sm"
            >
              <a 
                href={dog.Adopets_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2"
              >
                <span>View Adoption Details</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DogCard;
