import { memo } from 'react';
import { Search, Grid, List, SlidersHorizontal } from 'lucide-react';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface FilterBarProps {
  searchTerm: string;
  selectedBreed: string;
  fosterStatus: string;
  sortBy: string;
  viewMode: 'grid' | 'list';
  totalDogs: number;
  filteredDogs: number;
  onSearchChange: (value: string) => void;
  onBreedChange: (value: string) => void;
  onFosterStatusChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

const FilterBar = memo(({
  searchTerm,
  selectedBreed,
  fosterStatus,
  sortBy,
  viewMode,
  totalDogs,
  filteredDogs,
  onSearchChange,
  onBreedChange,
  onFosterStatusChange,
  onSortChange,
  onViewModeChange
}: FilterBarProps) => {
  return (
    <div className="space-y-4 p-4 bg-white rounded-lg shadow-sm">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <Select value={selectedBreed} onValueChange={onBreedChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select breed" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Visuals</SelectItem>
              <SelectItem value="Labrador Retriever">Labrador Retriever</SelectItem>
              <SelectItem value="Pit Bull">Pit Bull</SelectItem>
              <SelectItem value="German Shepherd">German Shepherd</SelectItem>
              {/* Add more breeds as needed */}
            </SelectContent>
          </Select>

          <Select value={fosterStatus} onValueChange={onFosterStatusChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Foster status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Status</SelectItem>
              <SelectItem value="Available">Available</SelectItem>
              <SelectItem value="Fostered">Fostered</SelectItem>
              <SelectItem value="Adopted">Adopted</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="age">Age</SelectItem>
              <SelectItem value="weight">Weight</SelectItem>
              <SelectItem value="daysInShelter">Days in Shelter</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="icon"
              onClick={() => onViewModeChange('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="icon"
              onClick={() => onViewModeChange('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="font-normal">
            {filteredDogs} of {totalDogs} dogs
          </Badge>
          {(searchTerm || selectedBreed || fosterStatus) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onSearchChange('');
                onBreedChange('');
                onFosterStatusChange('');
              }}
            >
              Clear filters
            </Button>
          )}
        </div>
      </div>
    </div>
  );
});

FilterBar.displayName = 'FilterBar';

export default FilterBar; 