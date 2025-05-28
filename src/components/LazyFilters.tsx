'use client';

import { memo } from 'react';

interface LazyFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedBreed: string;
  selectedLevel: string;
  selectedSize: string;
  onFilterChange: (filterType: string, value: string) => void;
  sortBy: string;
  setSortBy: (value: any) => void;
  viewMode: 'grid' | 'list';
  setViewMode: (value: 'grid' | 'list') => void;
  breeds: string[];
}

const LazyFilters = memo<LazyFiltersProps>(({
  searchTerm,
  onSearchChange,
  selectedBreed,
  selectedLevel,
  selectedSize,
  onFilterChange,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
  breeds
}) => {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Your existing filter UI here */}
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          {/* Search and filters */}
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <input
              type="text"
              placeholder="Search dogs..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {/* Add other filters here */}
          </div>
          
          {/* View toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 rounded ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              List
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

LazyFilters.displayName = 'LazyFilters';

export default LazyFilters; 