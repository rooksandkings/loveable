          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="pl-10 pr-4 py-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-700 min-w-[140px] appearance-none"
            >
              <option value="name">Name</option>
              <option value="age">Age</option>
              <option value="size">Size</option>
              <option value="level">Level</option>
              <option value="weight">Weight</option>
              <option value="dftdEligible">DFTD Eligible</option>
            </select>
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
              </svg>
            </div>
          </div> 

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

const sortedDogs = React.useMemo(() => {
  let sorted = [...filteredDogs];
  
  switch (sortBy) {
    case 'name':
      sorted.sort((a, b) => a.Name.localeCompare(b.Name));
      break;
    case 'age':
      sorted.sort((a, b) => {
        const ageA = parseAge(a.Approx_Age);
        const ageB = parseAge(b.Approx_Age);
        return ageA - ageB;
      });
      break;
    case 'size':
      sorted.sort((a, b) => parseFloat(a.Weight) - parseFloat(b.Weight));
      break;
    case 'level':
      sorted.sort((a, b) => parseInt(a.Level) - parseInt(b.Level));
      break;
    default:
      break;
  }
  
  return sorted;
}, [filteredDogs, sortBy]); 