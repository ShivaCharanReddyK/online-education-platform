
'use server';

import type { Program } from '@/types';
import { getPrograms, getProgramById as dbGetProgramById, seedPrograms } from '@/lib/database';

// Convert Database Program to App Program format
function dbProgramToAppProgram(dbProgram: any): Program {
  return {
    id: dbProgram._id.toString(),
    title: dbProgram.title,
    description: dbProgram.description,
    longDescription: dbProgram.longDescription,
    category: dbProgram.category,
    duration: dbProgram.duration,
    startDate: dbProgram.startDate,
    imageUrl: dbProgram.imageUrl,
    aiHint: dbProgram.aiHint,
    features: dbProgram.features,
    tuitionFee: dbProgram.tuitionFee,
    learningOutcomes: dbProgram.learningOutcomes,
    modules: dbProgram.modules
  }
}

export async function getAllPrograms(filters?: { 
  category?: string; 
  duration?: string; 
  startDate?: string; 
  searchTerm?: string;
  page?: number;
  limit?: number;
}): Promise<Program[]> {
  try {
    // Ensure programs are seeded
    await seedPrograms();
    
    const result = await getPrograms({
      category: filters?.category,
      search: filters?.searchTerm,
      page: filters?.page || 1,
      limit: filters?.limit || 50
    });

    return result.programs.map(dbProgramToAppProgram);
  } catch (error) {
    console.error('Get all programs error:', error);
    return [];
  }
}

export async function getProgramById(id: string): Promise<Program | null> {
  try {
    const dbProgram = await dbGetProgramById(id);
    return dbProgram ? dbProgramToAppProgram(dbProgram) : null;
  } catch (error) {
    console.error('Get program by ID error:', error);
    return null;
  }
}

// Ensure programs are seeded on startup
export async function seedProgramsIfEmpty(): Promise<void> {
  try {
    await seedPrograms();
    console.log('✅ Programs seeding check completed');
  } catch (error) {
    console.error('❌ Error during programs seeding:', error);
  }
}
