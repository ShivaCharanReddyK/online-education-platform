'use server';

import { getProgramsCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import type { Program } from '@/types';
import type { DbProgram, ProgramFilters, PaginatedResponse } from '@/lib/models';
import { DUMMY_PROGRAMS } from '@/lib/constants';

// Convert Database Program to App Program format
function dbProgramToAppProgram(dbProgram: DbProgram): Program {
  return {
    id: dbProgram._id?.toString() || '',
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
    modules: dbProgram.modules,
  };
}

// Seed database with initial programs if empty
export async function seedProgramsIfEmpty(): Promise<void> {
  try {
    const programs = await getProgramsCollection();
    const count = await programs.countDocuments();
    
    if (count === 0) {
      console.log('🌱 Seeding database with initial programs...');
      
      const seedData: Omit<DbProgram, '_id'>[] = DUMMY_PROGRAMS.map(program => ({
        ...program,
        currentEnrollment: 0,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
      
      await programs.insertMany(seedData);
      console.log(`✅ Seeded ${seedData.length} programs`);
    }
  } catch (error) {
    console.error('❌ Error seeding programs:', error);
  }
}

export async function getAllPrograms(filters?: ProgramFilters): Promise<Program[]> {
  try {
    await seedProgramsIfEmpty();
    
    const programs = await getProgramsCollection();
    const query: any = { isActive: true };
    
    // Apply filters
    if (filters?.category && filters.category !== 'All') {
      query.category = filters.category;
    }
    
    if (filters?.searchTerm) {
      query.$or = [
        { title: { $regex: filters.searchTerm, $options: 'i' } },
        { description: { $regex: filters.searchTerm, $options: 'i' } },
        { category: { $regex: filters.searchTerm, $options: 'i' } },
      ];
    }
    
    if (filters?.startDate) {
      query.startDate = { $gte: filters.startDate };
    }
    
    if (filters?.minPrice || filters?.maxPrice) {
      query.tuitionFee = {};
      if (filters.minPrice) query.tuitionFee.$gte = filters.minPrice;
      if (filters.maxPrice) query.tuitionFee.$lte = filters.maxPrice;
    }
    
    const dbPrograms = await programs
      .find(query)
      .sort({ createdAt: -1 })
      .toArray() as DbProgram[];
    
    return dbPrograms.map(dbProgramToAppProgram);
  } catch (error) {
    console.error('❌ Error fetching programs:', error);
    // Fallback to dummy data
    return DUMMY_PROGRAMS.map((p, index) => ({
      ...p,
      id: `prog-${index + 1}`,
    }));
  }
}

export async function getProgramsPaginated(filters?: ProgramFilters): Promise<PaginatedResponse<Program>> {
  try {
    await seedProgramsIfEmpty();
    
    const programs = await getProgramsCollection();
    const page = filters?.page || 1;
    const limit = filters?.limit || 6;
    const skip = (page - 1) * limit;
    
    const query: any = { isActive: true };
    
    // Apply same filters as getAllPrograms
    if (filters?.category && filters.category !== 'All') {
      query.category = filters.category;
    }
    
    if (filters?.searchTerm) {
      query.$or = [
        { title: { $regex: filters.searchTerm, $options: 'i' } },
        { description: { $regex: filters.searchTerm, $options: 'i' } },
        { category: { $regex: filters.searchTerm, $options: 'i' } },
      ];
    }
    
    if (filters?.startDate) {
      query.startDate = { $gte: filters.startDate };
    }
    
    if (filters?.minPrice || filters?.maxPrice) {
      query.tuitionFee = {};
      if (filters.minPrice) query.tuitionFee.$gte = filters.minPrice;
      if (filters.maxPrice) query.tuitionFee.$lte = filters.maxPrice;
    }
    
    const [dbPrograms, total] = await Promise.all([
      programs
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray() as Promise<DbProgram[]>,
      programs.countDocuments(query)
    ]);
    
    const totalPages = Math.ceil(total / limit);
    
    return {
      data: dbPrograms.map(dbProgramToAppProgram),
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  } catch (error) {
    console.error('❌ Error fetching paginated programs:', error);
    const fallbackData = DUMMY_PROGRAMS.slice(0, filters?.limit || 6).map((p, index) => ({
      ...p,
      id: `prog-${index + 1}`,
    }));
    
    return {
      data: fallbackData,
      pagination: {
        page: 1,
        limit: filters?.limit || 6,
        total: fallbackData.length,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      },
    };
  }
}

export async function getProgramById(id: string): Promise<Program | null> {
  try {
    await seedProgramsIfEmpty();
    
    const programs = await getProgramsCollection();
    const dbProgram = await programs.findOne({ 
      _id: new ObjectId(id),
      isActive: true 
    }) as DbProgram | null;
    
    if (!dbProgram) {
      return null;
    }
    
    return dbProgramToAppProgram(dbProgram);
  } catch (error) {
    console.error('❌ Error fetching program by ID:', error);
    // Fallback to dummy data
    const dummyProgram = DUMMY_PROGRAMS.find((_, index) => `prog-${index + 1}` === id);
    return dummyProgram ? { ...dummyProgram, id } : null;
  }
}

export async function createProgram(programData: Omit<DbProgram, '_id' | 'createdAt' | 'updatedAt'>): Promise<{ success: boolean; programId?: string; error?: string }> {
  try {
    const programs = await getProgramsCollection();
    
    const newProgram: Omit<DbProgram, '_id'> = {
      ...programData,
      currentEnrollment: 0,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const result = await programs.insertOne(newProgram);
    
    return {
      success: true,
      programId: result.insertedId.toString(),
    };
  } catch (error) {
    console.error('❌ Error creating program:', error);
    return {
      success: false,
      error: 'Failed to create program',
    };
  }
}

export async function updateProgram(id: string, updates: Partial<DbProgram>): Promise<{ success: boolean; error?: string }> {
  try {
    const programs = await getProgramsCollection();
    
    const result = await programs.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          ...updates, 
          updatedAt: new Date() 
        } 
      }
    );
    
    if (result.matchedCount === 0) {
      return { success: false, error: 'Program not found' };
    }
    
    return { success: true };
  } catch (error) {
    console.error('❌ Error updating program:', error);
    return { success: false, error: 'Failed to update program' };
  }
}

export async function deleteProgram(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const programs = await getProgramsCollection();
    
    // Soft delete by setting isActive to false
    const result = await programs.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          isActive: false,
          updatedAt: new Date() 
        } 
      }
    );
    
    if (result.matchedCount === 0) {
      return { success: false, error: 'Program not found' };
    }
    
    return { success: true };
  } catch (error) {
    console.error('❌ Error deleting program:', error);
    return { success: false, error: 'Failed to delete program' };
  }
}

export async function getProgramCategories(): Promise<string[]> {
  try {
    const programs = await getProgramsCollection();
    const categories = await programs.distinct('category', { isActive: true });
    return categories;
  } catch (error) {
    console.error('❌ Error fetching categories:', error);
    return ['Technology', 'Marketing', 'Design', 'Business', 'Healthcare'];
  }
}
