
"use client";

import { useState, useMemo, useEffect, useCallback } from 'react';
import { MainLayout } from '@/components/shared/MainLayout';
import { ProgramCard } from '@/components/programs/ProgramCard';
import { ProgramFilter } from '@/components/programs/ProgramFilter';
import { getDurationCategory, DUMMY_PROGRAMS as FallbackPrograms } from '@/lib/constants'; // Keep DUMMY for fallback/structure
import type { Program } from '@/types';
import { Button } from '@/components/ui/button';
import { Loader2, SearchX } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getAllPrograms } from '@/actions/programActions';

const ITEMS_PER_PAGE = 6;

export default function ProgramsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [allPrograms, setAllPrograms] = useState<Program[]>([]);
  const [isLoadingPrograms, setIsLoadingPrograms] = useState(true);

  const [filters, setFilters] = useState(() => {
    return {
      category: searchParams.get('category') || 'All',
      duration: searchParams.get('duration') || 'All',
      startDate: searchParams.get('startDate') || '',
      searchTerm: searchParams.get('searchTerm') || '',
    };
  });
  
  const [displayedItems, setDisplayedItems] = useState(ITEMS_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState(false); 

  const fetchPrograms = useCallback(async (currentFilters: typeof filters) => {
    setIsLoadingPrograms(true);
    try {
      const programs = await getAllPrograms(currentFilters);
      setAllPrograms(programs);
    } catch (error) {
      console.error("Failed to fetch programs:", error);
      setAllPrograms(FallbackPrograms); 
    }
    setIsLoadingPrograms(false);
  }, []); 

  useEffect(() => {
    fetchPrograms(filters);
  }, [filters, fetchPrograms]);


  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.category !== 'All') params.set('category', filters.category);
    if (filters.duration !== 'All') params.set('duration', filters.duration);
    if (filters.startDate) params.set('startDate', filters.startDate);
    if (filters.searchTerm) params.set('searchTerm', filters.searchTerm);
    router.replace(`/programs?${params.toString()}`, { scroll: false });
  }, [filters, router]);


  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setDisplayedItems(ITEMS_PER_PAGE); 
  };

  const filteredPrograms = useMemo(() => {
    return allPrograms.filter(program => {
      const categoryMatch = filters.category === 'All' || program.category === filters.category;
      const durationMatch = filters.duration === 'All' || (program.duration && getDurationCategory(program.duration) === filters.duration);
      const startDateMatch = !filters.startDate || new Date(program.startDate) >= new Date(filters.startDate);
      const searchTermMatch = !filters.searchTerm || 
        program.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        program.description.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        program.category.toLowerCase().includes(filters.searchTerm.toLowerCase());
      return categoryMatch && durationMatch && startDateMatch && searchTermMatch;
    });
  }, [filters, allPrograms]);

  const currentPrograms = filteredPrograms.slice(0, displayedItems);

  const loadMore = () => {
    setIsLoadingMore(true); 
    // No artificial delay, simply update the displayed items
    setDisplayedItems(prev => prev + ITEMS_PER_PAGE);
    setIsLoadingMore(false); 
  };
  
  if (isLoadingPrograms && allPrograms.length === 0) {
    return (
      <MainLayout>
        <div className="container mx-auto py-12 px-4 md:px-6 flex justify-center items-center min-h-[calc(100vh-10rem)]">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
          <p className="ml-4 text-lg">Loading programs...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4 md:px-6">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight font-headline">Explore Our Programs</h1>
          <p className="mt-2 text-lg text-muted-foreground">Find the perfect program to kickstart or advance your career.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <ProgramFilter onFilterChange={handleFilterChange} initialFilters={filters} />
          </aside>

          <main className="lg:col-span-3">
            {currentPrograms.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {currentPrograms.map(program => (
                  <ProgramCard key={program.id} program={program} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-10 text-center bg-card rounded-lg shadow-sm">
                <SearchX className="w-16 h-16 text-muted-foreground mb-4" />
                <h2 className="text-2xl font-semibold font-headline">No Programs Found</h2>
                <p className="text-muted-foreground mt-2">Try adjusting your filters or searching for different keywords.</p>
              </div>
            )}

            {filteredPrograms.length > displayedItems && (
              <div className="mt-8 text-center">
                <Button onClick={loadMore} disabled={isLoadingMore} size="lg">
                  {isLoadingMore ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    'Load More Programs'
                  )}
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </MainLayout>
  );
}
