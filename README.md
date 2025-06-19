# Loveable - Dog Adoption Platform

A React-based dog adoption platform built with Vite, TypeScript, and Tailwind CSS. This project helps users browse and find adoptable dogs from a Neon PostgreSQL database.

## 🚀 Live Demo

**GitHub Pages**: [https://dekalblovable.github.io/loveable/](https://dekalblovable.github.io/loveable/)

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI**: shadcn/ui, Tailwind CSS, Radix UI
- **Database**: Neon PostgreSQL
- **State Management**: TanStack Query (React Query)
- **Deployment**: GitHub Pages + GitHub Actions

## 📁 Project Structure

```
src/
├── app/                    # API routes (Next.js style)
│   └── api/dogs/          # Dog API endpoints
├── components/            # React components
├── lib/                   # Utilities and database connections
│   ├── neon.ts           # Server-side Neon connection
│   └── neon-api.ts       # Client-side Neon connection
├── pages/                # Page components
├── hooks/                # Custom React hooks
├── types/                # TypeScript type definitions
└── utils/                # Utility functions
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

## 🔧 Environment Variables

### Local Development
- `VITE_NEON_CONNECTION_STRING`: Neon database connection string for client-side access

### Production (GitHub Pages)
- `VITE_NEON_CONNECTION_STRING`: Set in GitHub Actions workflow from GitHub secrets
- `NEON_CONNECTION_STRING`: For server-side API routes (if using backend)

## 🗄️ Database

This project uses **Neon PostgreSQL** for storing dog adoption data. The database schema includes:

- Dog profiles with photos, breed info, and adoption details
- Location and status information
- Behavioral traits and interaction notes
- Medical and vaccination records

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

## 🎨 Features

- **Dog Browsing**: View all available dogs with photos and details
- **Search & Filter**: Filter by breed, location, and other criteria
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Data**: Fetches live data from Neon database
- **Modern UI**: Built with shadcn/ui and Tailwind CSS

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🔗 Links

- **Project URL**: https://lovable.dev/projects/896121c9-0ef4-4211-8435-2c032456a696
- **Live Demo**: https://dekalblovable.github.io/loveable/
- **GitHub Repository**: https://github.com/dekalblovable/loveable
