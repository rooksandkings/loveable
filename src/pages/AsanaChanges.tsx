import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MessageSquare, Calendar, Tag, Dog, Cat, Heart, Box, Zap, Baby, HelpCircle, GripVertical, Toilet, Minus, Home, Route, Lasso, Scan, ScanBarcode } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getAllAsanaProposedChanges, AsanaProposedChange, getAllDogs } from '@/lib/neon-api';

const AsanaChanges = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [itemsPerPage, setItemsPerPage] = useState('50');
  const [overriddenValues, setOverriddenValues] = useState<Record<number, string>>({});
  const [showLatestOnly, setShowLatestOnly] = useState(false);

  // Function to format date
  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const year = date.getFullYear().toString().slice(-2);
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      const displayMinutes = minutes.toString().padStart(2, '0');
      
      return `${month}/${day}/${year}\n${displayHours}:${displayMinutes} ${ampm}`;
    } catch (error) {
      return dateString;
    }
  };

  // Function to clean the name by removing foster-related text
  const cleanName = (name: string): string => {
    if (!name) return '';
    
    // Remove common foster-related suffixes
    return name
      .replace(/\s*-\s*in\s+foster\s*$/i, '')
      .replace(/\s*-\s*foster\s*$/i, '')
      .replace(/\s*\(foster\)\s*$/i, '')
      .replace(/\s*\[foster\]\s*$/i, '')
      .trim();
  };

  const { data: asanaChanges = [], isLoading, error } = useQuery({
    queryKey: ['asanaProposedChanges'],
    queryFn: getAllAsanaProposedChanges,
    staleTime: 1000 * 60 * 60 * 12, // 12 hours
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const { data: dogsData } = useQuery({
    queryKey: ['dogs'],
    queryFn: getAllDogs,
    staleTime: 1000 * 60 * 60 * 12, // 12 hours
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Create mapping of animal_id to shelter_location from dogs data
  const shelterLocationMap = useMemo(() => {
    const map = new Map<string, string>();
    if (dogsData) {
      dogsData.forEach(dog => {
        if (dog.dog_id && dog.shelter_location) {
          map.set(dog.dog_id, dog.shelter_location);
        }
      });
    }
    return map;
  }, [dogsData]);

  // Get unique categories for filter
  const uniqueCategories = useMemo(() => {
    const categories = asanaChanges
      .map(item => item.asana_category)
      .filter(category => category && category.trim() !== '')
      .sort();
    
    return [...new Set(categories)];
  }, [asanaChanges]);

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let filtered = asanaChanges.filter(item => {
      const matchesSearch = searchTerm === '' || 
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.animal_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.comments_sanitized?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.proposed_value?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || 
        item.asana_category === selectedCategory;
      
      // Location filtering logic - now using shelter_location directly from the table
      let matchesLocation = true;
      switch (locationFilter) {
        case 'all':
          matchesLocation = true;
          break;
        case 'DCAS':
          matchesLocation = item.shelter_location === 'DCAS';
          break;
        case 'FCAS':
          matchesLocation = item.shelter_location === 'FCAS';
          break;
        case 'CAC':
          matchesLocation = item.shelter_location === 'CAC';
          break;
        default:
          matchesLocation = true;
      }
      
      // Ignore items where the proposed value is the same as current value
      const currentValue = (item.current_value || '').trim().toLowerCase();
      const proposedValue = (item.proposed_value || '').trim().toLowerCase();
      const hasActualChange = currentValue !== proposedValue;
      
      return matchesSearch && matchesCategory && matchesLocation && hasActualChange;
    });

    // Sort by dog name first, then by creation date
    filtered.sort((a, b) => {
      const nameA = cleanName(a.name || '').toLowerCase();
      const nameB = cleanName(b.name || '').toLowerCase();
      
      if (nameA !== nameB) {
        return nameA.localeCompare(nameB);
      }
      
      // If same dog, sort by creation date (newest first)
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    // If showLatestOnly is enabled, filter to show only the latest change per category per dog
    if (showLatestOnly) {
      const latestChanges = new Map<string, AsanaProposedChange>();
      
      filtered.forEach(item => {
        const key = `${cleanName(item.name || '').toLowerCase()}-${item.asana_category}`;
        if (!latestChanges.has(key)) {
          latestChanges.set(key, item);
        }
      });
      
      filtered = Array.from(latestChanges.values());
      
      // Re-sort after filtering
      filtered.sort((a, b) => {
        const nameA = cleanName(a.name || '').toLowerCase();
        const nameB = cleanName(b.name || '').toLowerCase();
        
        if (nameA !== nameB) {
          return nameA.localeCompare(nameB);
        }
        
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
    }

    // Apply pagination
    if (itemsPerPage !== 'all') {
      const limit = parseInt(itemsPerPage);
      filtered = filtered.slice(0, limit);
    }

    return filtered;
  }, [asanaChanges, searchTerm, selectedCategory, locationFilter, itemsPerPage, showLatestOnly]);

  // Function to handle checkbox selection
  const toggleSelection = (commentGid: number) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentGid)) {
        newSet.delete(commentGid);
      } else {
        newSet.add(commentGid);
      }
      return newSet;
    });
  };

  // Function to select all visible items
  const selectAll = () => {
    const allIds = filteredAndSortedData.map(item => item.comment_gid);
    setSelectedItems(new Set(allIds));
  };

  // Function to clear all selections
  const clearAll = () => {
    setSelectedItems(new Set());
  };

  // Map category keywords to Lucide icons
  const getCategoryIcon = (category: string) => {
    const cat = (category || '').toLowerCase();
    
    // Crate trained
    if (cat.includes('crate')) {
      return <Home className="w-5 h-5 text-amber-800" />;
    }
    
    // Leash skills
    if (cat.includes('leash')) {
      return <Lasso className="w-5 h-5 text-purple-600" />;
    }
    
    // Dog interaction
    if (cat.includes('dog')) {
      return <Dog className="w-5 h-5 text-blue-600" />;
    }
    
    // Cat interaction
    if (cat.includes('cat')) {
      return <Cat className="w-5 h-5 text-orange-500" />;
    }
    
    // Kid interaction
    if (cat.includes('kid')) {
      return <Baby className="w-5 h-5 text-pink-500" />;
    }
    
    // Potty training
    if (cat.includes('potty')) {
      return <Toilet className="w-5 h-5 text-amber-500" />;
    }
    
    // Cuddle meter
    if (cat.includes('cuddle')) {
      return <Heart className="w-5 h-5 text-red-500" />;
    }
    
    // Energy/activity level
    if (cat.includes('energy') || cat.includes('activity')) {
      return <Zap className="w-5 h-5 text-yellow-600" />;
    }
    
    // More about me
    if (cat.includes('more about')) {
      return <HelpCircle className="w-5 h-5 text-green-600" />;
    }
    
    // Default: Tag icon for unknown categories
    return <Tag className="w-5 h-5 text-gray-500" />;
  };

  // Function to get dropdown options based on category
  const getCategoryOptions = (category: string): string[] => {
    const cat = (category || '').toLowerCase();
    
    if (cat.includes('crate')) {
      return [
        'Override',
        'Has done well in a crate',
        'No info',
        'Working on it',
        'Crates are scary'
      ];
    }
    
    if (cat.includes('leash')) {
      return [
        'Override',
        'Walks politely on leash',
        'Pulls some but manageable',
        'Strong puller',
        'Leash bites when excited',
        'Reactive on leash, distract me with treats',
        'Leash reactive to small animals',
        'Leash reactive to dogs',
        'Leash reactive to people',
        'Flight risk'
      ];
    }
    
    if (cat.includes('dog')) {
      return [
        'Override',
        'Lived with dogs',
        'Has enjoyed interacting with dogs',
        'Likes some dogs (dog selective)',
        'Only dog',
        'Unknown/Not tested'
      ];
    }
    
    if (cat.includes('cat')) {
      return [
        'Override',
        'Positive history with cats',
        'Does not like cats',
        'Could do well with proper introductions',
        'Unknown/No history'
      ];
    }
    
    if (cat.includes('kid')) {
      return [
        'Override',
        'Positive history with kids',
        'Best with older kids',
        'No kids please',
        'Unknown'
      ];
    }
    
    if (cat.includes('potty')) {
      return [
        'Override',
        'Has done well in a home',
        'Still working on it',
        'Not potty trained',
        'Unknown, but happy to learn!'
      ];
    }
    
    if (cat.includes('cuddle')) {
      return [
        'Override',
        'Let\'s get to know each other before cuddling',
        'I\'m affectionate with my friends',
        'Play first, then snuggle time',
        'Super cuddly!'
      ];
    }
    
    if (cat.includes('energy') || cat.includes('activity')) {
      return [
        'Override',
        '1- Low energy',
        '2- Medium energy',
        '3- High energy',
        '4- Regular running/hiking partner'
      ];
    }
    
    if (cat.includes('more about')) {
      return [
        'Override',
        'Loves fetch',
        'Loves toys',
        'Knows tricks',
        'Knows basic commands',
        'Volunteer favorite',
        'Staff favorite',
        'Fast learner',
        'Loves car rides',
        'Quiet house guest'
      ];
    }
    
    return ['Override'];
  };

  // Function to handle override value change
  const handleOverrideChange = (commentGid: number, value: string) => {
    setOverriddenValues(prev => ({
      ...prev,
      [commentGid]: value
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="text-lg text-gray-600">Loading Asana proposed changes...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl mb-6">😢</div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-500 mb-4">We couldn't fetch the Asana proposed changes right now</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="bg-blue-500 hover:bg-blue-600"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Asana Proposed Changes</h1>
          <p className="text-gray-600">Review and manage proposed changes from Asana comments</p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by name, ID, comments, or proposed value..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {uniqueCategories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="DCAS">DCAS</SelectItem>
                  <SelectItem value="FCAS">FCAS</SelectItem>
                  <SelectItem value="CAC">CAC</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Category Legend */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex flex-wrap justify-between gap-4 text-xs">
              <div className="flex items-center gap-2">
                {getCategoryIcon('crate')}
                <span>Crate trained</span>
              </div>
              <div className="flex items-center gap-2">
                {getCategoryIcon('leash')}
                <span>Leash skills</span>
              </div>
              <div className="flex items-center gap-2">
                {getCategoryIcon('dog')}
                <span>Dog interaction</span>
              </div>
              <div className="flex items-center gap-2">
                {getCategoryIcon('cat')}
                <span>Cat interaction</span>
              </div>
              <div className="flex items-center gap-2">
                {getCategoryIcon('kid')}
                <span>Kid interaction</span>
              </div>
              <div className="flex items-center gap-2">
                {getCategoryIcon('potty')}
                <span>Potty training</span>
              </div>
              <div className="flex items-center gap-2">
                {getCategoryIcon('cuddle')}
                <span>Cuddle meter</span>
              </div>
              <div className="flex items-center gap-2">
                {getCategoryIcon('energy')}
                <span>Energy level</span>
              </div>
              <div className="flex items-center gap-2">
                {getCategoryIcon('more about')}
                <span>More about me</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results count */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 font-medium">
              {filteredAndSortedData.length} of {asanaChanges.length} proposed changes
            </span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Show:</span>
                <Select value={itemsPerPage} onValueChange={setItemsPerPage}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                    <SelectItem value="200">200</SelectItem>
                    <SelectItem value="all">All</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-gray-600">per page</span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={selectAll}
                  className="text-xs"
                >
                  Select All
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAll}
                  className="text-xs"
                >
                  Clear All
                </Button>
              </div>
            </div>
          </div>
          <div className="mt-2 flex justify-start">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Show only latest change per category per dog</span>
              <input
                type="checkbox"
                id="showLatestOnly"
                checked={showLatestOnly}
                onChange={(e) => setShowLatestOnly(e.target.checked)}
                className="h-4 w-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full table-fixed">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24 border-r border-gray-200">
                      Timestamp
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-32 border-r border-gray-200">
                      Animal
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-32 whitespace-nowrap border-r border-gray-200">
                      Current
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-40 whitespace-nowrap border-r border-gray-200">
                      Update
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                      Comment
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-20 border-r border-gray-200">
                      Type
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                      Select
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAndSortedData.map((item, index) => (
                    <tr key={item.comment_gid} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-4 text-sm text-gray-900 text-center w-24 border-r border-gray-200">
                        <div className="whitespace-pre-line text-center text-xs">
                          {formatDate(item.created_at)}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 text-center border-r border-gray-200">
                        <div>
                          <div className="font-medium">{cleanName(item.name || '')}</div>
                          <div className="text-xs text-gray-500">
                            {(() => {
                              if (item.shelter_location === 'DCAS') {
                                return 'Dekalb';
                              } else if (item.shelter_location === 'FCAS') {
                                return 'Fulton';
                              } else if (item.shelter_location === 'CAC') {
                                return 'CAC';
                              } else {
                                return item.shelter_location || 'Unknown';
                              }
                            })()}
                          </div>
                          {item.foster_status && (
                            <div className="text-xs text-gray-500">
                              {item.foster_status}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 text-center whitespace-nowrap w-32 border-r border-gray-200">
                        <div className="three-line-ellipsis text-xs" title={item.current_value}>
                          {item.current_value || 'N/A'}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 text-center w-40 border-r border-gray-200">
                        <div className="text-xs text-gray-500 mb-2 leading-tight min-h-[2.5rem] flex items-center justify-center">
                          {item.proposed_value || 'N/A'}
                        </div>
                        <Select 
                          value={overriddenValues[item.comment_gid] || 'Override'} 
                          onValueChange={(value) => handleOverrideChange(item.comment_gid, value)}
                        >
                          <SelectTrigger className="w-full mx-1 h-8 text-xs" style={{ textAlign: 'center' }}>
                            <SelectValue placeholder="Override..." />
                          </SelectTrigger>
                          <SelectContent className="max-h-60">
                            {getCategoryOptions(item.asana_category).map((option, index) => (
                              <SelectItem key={index} value={option} className="text-xs">
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 border-r border-gray-200">
                        <div className="whitespace-pre-wrap break-words text-xs leading-relaxed">
                          {item.comments_sanitized || 'No comments'}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 text-center border-r border-gray-200">
                        <div className="flex items-center justify-center" title={item.asana_category || 'Unknown'}>
                          {getCategoryIcon(item.asana_category)}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500 text-center">
                        <div className="flex justify-center">
                          <input
                            type="checkbox"
                            checked={selectedItems.has(item.comment_gid)}
                            onChange={() => toggleSelection(item.comment_gid)}
                            className="h-4 w-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-center gap-4">
          <Button 
            size="lg"
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 text-lg font-semibold"
            onClick={() => {
              const selectedChanges = filteredAndSortedData.filter(item => 
                selectedItems.has(item.comment_gid)
              );
              
              if (selectedChanges.length === 0) {
                alert('Please select at least one proposed change to review.');
                return;
              }
              
              // Create summary for selected changes
              let summary = `<table style="width: 100%; border-collapse: collapse; font-family: monospace; font-size: 14px;">
                <thead>
                  <tr style="background-color: #f3f4f6; border-bottom: 2px solid #d1d5db;">
                    <th style="padding: 12px; text-align: left; border: 1px solid #d1d5db; width: 15%;">Name</th>
                    <th style="padding: 12px; text-align: left; border: 1px solid #d1d5db; width: 8%;">ID</th>
                    <th style="padding: 12px; text-align: left; border: 1px solid #d1d5db; width: 10%;">Location</th>
                    <th style="padding: 12px; text-align: left; border: 1px solid #d1d5db; width: 18%;">Field</th>
                    <th style="padding: 12px; text-align: left; border: 1px solid #d1d5db; width: 20%;">Current Value</th>
                    <th style="padding: 12px; text-align: left; border: 1px solid #d1d5db; width: 20%;">Update Value</th>
                  </tr>
                </thead>
                <tbody>`;
              
              selectedChanges.forEach((change, index) => {
                const overriddenValue = overriddenValues[change.comment_gid];
                const finalProposedValue = overriddenValue && overriddenValue !== 'Override' ? overriddenValue : change.proposed_value;
                const location = change.shelter_location === 'DCAS' ? 'Dekalb' : 
                                change.shelter_location === 'FCAS' ? 'Fulton' : 
                                change.shelter_location === 'CAC' ? 'CAC' : 
                                change.shelter_location || 'Unknown';
                summary += `
                  <tr style="border-bottom: 1px solid #e5e7eb;">
                    <td style="padding: 12px; border: 1px solid #d1d5db;">${cleanName(change.name || '')}</td>
                    <td style="padding: 12px; border: 1px solid #d1d5db;">${change.animal_id || ''}</td>
                    <td style="padding: 12px; border: 1px solid #d1d5db;">${location}</td>
                    <td style="padding: 12px; border: 1px solid #d1d5db;">${change.asana_category || ''}</td>
                    <td style="padding: 12px; border: 1px solid #d1d5db;">${change.current_value || 'N/A'}</td>
                    <td style="padding: 12px; border: 1px solid #d1d5db;">${finalProposedValue || 'N/A'}</td>
                  </tr>`;
              });
              
              summary += `
                </tbody>
              </table>`;
              
              // Open new window with the summary
              const newWindow = window.open('', '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
              if (newWindow) {
                newWindow.document.write(`
                  <!DOCTYPE html>
                  <html lang="en">
                  <head>
                      <meta charset="UTF-8">
                      <meta name="viewport" content="width=device-width, initial-scale=1.0">
                      <title>📋 Asana Proposed Changes Summary</title>
                      <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📋</text></svg>">
                      <style>
                          body {
                              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                              line-height: 1.6;
                              margin: 0;
                              padding: 20px;
                              background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
                              min-height: 100vh;
                          }
                          .container {
                              max-width: 1200px;
                              margin: 0 auto;
                              background: white;
                              border-radius: 12px;
                              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                              overflow: hidden;
                          }
                          .header {
                              background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                              color: white;
                              padding: 20px;
                              text-align: center;
                          }
                          .header h1 {
                              margin: 0;
                              font-size: 24px;
                              font-weight: bold;
                          }
                          .content {
                              padding: 20px;
                          }
                          .text-box {
                              background: #f8fafc;
                              border: 2px solid #e2e8f0;
                              border-radius: 8px;
                              padding: 20px;
                              font-size: 14px;
                              line-height: 1.6;
                              color: #374151;
                              min-height: 400px;
                              overflow-y: auto;
                          }
                          .copy-button {
                              background: #3b82f6;
                              color: white;
                              border: none;
                              padding: 12px 24px;
                              border-radius: 6px;
                              cursor: pointer;
                              font-weight: 500;
                              margin-top: 15px;
                              width: 100%;
                          }
                          .copy-button:hover {
                              background: #2563eb;
                          }
                          .footer {
                              text-align: center;
                              padding: 20px;
                              color: #6b7280;
                              font-size: 14px;
                              border-top: 1px solid #e5e7eb;
                          }
                      </style>
                  </head>
                  <body>
                      <div class="container">
                          <div class="header">
                              <h1>📋 Asana Proposed Changes Summary</h1>
                          </div>
                          <div class="content">
                              <div class="text-box" id="copyText">${summary}</div>
                              <button class="copy-button" onclick="copyToClipboard()">Push Change (currently copy to clipboard)</button>
                          </div>
                          <div class="footer">
                              <p>Generated by Paw Poster • Review proposed changes from Asana</p>
                          </div>
                      </div>
                      
                      <script>
                          function copyToClipboard() {
                              const textBox = document.getElementById('copyText');
                              const text = textBox.textContent || textBox.innerText;
                              
                              navigator.clipboard.writeText(text).then(function() {
                                  const button = document.querySelector('.copy-button');
                                  button.textContent = '✅ Copied!';
                                  button.style.background = '#10b981';
                                  
                                  setTimeout(function() {
                                      button.textContent = 'Push Change (currently copy to clipboard)';
                                      button.style.background = '#3b82f6';
                                  }, 2000);
                              }).catch(function(err) {
                                  console.error('Could not copy text: ', err);
                                  alert('Copy failed. Please manually select and copy the text.');
                              });
                          }
                      </script>
                  </body>
                  </html>
                `);
                newWindow.document.close();
              }
            }}
          >
            📋 Review Selected Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AsanaChanges; 