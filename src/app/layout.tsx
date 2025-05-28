export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* More aggressive critical CSS inlining */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Critical styles only */
            .text-xl { font-size: 1.25rem; line-height: 1.75rem; }
            .text-gray-600 { color: #4b5563; }
            .max-w-2xl { max-width: 42rem; }
            .mx-auto { margin-left: auto; margin-right: auto; }
            .mb-8 { margin-bottom: 2rem; }
            .font-inter { font-family: Inter, system-ui, sans-serif; }
            .hero-text { 
              font-display: swap; 
              contain: layout style paint;
              will-change: auto;
            }
            .text-4xl { font-size: 2.25rem; line-height: 2.5rem; }
            .font-bold { font-weight: 700; }
            .text-gray-900 { color: #111827; }
            .mb-4 { margin-bottom: 1rem; }
            .text-center { text-align: center; }
            .bg-white { background-color: #ffffff; }
            .shadow-sm { box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
            .py-12 { padding-top: 3rem; padding-bottom: 3rem; }
            .px-4 { padding-left: 1rem; padding-right: 1rem; }
            .max-w-7xl { max-width: 80rem; }
            .min-h-screen { min-height: 100vh; }
            .bg-gray-50 { background-color: #f9fafb; }
          `
        }} />
        
        {/* Preload critical fonts with higher priority */}
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap"
          as="style"
          onLoad="this.onload=null;this.rel='stylesheet'"
        />
        
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//images.unsplash.com" />
        
        {/* Preconnect to critical origins */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        
        {/* Preload critical resources */}
        <link
          rel="preload"
          href="/api/dogs"
          as="fetch"
          crossOrigin="anonymous"
        />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
} 