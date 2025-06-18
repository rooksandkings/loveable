import React from 'react';
import { Heart, MapPin, Calendar, Weight, ChevronLeft, ChevronRight, ExternalLink, Dog, Clock, Ruler, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dog as DogType } from '@/types/Dog';
import { formatLocation } from '@/utils/dogUtils';
import { useDogCard } from '@/hooks/useDogCard';
import N8nChatEmbed from "@/components/N8nChatEmbed";

interface DogCardProps {
  dog: DogType;
  isFavorite: boolean;
  onToggleFavorite: (dogId: number) => void;
}

const DogCard: React.FC<DogCardProps> = React.memo<DogCardProps>(({ dog, isFavorite, onToggleFavorite }) => {
  const {
    currentImageIndex,
    imageError,
    currentImageUrl,
    handleImageError,
    nextImage,
    prevImage,
    setCurrentImageIndex,
    dftdEligible,
    sizeCategory,
    breedDisplay,
    hasMultiplePhotos,
    genderInfo,
    isEssentialOnly
  } = useDogCard(dog);

  // Helper functions
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

  const getLevelColor = (level: number) => {
    switch (level) {
      case 1: return "bg-green-100 text-green-800 border-green-200";
      case 2: return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case 3: return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200 flex flex-col h-full">
      <div className="relative h-64 bg-gradient-to-br from-orange-100 to-yellow-100 overflow-hidden rounded-t-lg">
        {currentImageUrl && !imageError ? (
          <img
            src={currentImageUrl}
            alt={dog.Name}
            className="w-full h-full object-contain"
            loading="lazy"
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
            <Dog className="h-16 w-16 mb-2" />
            <span className="text-sm font-medium">Photo Coming Soon</span>
            <span className="text-xs">We're working on getting {dog.Name}'s photo!</span>
          </div>
        )}

        {imageError && (
          <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gradient-to-br from-orange-100 to-yellow-100">
            <Dog className="h-16 w-16 mb-2" />
            <span className="text-sm font-medium">Image Not Available</span>
            <span className="text-xs text-center px-4">We're working on updating {dog.Name}'s photo!</span>
          </div>
        )}

        {hasMultiplePhotos && currentImageUrl && !imageError && (
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

        {hasMultiplePhotos && currentImageUrl && !imageError && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {Array.from({ length: 3 }).map((_, index) => (
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

        {dog.Level && dog.Level > 0 && (
          <Badge 
            variant="outline" 
            className={`absolute top-2 right-2 text-xs font-medium ${getLevelColor(dog.Level)}`}
          >
            Level {dog.Level}
          </Badge>
        )}

        <button
          onClick={() => onToggleFavorite(dog["Dog ID"])}
          className="absolute top-2 left-2 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors duration-200 shadow-sm"
        >
          <Heart
            className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
          />
        </button>
      </div>

      <CardContent className="p-4 flex-1 flex flex-col">
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

        {isEssentialOnly ? (
          <div className="space-y-2 mb-3">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
          </div>
        ) : (
          <div className="space-y-2 mb-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Dog className="h-4 w-4" />
              <span className="font-medium">Breed:</span>
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
              <span>{dog["Days_in_DCAS"]} days in shelter</span>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
          <MapPin className="h-4 w-4" />
          <span className="font-medium">Location:</span>
          <span>{formatLocation(dog.Location_kennel, dog.Location_room)}</span>
        </div>

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

        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="outline" className={getSpayNeuterColor(dog["Spay_Neuter_status"])}>
            {getSpayNeuterText(dog["Spay_Neuter_status"], dog.Gender)}
          </Badge>
          
          {dog["Sociability_status"] && 
           dog["Sociability_status"] !== dog["Sociablity_playstyle"] && (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              {dog["Sociability_status"]}
            </Badge>
          )}
          
          {dog["Sociablity_playstyle"] && (
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
              {dog["Sociablity_playstyle"]}
            </Badge>
          )}

          {dog["Cuddle_Meter"] && 
           dog["Cuddle_Meter"] !== "N/A" && 
           dog["Cuddle_Meter"] !== "Unknown" && 
           !dog["Cuddle_Meter"].includes("Unknown") && 
           !dog["Cuddle_Meter"].includes("Not tested") && (
            <Badge variant="outline" className="bg-pink-50 text-pink-700 border-pink-200">
              Cuddle: {dog["Cuddle_Meter"]}
            </Badge>
          )}

          {dog["Kid_Interaction"] && 
           dog["Kid_Interaction"] !== "N/A" && 
           dog["Kid_Interaction"] !== "Unknown" && 
           !dog["Kid_Interaction"].includes("Unknown") && 
           !dog["Kid_Interaction"].includes("Not tested") && (
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
              Kids: {dog["Kid_Interaction"]}
            </Badge>
          )}

          {dog["Cat_Interaction"] && 
           dog["Cat_Interaction"] !== "N/A" && 
           dog["Cat_Interaction"] !== "Unknown" && 
           !dog["Cat_Interaction"].includes("Unknown") && 
           !dog["Cat_Interaction"].includes("Not tested") && (
            <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
              Cats: {dog["Cat_Interaction"]}
            </Badge>
          )}

          {dog["Dog_Interaction"] && 
           dog["Dog_Interaction"] !== "N/A" && 
           dog["Dog_Interaction"] !== "Unknown" && 
           !dog["Dog_Interaction"].includes("Unknown") && 
           !dog["Dog_Interaction"].includes("Not tested") && (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Dogs: {dog["Dog_Interaction"]}
            </Badge>
          )}
        </div>

        <div className="flex-1"></div>

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

DogCard.displayName = 'DogCard';

export default DogCard;