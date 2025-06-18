
'use server';

import { getProgramsCollection, getDb } from '@/lib/mongodb';
import type { Program } from '@/types';
import { DUMMY_PROGRAMS as seedPrograms } from '@/lib/constants'; // For seeding
import { ObjectId } from 'mongodb';

// Function to seed programs if the collection is empty
export async function seedProgramsIfEmpty(): Promise<void> {
  const programsCollection = await getProgramsCollection();
  const count = await programsCollection.countDocuments();
  if (count === 0) {
    console.log('Programs collection is empty, seeding data...');
    // Remove any potential _id from seed data as MongoDB will generate them
    const programsToInsert = seedPrograms.map(({ id, ...rest }) => ({ ...rest, startDate: new Date(rest.startDate).toISOString() }));
    await programsCollection.insertMany(programsToInsert as any[]); // Cast to any because of _id
    console.log(`${programsToInsert.length} programs seeded.`);
  }
}

export async function getAllPrograms(filters?: { category?: string; duration?: string; startDate?: string; searchTerm?: string }): Promise<Program[]> {
  await seedProgramsIfEmpty(); // Ensure data exists for demo
  const programsCollection = await getProgramsCollection();
  
  const query: any = {};
  if (filters) {
    if (filters.category && filters.category !== 'All') {
      query.category = filters.category;
    }
    // Duration filtering needs to be more complex if based on string like "3-6 Months"
    // For now, we'll skip direct DB duration filtering unless it's stored in a queryable format
    // Or, implement getDurationCategory logic here or fetch all and filter in memory for simplicity.

    if (filters.startDate) {
      query.startDate = { $gte: new Date(filters.startDate).toISOString() };
    }
    if (filters.searchTerm) {
      query.$or = [
        { title: { $regex: filters.searchTerm, $options: 'i' } },
        { description: { $regex: filters.searchTerm, $options: 'i' } },
        { category: { $regex: filters.searchTerm, $options: 'i' } },
      ];
    }
  }

  const programs = await programsCollection.find(query).toArray();
  return programs.map(program => ({ ...program, id: program._id!.toString() }));
}

export async function getProgramById(id: string): Promise<Program | null> {
  await seedProgramsIfEmpty(); // Ensure data exists for demo
  if (!ObjectId.isValid(id)) {
      console.error("Invalid Program ID format:", id);
      return null;
  }
  const programsCollection = await getProgramsCollection();
  const program = await programsCollection.findOne({ _id: new ObjectId(id) });
  if (program) {
    return { ...program, id: program._id!.toString() };
  }
  return null;
}
