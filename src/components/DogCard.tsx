import React, { useState } from 'react';
import { Heart, MapPin, Calendar, Weight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const getImageUrl = (photoUrl: string) => {
    if (!photoUrl) return '/placeholder-dog.jpg';
    // Handle Google Drive URLs
    if (photoUrl.includes('drive.google.com')) {
      const fileId = photoUrl.match(/\/d\/([a-zA-Z0-9-_]+)/)?.[1];
      return fileId ? `https://drive.google.com/uc?id=${fileId}` : '/placeholder-dog.jpg';
    }
    return photoUrl;
  };

  // Get all available photos for this dog
  const availablePhotos = [
    dog["Photo_1"],
    dog["Photo_2"], 
    dog["Photo_3"]
  ].filter(photo => photo && photo.trim() !== '');

  const getSizeCategory = (weight: number) => {
    if (weight < 25) return 'Small';
    if (weight < 60) return 'Medium';
    return 'Large';
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'yes': return 'bg-green-100 text-green-800';
      case 'no': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % availablePhotos.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + availablePhotos.length) % availablePhotos.length);
  };

  const currentPhoto = availablePhotos[currentImageIndex] || dog["Photo_1"];

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

  // Function to get gender-specific spay/neuter text
  const getSpayNeuterText = () => {
    if (dog["Spay_Neuter_status"] !== "Yes") {
      return "Not Fixed";
    }
    
    const gender = dog.Gender?.toLowerCase();
    if (gender === "male") {
      return "Neutered";
    } else if (gender === "female") {
      return "Spayed";
    } else {
      return "Spayed/Neutered"; // fallback if gender is unknown
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-white border-orange-200">
      <div className="relative group">
        <img
          src={getImageUrl(currentPhoto)}
          alt={`${dog.Name} - Photo ${currentImageIndex + 1}`}
          className="w-full h-64 sm:h-72 object-cover object-top sm:object-contain bg-gray-50"
          onError={(e) => {
            e.currentTarget.src = '/placeholder-dog.jpg';
          }}
        />
        
        {/* Image Navigation Arrows - positioned at edges */}
        {availablePhotos.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="sm"
              className="absolute left-1 top-1/2 transform -translate-y-1/2 p-1 h-8 w-8 rounded-full bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              onClick={prevImage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 p-1 h-8 w-8 rounded-full bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              onClick={nextImage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            
            {/* Image indicators */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
              {availablePhotos.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
          </>
        )}

        <Button
          variant="ghost"
          size="sm"
          className={`absolute top-2 right-2 p-2 rounded-full ${
            isFavorite ? 'bg-red-100 text-red-600' : 'bg-white/80 text-gray-600'
          }`}
          onClick={onToggleFavorite}
        >
          <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
        </Button>
        
        {dog["Foster_status"] === "Yes" && (
          <Badge className="absolute top-2 left-2 bg-blue-500 text-white">
            In Foster
          </Badge>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-900">{dog.Name}</h3>
            {dog.Gender && (
              <Badge variant="outline" className="text-xs">
                {dog.Gender}
              </Badge>
            )}
          </div>
          <Badge variant="outline" className="text-xs">
            ID: {dog["Dog ID"]}
          </Badge>
        </div>
        
        <p className="text-sm text-gray-600 mb-3">{dog["Breed AI"]}</p>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Weight className="h-4 w-4 text-gray-400" />
            <span>{dog.Weight} lbs • {getSizeCategory(dog.Weight)}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span>{dog["Days_in_DCAS"]} days in shelter</span>
          </div>
          
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-400" />
            <span>{dog["Location_kennel"]} - {dog["Location_room"]}</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1 mt-3">
          <Badge className={getStatusColor(dog["Spay_Neuter_status"])}>
            {getSpayNeuterText()}
          </Badge>
          
          {dog["Approx_Age"] && (
            <Badge variant="outline" className="text-xs">
              {dog["Approx_Age"]}
            </Badge>
          )}
          
          {dog["Sociability_status"] && (
            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
              {dog["Sociability_status"]}
            </Badge>
          )}
          
          {dog["Sociablity_playstyle"] && (
            <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
              {dog["Sociablity_playstyle"]}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DogCard;
