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
    if (gender?.toLowerCase() === 'male') {
      return (
        <div className="flex items-center gap-1 text-blue-600">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.5 7.5V5h3v3h-2.5v2.5c0 2.76-2.24 5-5 5s-5-2.24-5-5 2.24-5 5-5c1.38 0 2.63.56 3.54 1.46L16 5.5h2.5V3H21v5h-5v-2.5h1.5l-1.46 1.46C15.44 6.37 14.38 6 13 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6V7.5h-3.5z"/>
          </svg>
          <span className="text-xs font-medium">Male</span>
        </div>
      );
    } else if (gender?.toLowerCase() === 'female') {
      return (
        <div className="flex items-center gap-1 text-pink-600">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2c3.31 0 6 2.69 6 6 0 2.97-2.16 5.43-5 5.91V16h2v2h-2v2h-2v-2H9v-2h2v-2.09c-2.84-.48-5-2.94-5-5.91 0-3.31 2.69-6 6-6zm0 2c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"/>
          </svg>
          <span className="text-xs font-medium">Female</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-1 text-gray-500">
        <span className="text-xs">Unknown</span>
      </div>
    );
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

      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold text-gray-900">{dog.Name}</span>
            {getGenderIcon(dog.Gender)}
            <Badge variant="outline" className="text-xs bg-gray-50">
              ID: {dog["Dog ID"]}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
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
