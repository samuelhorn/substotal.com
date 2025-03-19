'use client';

import { useEffect } from 'react';
import { useSubscriptions } from './app-provider';

/**
 * This component automatically loads data when it mounts.
 * It's specifically designed to solve the issue where navigation after 
 * authentication doesn't trigger data loading.
 */
export function AutoDataLoader() {
  const { refreshData } = useSubscriptions();

  useEffect(() => {
    // Simple approach: Just load data once when this component mounts
    refreshData();
  }, [refreshData]);

  return null; // This component doesn't render anything
}