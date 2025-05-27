import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import DogCard from './DogCard';
import { Dog } from '@/types/Dog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DogListProps {
  dogs: Dog[];
  favorites: Set<number>;
  onToggleFavorite: (dogId: number) => void;
  viewMode?: string;
}

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

  const getImageUrl = (photoUrl: string) => {
    if (!photoUrl) return 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop&crop=face';
    
    if (photoUrl.includes('drive.google.com')) {
      const fileId = photoUrl.match(/\/d\/([a-zA-Z0-9-_]+)/)?.[1];
      if (fileId) {
        return `https://drive.google.com/uc?export=view&id=${fileId}`;
      }
    }
    
    return photoUrl;
  };

  const formatLocation = (kennel: string, room: string) => {
    if (kennel === "Foster Care") {
      return "In Foster";
    }
    
    // Handle ISO Dogs pattern: ISO16 • ISO Dogs -> ISO Dogs 16
    if (kennel && kennel.startsWith("ISO") && room === "ISO Dogs") {
      const number = kennel.replace("ISO", "");
      return `ISO Dogs ${number}`;
    }
    
    // Handle ISO Puppies pattern: IsoP16 • ISO Puppies -> ISO Puppies 16
    if (kennel && kennel.startsWith("IsoP") && room === "ISO Puppies") {
      const number = kennel.replace("IsoP", "");
      return `ISO Puppies ${number}`;
    }
    
    // Handle Cat Hold pattern: Cat Holding (79) 06 • Cat Hold(79) -> Cat Holdings (79) - 06
    if (kennel && kennel.includes("Cat Holding") && room && room.includes("Cat Hold")) {
      const match = kennel.match(/Cat Holding \((\d+)\) (\d+)/);
      if (match) {
        const [, number1, number2] = match;
        return `Cat Holdings (${number1}) - ${number2}`;
      }
    }
    
    // Handle Adopt Puppies pattern: P09 • Adopt Puppies -> Adoption Puppies 09
    if (kennel && kennel.startsWith("P") && room === "Adopt Puppies") {
      const number = kennel.replace("P", "");
      return `Adoption Puppies ${number}`;
    }
    
    // Handle Dog Hold pattern: Hold15 • Dog Hold -> Dog Holding 15
    if (kennel && kennel.startsWith("Hold") && room === "Dog Hold") {
      const number = kennel.replace("Hold", "");
      return `Dog Holding ${number}`;
    }
    
    // Handle Bonding Rooms pattern: Bonding Rooms A1C -> Bonding Rooms A1 - C
    if (kennel && kennel.startsWith("Bonding Rooms") && (room === "Bonding Rooms" || !room)) {
      const match = kennel.match(/Bonding Rooms ([A-Z]\d+)([A-Z])/);
      if (match) {
        const [, roomNumber, section] = match;
        return `Bonding Rooms ${roomNumber} - ${section}`;
      }
      return kennel; // fallback if pattern doesn't match
    }
    
    // Handle Hall Crate pattern: extract the specific crate info
    if (kennel && kennel.includes("Hall Crate")) {
      // Handle both "Hall Crate Hall Crate 34-B" and "Hall Crate Hall Crate 32- B • Hall Crate"
      if (room === "Hall Crate" || !room) {
        // Remove duplicate "Hall Crate" and extract the crate number
        let cleaned = kennel.replace(/^Hall Crate\s+Hall Crate\s+/, "Hall Crate ");
        // Add spaces around dashes: 34-B -> 34 - B
        cleaned = cleaned.replace(/(\d+)-([A-Z])/g, '$1 - $2');
        return cleaned;
      }
    }
    
    // Handle "Adopt Dogs" ranges - extract just the kennel number
    if (room && room.includes("Adopt Dogs")) {
      // If kennel matches the pattern (like A09, B28, C39), just show the kennel
      if (kennel && kennel.match(/^[A-Z]\d+/)) {
        // Format as C - 39 instead of C39
        const formatted = kennel.replace(/^([A-Z])(\d+)/, '$1 - $2');
        return formatted;
      }
    }
    
    // Default behavior for other locations
    if (room && room !== kennel) {
      return `${kennel} • ${room}`;
    }
    
    return kennel;
  };

  // Table view
  if (viewMode === "table") {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-orange-200 overflow-hidden">
        <div className="overflow-x-auto overflow-y-visible">
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
            <tbody className="divide-y divide-gray-100">
              {dogs.map((dog) => (
                <tr key={dog["Dog ID"]} className="hover:bg-orange-25 transition-colors">
                  <td className="px-4 py-3">
                    <div className="w-16 h-16 bg-orange-50 rounded-lg overflow-hidden flex items-center justify-center">
                      <img
                        src={getImageUrl(dog["Photo_1"])}
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
                      <span className="font-medium text-gray-900">{dog.Name}</span>
                      {getGenderIcon(dog.Gender)}
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Default to cards view
  return (
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
  );
};

export default DogList; 