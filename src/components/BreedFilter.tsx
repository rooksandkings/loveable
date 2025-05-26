import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BreedFilterProps {
  breeds: string[];
  selectedBreed: string;
  onBreedChange: (breed: string) => void;
}

const BreedFilter: React.FC<BreedFilterProps> = ({ breeds, selectedBreed, onBreedChange }) => {
  return (
    <Select value={selectedBreed} onValueChange={onBreedChange}>
      <SelectTrigger className="border-orange-200">
        <SelectValue placeholder="All Breeds" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Breeds</SelectItem>
        {breeds.map((breed) => (
          <SelectItem key={breed} value={breed}>
            {breed.charAt(0).toUpperCase() + breed.slice(1)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default BreedFilter;
