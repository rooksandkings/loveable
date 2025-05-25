
import React, { useState } from 'react';
import { Heart, MapPin, Calendar, Weight } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
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
}

interface DogCardProps {
  dog: Dog;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

const DogCard: React.FC<DogCardProps> = ({ dog, isFavorite, onToggleFavorite }) => {
  const [imageError, setImageError] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const getBreedDisplay = () => {
    const breeds = [dog["Breed_AI_1"], dog["Breed_AI_2"], dog["Breed_AI_3"]]
      .filter(Boolean)
      .slice(0, 2); // Show max 2 breeds to avoid clutter
    return breeds.join(", ") || dog["Breed AI"];
  };

  const getLevelBadgeColor = (level: number) => {
    switch (level) {
      case 1: return "bg-green-100 text-green-800 border-green-200";
      case 2: return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case 3: return "bg-orange-100 text-orange-800 border-orange-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getLocationDisplay = () => {
    if (dog["Foster_status"] === "Yes") {
      return "Foster Care";
    }
    return dog["Location_kennel"] || "At Shelter";
  };

  // Get available photos
  const getAvailablePhotos = () => {
    const photos = [dog["Photo_1"], dog["Photo_2"], dog["Photo_3"]]
      .filter(photo => photo && photo.trim() && !photo.includes('[Photo') && photo !== 'N/A');
    return photos;
  };

  const availablePhotos = getAvailablePhotos();
  const hasPhotos = availablePhotos.length > 0;
  const currentPhoto = hasPhotos ? availablePhotos[currentImageIndex] : null;

  const nextImage = () => {
    if (availablePhotos.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % availablePhotos.length);
    }
  };

  const prevImage = () => {
    if (availablePhotos.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + availablePhotos.length) % availablePhotos.length);
    }
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 bg-white border-orange-100 hover:border-orange-300 overflow-hidden">
      <CardHeader className="p-0">
        <div className="relative">
          {/* Dog photo or placeholder */}
          <div className="h-64 bg-gradient-to-br from-orange-200 to-amber-200 flex items-center justify-center relative overflow-hidden">
            {hasPhotos && !imageError ? (
              <>
                <img
                  src={currentPhoto}
                  alt={`${dog.Name} - Photo ${currentImageIndex + 1}`}
                  className="w-full h-full object-contain bg-white"
                  onError={() => setImageError(true)}
                />
                {/* Image navigation buttons */}
                {availablePhotos.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/70 transition-colors"
                    >
                      ‹
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/70 transition-colors"
                    >
                      ›
                    </button>
                    {/* Photo indicator dots */}
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                      {availablePhotos.map((_, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full ${
                            index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="text-6xl">🐕</div>
            )}
          </div>
          
          {/* Favorite button */}
          <Button
            variant="ghost"
            size="sm"
            className={`absolute top-2 right-2 p-2 rounded-full ${
              isFavorite 
                ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                : 'bg-white/80 text-gray-600 hover:bg-white'
            }`}
            onClick={onToggleFavorite}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
          </Button>

          {/* Level badge */}
          <Badge className={`absolute top-2 left-2 ${getLevelBadgeColor(dog.Level)}`}>
            Level {dog.Level}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-3">
        {/* Name and basic info */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">{dog.Name}</h3>
          <p className="text-sm text-gray-600 font-medium">{getBreedDisplay()}</p>
        </div>

        {/* Key details */}
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2 text-orange-500" />
            <span>{dog["Approx_Age"]} • {dog.Gender}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <Weight className="h-4 w-4 mr-2 text-orange-500" />
            <span>{dog.Weight} lbs</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-2 text-orange-500" />
            <span>{getLocationDisplay()}</span>
          </div>
        </div>

        {/* Color info */}
        <div className="flex gap-2">
          <Badge variant="outline" className="text-xs bg-gray-50">
            {dog["Color_pimary"]}
            {dog["Color_seconday"] && ` & ${dog["Color_seconday"]}`}
          </Badge>
        </div>

        {/* Additional badges */}
        <div className="flex flex-wrap gap-2">
          {dog["Spay_Neuter_status"] === "Yes" && (
            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
              Spayed/Neutered
            </Badge>
          )}
          {dog["Foster_status"] === "Yes" && (
            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
              In Foster
            </Badge>
          )}
          {dog["Heartworm_Status"] === "Neg" && (
            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
              HW Negative
            </Badge>
          )}
        </div>

        {/* Days in shelter */}
        <div className="pt-2 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            {dog["Days_in_DCAS"]} days in care
          </p>
        </div>

        {/* Sociability info */}
        {dog["Sociability_status"] && (
          <div className="pt-2">
            <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
              {dog["Sociability_status"]} • {dog["Sociablity_playstyle"]}
            </Badge>
          </div>
        )}

        {/* Contact button */}
        <Button 
          className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white"
          onClick={() => {
            // In a real app, this would open a contact form or redirect to adoption page
            alert(`Interested in ${dog.Name}? Contact the shelter for more information!`);
          }}
        >
          Learn More About {dog.Name}
        </Button>
      </CardContent>
    </Card>
  );
};

export default DogCard;
