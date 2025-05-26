import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ExternalLink, Grid, List } from "lucide-react";
import DogCard from './DogCard';
import { Dog } from '@/types/Dog';

interface DogListProps {
  dogs: Dog[];
  favorites: Set<number>;
  onToggleFavorite: (dogId: number) => void;
}

const DogList: React.FC<DogListProps> = ({ dogs, favorites, onToggleFavorite }) => {
  const [activeTab, setActiveTab] = useState("cards");

  const getLevelColor = (level: number) => {
    switch (level) {
      case 1: return "bg-green-100 text-green-800 border-green-300";
      case 2: return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case 3: return "bg-red-100 text-red-800 border-red-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getGenderIcon = (gender: string) => {
    if (gender.toLowerCase() === 'male') {
      return <span className="text-blue-500 text-lg">♂</span>;
    } else if (gender.toLowerCase() === 'female') {
      return <span className="text-pink-500 text-lg">♀</span>;
    }
    return null;
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="cards" className="flex items-center gap-2">
          <Grid className="h-4 w-4" />
          Card View
        </TabsTrigger>
        <TabsTrigger value="table" className="flex items-center gap-2">
          <List className="h-4 w-4" />
          Table View
        </TabsTrigger>
      </TabsList>

      <TabsContent value="cards">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {dogs.map((dog) => (
            <DogCard
              key={dog["Dog ID"]}
              dog={dog}
              isFavorite={favorites.has(dog["Dog ID"])}
              onToggleFavorite={() => onToggleFavorite(dog["Dog ID"])}
            />
          ))}
        </div>
      </TabsContent>

      <TabsContent value="table">
        <div className="bg-white rounded-lg shadow-sm border border-orange-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-orange-50 to-yellow-50 border-b border-orange-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Breed</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Age</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Weight</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Level</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Location</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Adopt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {dogs.map((dog) => (
                  <tr key={dog["Dog ID"]} className="hover:bg-orange-25 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{dog.Name}</span>
                        {getGenderIcon(dog.Gender)}
                      </div>
                      <div className="text-xs text-gray-500">ID: {dog["Dog ID"]}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {dog["Breed AI_1"] || dog["Breed AI"] || "Mixed Breed"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{dog.Approx_Age}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{dog.Weight} lbs</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(dog.Level)}`}>
                        Level {dog.Level}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {dog.Location_kennel === "Foster Care" ? (
                        <span className="text-sm text-gray-700">In Foster</span>
                      ) : (
                        <span className="text-sm text-gray-700">
                          {dog.Location_kennel}
                          {dog.Location_room && dog.Location_room !== dog.Location_kennel && 
                            ` • ${dog.Location_room}`
                          }
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {dog.Adopets_url ? (
                        <Button 
                          asChild 
                          size="sm"
                          className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white"
                        >
                          <a 
                            href={dog.Adopets_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-1"
                          >
                            <span>Adopt</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </Button>
                      ) : (
                        <span className="text-gray-400 text-sm">N/A</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default DogList; 