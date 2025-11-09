'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

const NavigationContext = createContext({});

export const NavigationProvider = ({ children }) => {
  const [isNavigating, setIsNavigating] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Stop loading when route changes
    setIsNavigating(false);
  }, [pathname, searchParams]);

  const startNavigating = () => {
    setIsNavigating(true);
  };

  return (
    <NavigationContext.Provider value={{ isNavigating, startNavigating }}>
      {/* Top Loading Bar - Subtle indicator */}
      {isNavigating && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <div className="h-1 bg-purple-600 animate-pulse">
            <div className="h-full bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600 animate-shimmer"></div>
          </div>
        </div>
      )}
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
};

