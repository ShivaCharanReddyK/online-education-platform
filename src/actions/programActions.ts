
'use server';

import type { Program } from '@/types';
import { DUMMY_PROGRAMS as seedPrograms } from '@/lib/constants';

let programsCache: Program[] = seedPrograms.map((p, index) => ({
    ...p,
    id: `prog-${index + 1}`, // Ensure dummy programs have string IDs
    startDate: new Date(p.startDate).toISOString() // Ensure date is string
}));


export async function getAllPrograms(filters?: { category?: string; duration?: string; startDate?: string; searchTerm?: string }): Promise<Program[]> {
  // Basic filtering for mock data
  let filteredPrograms = [...programsCache];

  if (filters) {
    if (filters.category && filters.category !== 'All') {
      filteredPrograms = filteredPrograms.filter(p => p.category === filters.category);
    }
    if (filters.startDate) {
      filteredPrograms = filteredPrograms.filter(p => new Date(p.startDate) >= new Date(filters.startDate!));
    }
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filteredPrograms = filteredPrograms.filter(p => 
        p.title.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term)
      );
    }
    // Duration filter would need getDurationCategory logic here or be simpler
  }
  return JSON.parse(JSON.stringify(filteredPrograms)); // Simulate DB fetch (deep copy)
}

export async function getProgramById(id: string): Promise<Program | null> {
  const program = programsCache.find(p => p.id === id);
  return program ? JSON.parse(JSON.stringify(program)) : null;
}

// Seed function is not needed if not using a DB
export async function seedProgramsIfEmpty(): Promise<void> {
  // console.log("Using DUMMY_PROGRAMS directly, no seeding needed for mock implementation.");
  // If programsCache could be empty and needs initialization from DUMMY_PROGRAMS:
  if (programsCache.length === 0) {
      programsCache = seedPrograms.map((p, index) => ({
        ...p,
        id: `prog-${index + 1}`,
        startDate: new Date(p.startDate).toISOString()
    }));
  }
}
