'use client';

import { useRouter } from 'next/navigation';
import { useNavigation } from '@/contexts/NavigationContext';

/**
 * Custom hook for navigation with loading indicator
 */
export function useSmoothNavigation() {
  const router = useRouter();
  const { startNavigating } = useNavigation();

  const navigate = (path, options = {}) => {
    const { replace = false } = options;
    
    // Show loading bar
    startNavigating();
    
    // Navigate immediately - loading bar will show until route changes
    if (replace) {
      router.replace(path);
    } else {
      router.push(path);
    }
  };

  return { navigate };
}

