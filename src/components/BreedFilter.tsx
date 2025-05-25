
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BreedFilterProps {
  breeds: string[];
  selectedBreed: string;
  onBreedChange: (breed: string) => void;
}

const BreedFilter: React.FC<BreedFilterProps> = ({ breeds, selectedBreed, onBreedChange }) => {
  const capitalizeBreed = (breed: string): string => {
    return breed
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getBreedDisplayName = (breed: string): string => {
    // Special cases for better display
    const displayNames: { [key: string]: string } = {
      'pit bull': 'Pit Bull / American Pit Bull Terrier',
      'husky': 'Husky (All Types)',
      'shepherd': 'Shepherd (All Types)',
      'retriever': 'Retriever (All Types)',
      'terrier': 'Terrier (All Types)',
      'bulldog': 'Bulldog (All Types)',
      'poodle': 'Poodle (All Types)',
    };

    return displayNames[breed] || capitalizeBreed(breed);
  };

  return (
    <Select value={selectedBreed} onValueChange={onBreedChange}>
      <SelectTrigger className="border-orange-200">
        <SelectValue placeholder="Filter by breed..." />
      </SelectTrigger>
      <SelectContent className="max-h-60 overflow-y-auto">
        <SelectItem value="all">All Breeds ({breeds.length})</SelectItem>
        {breeds.map((breed) => (
          <SelectItem key={breed} value={breed}>
            {getBreedDisplayName(breed)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default BreedFilter;
