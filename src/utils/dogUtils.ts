export const parseAge = (ageString: string) => {
  if (!ageString) return 0;
  const match = ageString.match(/(\d+)\s*yr?\s*(\d+)?\s*mo?/);
  if (match) {
    const years = parseInt(match[1]) || 0;
    const months = parseInt(match[2]) || 0;
    return years * 12 + months; // Convert to total months
  }
  return 0;
};

export const formatLocation = (kennel: string, room: string) => {
  if (kennel === "Foster Care") {
    return "In Foster";
  }
  
  // Handle ISO Dogs pattern: ISO16 • ISO Dogs -> ISO Dogs 16
  if (kennel && kennel.startsWith("ISO") && room === "ISO Dogs") {
    const number = kennel.replace("ISO", "");
    return `ISO Dogs ${number}`;
  }
  
  // Handle ISO Puppies pattern: IsoP16 • ISO Puppies -> ISO Puppies 16
  if (kennel && kennel.startsWith("IsoP") && room === "ISO Puppies") {
    const number = kennel.replace("IsoP", "");
    return `ISO Puppies ${number}`;
  }
  
  // Handle Cat Hold pattern: Cat Holding (79) 06 • Cat Hold(79) -> Cat Holdings (79) - 06
  if (kennel && kennel.includes("Cat Holding") && room && room.includes("Cat Hold")) {
    const kennelMatch = kennel.match(/Cat Holding \((\d+)\) (\d+)/);
    const roomMatch = room.match(/Cat Hold\((\d+)\)/);
    if (kennelMatch && roomMatch) {
      const [, kennelNum, roomNum] = kennelMatch;
      return `Cat Holdings (${kennelNum}) - ${roomNum}`;
    }
  }
  
  // Handle Dog Hold pattern: Hold15 • Dog Hold -> Dog Holding 15
  if (kennel && kennel.startsWith("Hold") && room === "Dog Hold") {
    const number = kennel.replace("Hold", "");
    return `Dog Holding ${number}`;
  }
  
  // Handle Bonding Rooms pattern: Bonding Rooms A1C -> Bonding Rooms A1 - C
  if (kennel && kennel.startsWith("Bonding Rooms") && (room === "Bonding Rooms" || !room)) {
    const match = kennel.match(/Bonding Rooms ([A-Z]\d+)([A-Z])/);
    if (match) {
      const [, roomNumber, section] = match;
      return `Bonding Rooms ${roomNumber} - ${section}`;
    }
    return kennel; // fallback if pattern doesn't match
  }
  
  // Handle Hall Crate pattern: extract the specific crate info
  if (kennel && kennel.includes("Hall Crate")) {
    // Handle both "Hall Crate Hall Crate 34-B" and "Hall Crate Hall Crate 32- B • Hall Crate"
    if (room === "Hall Crate" || !room) {
      // Remove duplicate "Hall Crate" and extract the crate number
      let cleaned = kennel.replace(/^Hall Crate\s+Hall Crate\s+/, "Hall Crate ");
      // Add spaces around dashes: 34-B -> 34 - B
      cleaned = cleaned.replace(/(\d+)-([A-Z])/g, '$1 - $2');
      return cleaned;
    }
  }
  
  // Handle "Adopt Dogs" ranges - extract just the kennel number
  if (room && room.includes("Adopt Dogs")) {
    // If kennel matches the pattern (like A09, B28, C39), just show the kennel
    if (kennel && kennel.match(/^[A-Z]\d+/)) {
      // Format as C - 39 instead of C39
      const formatted = kennel.replace(/^([A-Z])(\d+)/, '$1 - $2');
      return formatted;
    }
  }
  
  // Default behavior for other locations
  if (room && room !== kennel) {
    return `${kennel} • ${room}`;
  }
  
  return kennel;
};

// Create a shared utilities file
export const getImageUrl = (photoUrl: string) => {
  if (!photoUrl || photoUrl.trim() === '' || photoUrl === 'N/A') {
    return 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop&crop=face';
  }
  
  const cleanUrl = photoUrl.trim();
  
  if (cleanUrl.includes('petango.com')) {
    return cleanUrl;
  }
  
  if (cleanUrl.includes('drive.google.com')) {
    const fileId = cleanUrl.match(/\/d\/([a-zA-Z0-9-_]+)/)?.[1];
    return fileId ? `https://drive.google.com/uc?id=${fileId}` : 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop&crop=face';
  }
  
  return cleanUrl;
};

export const getLevelColor = (level: number) => {
  switch (level) {
    case 1: return "bg-green-100 text-green-800 border-green-300";
    case 2: return "bg-yellow-100 text-yellow-800 border-yellow-300";
    case 3: return "bg-red-100 text-red-800 border-red-300";
    default: return "bg-gray-100 text-gray-800 border-gray-300";
  }
};

export const getGenderIcon = (gender: string) => {
  if (gender.toLowerCase() === 'male') {
    return { icon: '♂', className: 'text-blue-500 text-lg' };
  } else if (gender.toLowerCase() === 'female') {
    return { icon: '♀', className: 'text-pink-500 text-lg' };
  }
  return null;
}; 