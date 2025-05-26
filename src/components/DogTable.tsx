import React from 'react';
import { Heart, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
  const getImageUrl = (photoUrl: string) => {
    if (!photoUrl) return '/placeholder-dog.jpg';
    // Handle Google Drive URLs
    if (photoUrl.includes('drive.google.com')) {
      const fileId = photoUrl.match(/\/d\/([a-zA-Z0-9-_]+)/)?.[1];
      return fileId ? `https://drive.google.com/uc?id=${fileId}` : '/placeholder-dog.jpg';
    }
    return photoUrl;
  };

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dogs Available for Adoption</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">Photo</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Breed</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Weight</TableHead>
                <TableHead>Days in Shelter</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Foster</TableHead>
                <TableHead>Fixed</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dogs.map((dog) => (
                <TableRow key={dog["Dog ID"]} className="h-20">
                  <TableCell>
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={getImageUrl(dog["Photo_1"])}
                        alt={dog.Name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder-dog.jpg';
                        }}
                      />
                    </div>
                  </TableCell>
                  
                  <TableCell className="font-medium">
                    <div>
                      <div className="font-semibold">{dog.Name}</div>
                      <div className="text-xs text-gray-500">ID: {dog["Dog ID"]}</div>
                    </div>
                  </TableCell>
                  
                  <TableCell>{dog["Breed AI"]}</TableCell>
                  
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {dog["Approx_Age"] || 'Unknown'}
                    </Badge>
                  </TableCell>
                  
                  <TableCell>
                    <div className="text-sm">
                      <div>{dog.Weight} lbs</div>
                      <div className="text-xs text-gray-500">{getSizeCategory(dog.Weight)}</div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {dog["Days_in_DCAS"]} days
                    </Badge>
                  </TableCell>
                  
                  <TableCell>
                    <div className="text-sm">
                      <div>{dog["Location_kennel"]}</div>
                      <div className="text-xs text-gray-500">{dog["Location_room"]}</div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <Badge className={dog["Foster_status"] === "Yes" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}>
                      {dog["Foster_status"] === "Yes" ? "Available" : "No"}
                    </Badge>
                  </TableCell>
                  
                  <TableCell>
                    <Badge className={getStatusColor(dog["Spay_Neuter_status"])}>
                      {dog["Spay_Neuter_status"] === "Yes" ? "Yes" : "No"}
                    </Badge>
                  </TableCell>
                  
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {dog.Gender || 'Unknown'}
                    </Badge>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`h-8 w-8 p-0 ${
                          favorites.includes(dog["Dog ID"]) ? 'text-red-600' : 'text-gray-400'
                        }`}
                        onClick={() => onToggleFavorite(dog["Dog ID"])}
                      >
                        <Heart className={`h-4 w-4 ${favorites.includes(dog["Dog ID"]) ? 'fill-current' : ''}`} />
                      </Button>
                      {dog["Photo_1"] && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => window.open(getImageUrl(dog["Photo_1"]), '_blank')}
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {dogs.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No dogs match your current filters.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DogTable;
