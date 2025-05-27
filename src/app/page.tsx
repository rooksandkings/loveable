          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="age">Age</SelectItem>
              <SelectItem value="size">Size</SelectItem>
              <SelectItem value="level">Level</SelectItem>
            </SelectContent>
          </Select> 

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