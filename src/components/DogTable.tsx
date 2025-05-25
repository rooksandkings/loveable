
import React from 'react';
import { Heart, MapPin, Calendar, Weight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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

interface DogTableProps {
  dogs: Dog[];
  favorites: number[];
  onToggleFavorite: (dogId: number) => void;
}

const DogTable: React.FC<DogTableProps> = ({ dogs, favorites, onToggleFavorite }) => {
  const getBreedDisplay = (dog: Dog) => {
    const breeds = [dog["Breed_AI_1"], dog["Breed_AI_2"], dog["Breed_AI_3"]]
      .filter(Boolean)
      .slice(0, 2);
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

  const getLocationDisplay = (dog: Dog) => {
    if (dog["Foster_status"] === "Yes") {
      return "Foster Care";
    }
    return dog["Location_kennel"] || "At Shelter";
  };

  const getMainPhoto = (dog: Dog) => {
    const photos = [dog["Photo_1"], dog["Photo_2"], dog["Photo_3"]]
      .filter(photo => photo && photo.trim() && !photo.includes('[Photo') && photo !== 'N/A');
    return photos.length > 0 ? photos[0] : null;
  };

  return (
    <div className="bg-white rounded-lg border border-orange-100 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Photo</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Breed</TableHead>
            <TableHead>Age & Gender</TableHead>
            <TableHead>Weight</TableHead>
            <TableHead>Level</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Days in Care</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Favorite</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dogs.map((dog) => {
            const mainPhoto = getMainPhoto(dog);
            const isFavorite = favorites.includes(dog["Dog ID"]);
            
            return (
              <TableRow key={dog["Dog ID"]} className="hover:bg-orange-50">
                <TableCell>
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-200 to-amber-200 rounded-lg flex items-center justify-center overflow-hidden">
                    {mainPhoto ? (
                      <img
                        src={mainPhoto}
                        alt={dog.Name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-2xl">🐕</div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-medium">{dog.Name}</TableCell>
                <TableCell>{getBreedDisplay(dog)}</TableCell>
                <TableCell>{dog["Approx_Age"]} • {dog.Gender}</TableCell>
                <TableCell>{dog.Weight} lbs</TableCell>
                <TableCell>
                  <Badge className={getLevelBadgeColor(dog.Level)}>
                    Level {dog.Level}
                  </Badge>
                </TableCell>
                <TableCell>{getLocationDisplay(dog)}</TableCell>
                <TableCell>{dog["Days_in_DCAS"]} days</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {dog["Spay_Neuter_status"] === "Yes" && (
                      <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                        S/N
                      </Badge>
                    )}
                    {dog["Foster_status"] === "Yes" && (
                      <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                        Foster
                      </Badge>
                    )}
                    {dog["Heartworm_Status"] === "Neg" && (
                      <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                        HW-
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`p-2 rounded-full ${
                      isFavorite 
                        ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    onClick={() => onToggleFavorite(dog["Dog ID"])}
                  >
                    <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default DogTable;
