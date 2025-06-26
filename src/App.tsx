import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import N8nChatEmbed from "@/components/N8nChatEmbed";

// Optimize QueryClient configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60 * 6, // 6 hours
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
      refetchOnWindowFocus: false,
      retry: 1,
      refetchOnMount: false,
      refetchOnReconnect: false,
    },
  },
});

// Implement dynamic imports with better code splitting
const Index = lazy(() => 
  import(/* webpackChunkName: "index" */ "./pages/Index")
);
const Shorts = lazy(() => 
  import(/* webpackChunkName: "shorts" */ "./pages/Shorts")
);
const AsanaChanges = lazy(() => 
  import(/* webpackChunkName: "asana-changes" */ "./pages/AsanaChanges")
);
const NotFound = lazy(() => 
  import(/* webpackChunkName: "not-found" */ "./pages/NotFound")
);

// Optimize loading component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
  </div>
);

const Router = () => (
  <HashRouter>
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/shorts" element={<Shorts />} />
        <Route path="/asana-comment-management" element={<AsanaChanges />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  </HashRouter>
);

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
        <N8nChatEmbed />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
