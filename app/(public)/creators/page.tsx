/**
 * Creators Listing Page
 * 
 * Public page displaying all available creators.
 * Mobile-only (desktop users are blocked).
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { useCreators } from '@/hooks/useFeed';
import { CreatorsGrid } from '@/components/creators-grid';
import { CreatorSearchFilters } from '@/components/creator-search-filters';
import { Header } from '@/components/layout/header';
import { Loader2 } from 'lucide-react';
import { Creator } from '@/services/feed';

export default function CreatorsPage() {
  const router = useRouter();
  const { isDesktop } = useDeviceDetection();
  const [isChecking, setIsChecking] = useState(true);
  const [filteredCreators, setFilteredCreators] = useState<Creator[]>([]);
  
  const { data: creators, isLoading, error, refetch } = useCreators();
  
  useEffect(() => {
    // Block desktop users
    if (isDesktop) {
      router.push('/desktop-block');
    } else {
      setIsChecking(false);
    }
  }, [isDesktop, router]);
  
  // Show loading while checking device
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  // Render creators grid for mobile/tablet users
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Creators Grid */}
      <div className="container mx-auto px-4 py-6">
        

        <div className="mb-5">
          <CreatorSearchFilters
            creators={creators}
            onFilteredCreatorsChange={setFilteredCreators}
          />
        </div>

        <CreatorsGrid
          creators={filteredCreators}
          isLoading={isLoading}
          error={error}
          refetch={refetch}
        />
      </div>
      
    </div>
  );
}
