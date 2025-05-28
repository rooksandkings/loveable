'use client';

import { memo } from 'react';
import { DogCard } from './DogCard';
import { DogList } from './DogList';

interface LazyDogGridProps {
  dogs: any[];
  viewMode: 'grid' | 'list';
  favorites: Set<string>;
  onToggleFavorite: (id: string) => void;
}

const LazyDogGrid = memo<LazyDogGridProps>(({
  dogs,
  viewMode,
  favorites,
  onToggleFavorite
}) => {
  if (viewMode === 'grid') {
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
  }

  return <DogList dogs={dogs} />;
});

LazyDogGrid.displayName = 'LazyDogGrid';

export default LazyDogGrid; 