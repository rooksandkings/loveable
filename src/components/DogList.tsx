import { Button } from "@/components/ui/button";
import { ExternalLink, Search, ArrowUpDown } from "lucide-react";
import DogCard from './DogCard';
import { Dog } from '@/types/Dog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useMemo, useState, useCallback } from "react";
import { parseAge, formatLocation, getImageUrl, getLevelColor, getGenderIcon } from '@/utils/dogUtils';

interface DogListProps {
  dogs: Dog[];
  favorites: Set<number>;
  onToggleFavorite: (dogId: number) => void;
  viewMode?: string;
}

type SortOption = 'name' | 'age' | 'weight' | 'daysInShelter' | 'dftdEligible';

const DogList: React.FC<DogListProps> = ({ dogs, favorites, onToggleFavorite, viewMode = "cards" }) => {
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

  const getImageUrlMemo = useCallback((photoUrl: string) => {
    if (!photoUrl) return 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop&crop=face';
    
    if (photoUrl.includes('drive.google.com')) {
      const fileId = photoUrl.match(/\/d\/([a-zA-Z0-9-_]+)/)?.[1];
      if (fileId) {
        return `https://drive.google.com/uc?export=view&id=${fileId}`;
      }
    }
    
    return photoUrl;
  }, []);

  if (viewMode === "table") {
    return (
      <div>
        <div className="bg-white rounded-lg shadow-sm border border-orange-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-orange-50 to-yellow-50 border-b border-orange-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Photo</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 relative">
                    <div className="relative group">
                      <span className="cursor-help underline decoration-dotted">
                        Breed
                      </span>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                        AI-identified breed. DNA test may be required to verify.
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-800"></div>
                      </div>
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 w-24">Age</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Weight</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 w-20">Level</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Location</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Adopt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-orange-100">
                {dogs.map((dog) => {
                  const genderInfo = getGenderIcon(dog.Gender);
                  return (
                    <tr key={dog["Dog ID"]} className="hover:bg-orange-25 transition-colors">
                      <td className="px-4 py-3">
                        <div className="w-16 h-16 bg-orange-50 rounded-lg overflow-hidden flex items-center justify-center">
                          <img
                            src={getImageUrlMemo(dog["Photo_1"])}
                            alt={dog.Name}
                            className="max-w-full max-h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop&crop=face';
                            }}
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {genderInfo && (
                            <span className={genderInfo.className}>
                              {genderInfo.icon}
                            </span>
                          )}
                          <span className="font-medium text-gray-900">{dog.Name}</span>
                        </div>
                        <div className="text-xs text-gray-500">ID: {dog["Dog ID"]}</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {dog["Breed AI_1"] || dog["Breed AI"] || "Mixed Breed"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">{dog.Approx_Age}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{dog.Weight} lbs</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${getLevelColor(dog.Level)}`}>
                          Level {dog.Level}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-sm text-gray-700">
                          {formatLocation(dog.Location_kennel, dog.Location_room)}
                        </span>
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
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // Default to cards view
  return (
    <div>
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
    </div>
  );
};

export default DogList; 