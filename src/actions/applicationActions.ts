
'use server';

import { getApplicationsCollection, getProgramsCollection, getUsersCollection } from '@/lib/mongodb';
import type { Application, Program, User } from '@/types';
import { sendApplicationSubmittedEmail, sendApplicationStatusUpdateEmail } from './emailActions';
import { ObjectId } from 'mongodb';

export async function createApplicationAction(
  programId: string,
  userId: string,
  formData: Omit<Application, 'id' | '_id' | 'userId' | 'programId' | 'status' | 'referenceNumber' | 'submissionDate' | 'programTitle' | 'applicantEmail' >
): Promise<Application | null> {
  const applicationsCollection = await getApplicationsCollection();
  const programsCollection = await getProgramsCollection();
  const usersCollection = await getUsersCollection();

  const program = await programsCollection.findOne({ _id: new ObjectId(programId) });
  if (!program) throw new Error('Program not found');

  const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
  if (!user) throw new Error('User not found');

  const newApplicationData: Omit<Application, 'id' | '_id'> = {
    userId: userId,
    programId: programId,
    programTitle: program.title,
    applicantEmail: user.email,
    ...formData,
    status: 'pending',
    referenceNumber: `LF${new Date().getFullYear()}${Math.floor(10000 + Math.random() * 90000)}`,
    submissionDate: new Date().toISOString(),
  };

  const result = await applicationsCollection.insertOne(newApplicationData as Application);
  
  if (result.insertedId) {
    const createdApplication = { ...newApplicationData, _id: result.insertedId, id: result.insertedId.toString() };
    
    // Send email notification (fire and forget for now)
    sendApplicationSubmittedEmail(user, program, createdApplication).catch(console.error);
    
    return createdApplication;
  }
  return null;
}

export async function getApplicationById(applicationId: string): Promise<Application | null> {
  if (!ObjectId.isValid(applicationId)) return null;
  const applicationsCollection = await getApplicationsCollection();
  const application = await applicationsCollection.findOne({ _id: new ObjectId(applicationId) });
  if (application) {
    return { ...application, id: application._id!.toString() };
  }
  return null;
}

export async function getProgramForApplication(programId: string): Promise<Program | null> {
    if (!ObjectId.isValid(programId)) return null;
    const programsCollection = await getProgramsCollection();
    const program = await programsCollection.findOne({ _id: new ObjectId(programId) });
    if (program) {
        return { ...program, id: program._id!.toString() };
    }
    return null;
}


export async function updateApplicationStatusAction(
  applicationId: string,
  status: 'approved' | 'denied',
  denialReason?: string,
  aiRecommendedPrograms?: string[]
): Promise<Application | null> {
  if (!ObjectId.isValid(applicationId)) throw new Error('Invalid Application ID');
  const applicationsCollection = await getApplicationsCollection();
  
  const updateDoc: Partial<Application> = { status };
  if (status === 'denied') {
    updateDoc.denialReason = denialReason;
    if (aiRecommendedPrograms) {
        updateDoc.aiRecommendedPrograms = aiRecommendedPrograms;
    }
  }

  const result = await applicationsCollection.findOneAndUpdate(
    { _id: new ObjectId(applicationId) },
    { $set: updateDoc },
    { returnDocument: 'after' }
  );

  const updatedApplication = result;

  if (updatedApplication) {
    // Send email notification
    // Need applicant email and program title - these should be on the application document ideally
    if (updatedApplication.applicantEmail && updatedApplication.programTitle) {
         sendApplicationStatusUpdateEmail(
            updatedApplication.applicantEmail,
            `${updatedApplication.personalDetails.firstName} ${updatedApplication.personalDetails.lastName}`,
            updatedApplication.programTitle,
            status,
            denialReason,
            aiRecommendedPrograms
        ).catch(console.error);
    } else {
        console.warn("Could not send status update email: missing applicantEmail or programTitle on application ID:", applicationId);
    }
    return { ...updatedApplication, id: updatedApplication._id!.toString() };
  }
  return null;
}

export async function getApplicationsByUserId(userId: string): Promise<Application[]> {
  if (!ObjectId.isValid(userId)) return [];
  const applicationsCollection = await getApplicationsCollection();
  const applications = await applicationsCollection.find({ userId: userId }).sort({ submissionDate: -1 }).toArray();
  return applications.map(app => ({ ...app, id: app._id!.toString() }));
}

export async function getAllApplicationsForCounselor(filters?: { status?: string }): Promise<Application[]> {
  const applicationsCollection = await getApplicationsCollection();
  const query: any = {};
  if (filters?.status && filters.status !== 'all') {
    query.status = filters.status;
  }
  const applications = await applicationsCollection.find(query).sort({ submissionDate: -1 }).toArray();
  return applications.map(app => ({ ...app, id: app._id!.toString() }));
}
