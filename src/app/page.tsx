'use client';

import { useState, useEffect, useMemo, useCallback, Suspense, startTransition } from 'react';
import { DogCard } from '@/components/DogCard';
import { DogList } from '@/components/DogList';

export default function Home() {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBreed, setSelectedBreed] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Use startTransition for non-urgent updates
  const handleSearchChange = useCallback((value: string) => {
    startTransition(() => {
      setSearchTerm(value);
    });
  }, []);

  const handleFilterChange = useCallback((filterType: string, value: string) => {
    startTransition(() => {
      switch (filterType) {
        case 'breed':
          setSelectedBreed(value);
          break;
        case 'level':
          setSelectedLevel(value);
          break;
        case 'size':
          setSelectedSize(value);
          break;
      }
    });
  }, []);

  // Defer heavy computations
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/api/dogs');
        const data = await response.json();
        
        // Use scheduler.postTask if available, otherwise setTimeout
        if ('scheduler' in window && 'postTask' in (window as any).scheduler) {
          (window as any).scheduler.postTask(() => {
            setDogs(data);
            setLoading(false);
          }, { priority: 'user-blocking' });
        } else {
          setTimeout(() => {
            setDogs(data);
            setLoading(false);
          }, 0);
        }
      } catch (error) {
        console.error('Error loading dogs:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const parseAge = (ageString: string) => {
    if (!ageString) return 0;
    const match = ageString.match(/(\d+)\s*yr?\s*(\d+)?\s*mo?/);
    if (match) {
      const years = parseInt(match[1]) || 0;
      const months = parseInt(match[2]) || 0;
      return years * 12 + months; // Convert to total months
    }
    return 0;
  };

  // Memoize the parseAge function
  const parseAgeMemo = useCallback((ageString: string) => {
    if (!ageString) return 0;
    const match = ageString.match(/(\d+)\s*yr?\s*(\d+)?\s*mo?/);
    if (match) {
      const years = parseInt(match[1]) || 0;
      const months = parseInt(match[2]) || 0;
      return years * 12 + months; // Convert to total months
    }
    return 0;
  }, []);

  const sortedDogs = useMemo(() => {
    const sorted = [...dogs];
    
    switch (sortBy) {
      case 'name':
        return sorted.sort((a, b) => a.Name.localeCompare(b.Name));
      case 'age':
        return sorted.sort((a, b) => {
          const ageA = parseAgeMemo(a.Approx_Age);
          const ageB = parseAgeMemo(b.Approx_Age);
          return ageA - ageB;
        });
      case 'size':
        return sorted.sort((a, b) => parseFloat(a.Weight) - parseFloat(b.Weight));
      case 'level':
        return sorted.sort((a, b) => parseInt(a.Level) - parseInt(b.Level));
      case 'weight':
        return sorted.sort((a, b) => parseFloat(a.Weight) - parseFloat(b.Weight));
      case 'dftdEligible':
        return sorted.sort((a, b) => {
          const aEligible = a.DFTD_eligibility === "Yes" ? 1 : 0;
          const bEligible = b.DFTD_eligibility === "Yes" ? 1 : 0;
          return bEligible - aEligible; // DFTD eligible dogs first
        });
      default:
        return sorted;
    }
  }, [dogs, sortBy, parseAgeMemo]);

  const toggleFavorite = (dogId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(dogId)) {
      newFavorites.delete(dogId);
    } else {
      newFavorites.add(dogId);
    }
    setFavorites(newFavorites);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Critical above-the-fold content */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Find Your Perfect Companion
            </h1>
            <p 
              className="text-xl text-gray-600 max-w-2xl mx-auto mb-8 font-inter hero-text"
              style={{
                fontDisplay: 'swap',
                contain: 'layout style paint',
                willChange: 'auto'
              }}
            >
              Every dog deserves a loving home. Browse our adorable rescue dogs and find your perfect companion.
            </p>
          </div>
        </div>
      </div>

      {/* Lazy load everything below the fold */}
      <Suspense fallback={<div>Loading filters...</div>}>
        <LazyFilters 
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          selectedBreed={selectedBreed}
          selectedLevel={selectedLevel}
          selectedSize={selectedSize}
          onFilterChange={handleFilterChange}
          sortBy={sortBy}
          setSortBy={setSortBy}
          viewMode={viewMode}
          setViewMode={setViewMode}
          breeds={breeds}
        />
      </Suspense>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<DogGridSkeleton />}>
          <LazyDogGrid 
            dogs={sortedDogs}
            viewMode={viewMode}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
          />
        </Suspense>
      </main>
    </div>
  );
}

// Lazy-loaded components
const LazyFilters = lazy(() => import('@/components/LazyFilters'));
const LazyDogGrid = lazy(() => import('@/components/LazyDogGrid'));

const DogGridSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {Array.from({ length: 8 }).map((_, i) => (
      <div key={i} className="bg-white rounded-lg shadow-md h-96 animate-pulse" />
    ))}
  </div>
); 