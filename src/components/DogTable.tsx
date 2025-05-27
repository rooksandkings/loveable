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
    if (!photoUrl) return 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop&crop=face';
    // Handle Google Drive URLs
    if (photoUrl.includes('drive.google.com')) {
      const fileId = photoUrl.match(/\/d\/([a-zA-Z0-9-_]+)/)?.[1];
      return fileId ? `https://drive.google.com/uc?id=${fileId}` : 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop&crop=face';
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

  const getGenderIcon = (gender: string) => {
    if (gender?.toLowerCase() === 'male') {
      return (
        <div className="flex items-center gap-1 text-blue-600">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.5 7.5V5h3v3h-2.5v2.5c0 2.76-2.24 5-5 5s-5-2.24-5-5 2.24-5 5-5c1.38 0 2.63.56 3.54 1.46L16 5.5h2.5V3H21v5h-5v-2.5h1.5l-1.46 1.46C15.44 6.37 14.38 6 13 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6V7.5h-3.5z"/>
          </svg>
        </div>
      );
    } else if (gender?.toLowerCase() === 'female') {
      return (
        <div className="flex items-center gap-1 text-pink-600">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2c3.31 0 6 2.69 6 6 0 2.97-2.16 5.43-5 5.91V16h2v2h-2v2h-2v-2H9v-2h2v-2.09c-2.84-.48-5-2.94-5-5.91 0-3.31 2.69-6 6-6zm0 2c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"/>
          </svg>
        </div>
      );
    }
    return <span className="text-gray-400 text-xs">Unknown</span>;
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

  const getLevelColor = (level: number) => {
    if (level <= 2) return 'bg-green-100 text-green-800 border-green-200';
    if (level <= 4) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
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
                <TableHead>Level</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dogs.map((dog) => (
                <TableRow key={dog["Dog ID"]} className="h-20">
                  <TableCell>
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                      <img
                        src={getImageUrl(dog["Photo_1"])}
                        alt={dog.Name}
                        className="max-w-full max-h-full object-contain"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop&crop=face';
                        }}
                      />
                    </div>
                  </TableCell>
                  
                  <TableCell className="font-medium">{dog.Name}</TableCell>
                  <TableCell>{dog["Breed AI"]}</TableCell>
                  <TableCell>{dog["Approx_Age"] || 'Unknown'}</TableCell>
                  <TableCell>{dog.Weight} lbs</TableCell>
                  <TableCell>{dog["Days_in_DCAS"]} days</TableCell>
                  <TableCell>{dog["Location_kennel"]} • {dog["Location_room"]}</TableCell>
                  <TableCell>
                    <Badge className={dog["Foster_status"] === "Yes" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                      {dog["Foster_status"] === "Yes" ? "Yes" : "No"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getSpayNeuterColor(dog["Spay_Neuter_status"])}>
                      {getSpayNeuterText(dog["Spay_Neuter_status"], dog.Gender)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {getGenderIcon(dog.Gender)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getLevelColor(dog.Level)}>
                      Level {dog.Level}
                    </Badge>
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
