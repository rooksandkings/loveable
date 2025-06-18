// Import only the icons you need
import {
  Check,
  X,
  ChevronDown,
  ChevronUp,
  Search,
  Menu,
  User,
  Settings,
  LogOut,
  // Add other icons as needed
} from 'lucide-react';

// Export icons as a named object for easier imports
export const Icons = {
  Check,
  X,
  ChevronDown,
  ChevronUp,
  Search,
  Menu,
  User,
  Settings,
  LogOut,
  // Add other icons as needed
} as const;

// Type for icon names
export type IconName = keyof typeof Icons; 