# Paw Poster - Dog Adoption & Management Platform

A comprehensive React-based dog adoption and management platform built with Vite, TypeScript, and Tailwind CSS. This project helps users browse adoptable dogs, manage Asana integration for dog data updates, and provides tools for shelter staff to track and manage dog information.

## 🚀 Live Demo

**GitHub Pages**: [https://dekalblovable.github.io/loveable/](https://dekalblovable.github.io/loveable/)

## 🎯 Features

### 🐕 Dog Adoption Platform
- **Browse Dogs**: View all available dogs with photos, breed info, and adoption details
- **Advanced Search & Filtering**: Filter by breed, location (DCAS, FCAS, CAC), foster status, and more
- **Multiple View Modes**: Card view and table view for different browsing preferences
- **Sorting Options**: Sort by name, age, size, level, weight, days in care, and DFTD eligibility
- **Responsive Design**: Optimized for desktop and mobile devices
- **Favorites System**: Save and track favorite dogs
- **Direct Adoption Links**: Quick access to adoption applications via Adopets URLs

### 📋 Asana Comment Management
- **Proposed Changes Review**: Review and manage proposed changes from Asana comments
- **Category-based Filtering**: Filter by behavioral categories (crate training, leash skills, dog/cat/kid interactions, etc.)
- **Location Filtering**: Filter by shelter location (DCAS, FCAS, CAC)
- **Bulk Selection**: Select multiple changes for batch review
- **Override System**: Override proposed values with predefined options
- **Summary Generation**: Generate formatted summaries of selected changes
- **Asana Integration**: Direct links to Asana tasks for each proposed change
- **Latest Changes Only**: Option to show only the most recent change per category per dog

### 🎨 Modern UI/UX
- **Beautiful Design**: Gradient backgrounds and modern card layouts
- **Icon System**: Lucide React icons for intuitive navigation
- **Loading States**: Smooth loading experiences with skeleton screens
- **Error Handling**: User-friendly error messages and retry options
- **Accessibility**: Built with accessibility best practices

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Framework**: shadcn/ui, Tailwind CSS, Radix UI
- **Database**: Neon PostgreSQL
- **State Management**: TanStack Query (React Query)
- **Icons**: Lucide React
- **Deployment**: GitHub Pages + GitHub Actions

## 📁 Project Structure

```
src/
├── components/            # Reusable React components
│   ├── ui/               # shadcn/ui components
│   ├── DogList.tsx       # Dog listing component
│   ├── BreedFilter.tsx   # Breed filtering component
│   └── FosterFilter.tsx  # Foster status filtering
├── lib/                  # Utilities and database connections
│   ├── neon-api.ts       # Database API functions
│   └── neon.ts           # Database connection utilities
├── pages/                # Page components
│   ├── Index.tsx         # Main dog browsing page
│   ├── AsanaChanges.tsx  # Asana comment management
│   └── Shorts.tsx        # Short-form content page
├── utils/                # Utility functions
│   └── dogUtils.ts       # Dog-related utility functions
└── types/                # TypeScript type definitions
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Neon PostgreSQL database

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/dekalblovable/loveable.git
   cd loveable
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the project root:
   ```env
   # For local development (client-side)
   VITE_NEON_CONNECTION_STRING=your-neon-connection-string
   
   # For server-side API routes (if using backend)
   NEON_CONNECTION_STRING=your-neon-connection-string
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173/loveable/`

## 🗄️ Database Schema

### Dogs Table
- **Basic Info**: Dog ID, name, breed, gender, age, weight
- **Photos**: Multiple mini photos for each dog
- **Location**: Kennel, room, shelter location (DCAS, FCAS, CAC)
- **Status**: Foster status, adoption status, medical status
- **Behavioral Traits**: Cuddle meter, kid/cat/dog interactions, potty skills, crate training, leash skills, energy level
- **Medical**: Vaccination dates, heartworm status, spay/neuter status
- **Adoption**: Adopets URL, adoption restrictions, DFTD eligibility

### Asana Proposed Changes Table
- **Change Tracking**: Comment GID, creation timestamp, category
- **Dog Association**: Animal ID, dog name, shelter location
- **Values**: Current value, proposed value, comments
- **Integration**: Asana permalink for direct task access

## 🎯 Key Features Explained

### Dog Browsing & Search
- **Search**: Search by dog name, breed, or ID
- **Breed Filtering**: Consolidated breed categories (Pit Bull, Labrador, etc.)
- **Location Filtering**: Filter by shelter and foster status
- **Sorting**: Multiple sort options including DFTD eligibility priority
- **Pagination**: Configurable items per page (25, 50, 100, 200, all)

### Asana Integration
- **Proposed Changes**: Review changes suggested in Asana comments
- **Category Management**: Organized by behavioral categories with icons
- **Bulk Operations**: Select multiple changes for batch processing
- **Override System**: Predefined options for each category
- **Summary Generation**: Formatted HTML summaries for review

### Data Management
- **Real-time Updates**: Live data from Neon database
- **Caching**: Optimized caching with TanStack Query
- **Error Handling**: Graceful error handling and retry logic
- **Performance**: Efficient filtering and sorting algorithms

## 🔧 Environment Variables

### Local Development
- `VITE_NEON_CONNECTION_STRING`: Neon database connection string for client-side access

### Production (GitHub Pages)
- `VITE_NEON_CONNECTION_STRING`: Set in GitHub Actions workflow from GitHub secrets
- `NEON_CONNECTION_STRING`: For server-side API routes (if using backend)

## 🚀 Deployment

### GitHub Pages (Current Setup)

The project is automatically deployed to GitHub Pages via GitHub Actions:

1. **Build Process**: Vite builds the project to `/dist`
2. **Environment Variables**: Injected from GitHub secrets during build
3. **Deployment**: Built files are deployed to GitHub Pages

### Alternative Deployment Options

For secure database access, consider deploying API routes to:
- **Vercel Functions**
- **Netlify Functions**
- **AWS Lambda**

## 🔒 Security Notes

⚠️ **Important**: The current setup exposes the Neon connection string to the client-side code. For production use with sensitive data:

1. **Use a backend service** for API routes
2. **Never expose database credentials** in client-side code
3. **Consider read-only access** for public data
4. **Implement proper authentication** for admin features

## 🎨 UI Components

### Design System
- **Color Scheme**: Orange/amber gradients for main pages, blue/indigo for admin pages
- **Typography**: Clean, readable fonts with proper hierarchy
- **Spacing**: Consistent spacing using Tailwind's spacing scale
- **Icons**: Lucide React icons for consistent visual language

### Responsive Design
- **Mobile First**: Optimized for mobile devices
- **Breakpoints**: Responsive design for tablet and desktop
- **Touch Friendly**: Large touch targets for mobile users

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use shadcn/ui components when possible
- Maintain consistent code formatting
- Add proper error handling
- Test on multiple devices and browsers

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🔗 Links

- **Project URL**: https://lovable.dev/projects/896121c9-0ef4-4211-8435-2c032456a696
- **Live Demo**: https://dekalblovable.github.io/loveable/
- **GitHub Repository**: https://github.com/dekalblovable/loveable

## 🙏 Acknowledgments

- Built for Dekalb County Animal Services and partner shelters
- Powered by Neon PostgreSQL for reliable data storage
- UI components from shadcn/ui and Radix UI
- Icons from Lucide React
