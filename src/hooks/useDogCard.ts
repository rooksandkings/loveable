import { useState, useCallback, useMemo, useEffect } from 'react';
import { Dog } from '@/types/Dog';

export const useDogCard = (dog: Dog) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  // Memoize expensive computations
  const getImageUrl = useCallback((photoUrl: string) => {
    if (!photoUrl || photoUrl.trim() === '' || photoUrl === 'N/A') {
      return null;
    }
    
    const cleanUrl = photoUrl.trim();
    
    if (cleanUrl.includes('petango.com')) {
      return cleanUrl;
    }
    
    if (cleanUrl.includes('drive.google.com')) {
      const fileId = cleanUrl.match(/\/d\/([a-zA-Z0-9-_]+)/)?.[1];
      return fileId ? `https://drive.google.com/uc?id=${fileId}` : null;
    }
    
    return cleanUrl;
  }, []);

  // Get available photos
  const availablePhotos = useMemo(() => {
    const photos = [];
    if (dog["mini_pic_1"]) photos.push(dog["mini_pic_1"]);
    if (dog["mini_pic_2"]) photos.push(dog["mini_pic_2"]);
    if (dog["mini_pic_3"]) photos.push(dog["mini_pic_3"]);
    return photos;
  }, [dog["mini_pic_1"], dog["mini_pic_2"], dog["mini_pic_3"]]);

  // Memoize the current image URL
  const currentImageUrl = useMemo(() => {
    if (availablePhotos.length === 0) return null;
    return getImageUrl(availablePhotos[currentImageIndex]);
  }, [availablePhotos, currentImageIndex, getImageUrl]);

  // Handle image loading errors
  const handleImageError = useCallback(() => {
    setImageError(true);
    // Try next image if available
    if (availablePhotos.length > currentImageIndex + 1) {
      setCurrentImageIndex(prev => prev + 1);
    }
  }, [currentImageIndex, availablePhotos]);

  // Reset image error state when dog changes
  useEffect(() => {
    setImageError(false);
    setCurrentImageIndex(0);
  }, [dog["Dog ID"]]);

  // Memoize computed values
  const computedValues = useMemo(() => ({
    dftdEligible: dog.DFTD_eligibility === "Yes",
    sizeCategory: dog.Weight <= 25 ? 'Small' : dog.Weight <= 60 ? 'Medium' : 'Large',
    breedDisplay: dog["Breed AI"] || 'Mixed Breed',
    hasMultiplePhotos: availablePhotos.length > 1,
    genderInfo: dog.Gender ? {
      icon: dog.Gender.toLowerCase() === 'male' ? '♂' : '♀',
      className: dog.Gender.toLowerCase() === 'male' ? 'text-blue-500 text-lg' : 'text-pink-500 text-lg'
    } : null,
    isEssentialOnly: !dog.Level && !dog["Days_in_DCAS"]
  }), [dog, availablePhotos.length]);

  // Navigation functions
  const nextImage = useCallback(() => {
    if (computedValues.hasMultiplePhotos) {
      setCurrentImageIndex((prev) => (prev + 1) % availablePhotos.length);
    }
  }, [computedValues.hasMultiplePhotos, availablePhotos.length]);

  const prevImage = useCallback(() => {
    if (computedValues.hasMultiplePhotos) {
      setCurrentImageIndex((prev) => (prev - 1 + availablePhotos.length) % availablePhotos.length);
    }
  }, [computedValues.hasMultiplePhotos, availablePhotos.length]);

  return {
    currentImageIndex,
    imageError,
    currentImageUrl,
    handleImageError,
    nextImage,
    prevImage,
    setCurrentImageIndex,
    ...computedValues
  };
}; 