import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FosterFilterProps {
  selectedFosterStatus: string;
  onFosterStatusChange: (status: string) => void;
}

const FosterFilter: React.FC<FosterFilterProps> = ({ selectedFosterStatus, onFosterStatusChange }) => {
  return (
    <Select value={selectedFosterStatus} onValueChange={onFosterStatusChange}>
      <SelectTrigger className="border-orange-200">
        <SelectValue placeholder="Foster Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Dogs</SelectItem>
        <SelectItem value="foster">In Foster</SelectItem>
        <SelectItem value="not-foster">In Shelter</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default FosterFilter;
