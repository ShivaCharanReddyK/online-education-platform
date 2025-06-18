
'use server';

import type { Application, Program, User } from '@/types';
import { sendApplicationSubmittedEmail, sendApplicationStatusUpdateEmail } from './emailActions';
import { getProgramById } from './programActions';
import { getUserById } from './userActions';

// Mock applications DB (in-memory for server actions)
let MOCK_APPLICATIONS_DB: Application[] = [];

export async function createApplicationAction(
  programId: string,
  userId: string,
  formData: Omit<Application, 'id' | 'userId' | 'programId' | 'status' | 'referenceNumber' | 'submissionDate' | 'programTitle' | 'applicantEmail' >
): Promise<Application | null> {
  
  const program = await getProgramById(programId);
  if (!program) throw new Error('Program not found');

  const user = await getUserById(userId);
  if (!user) throw new Error('User not found');

  const newApplication: Application = {
    id: `app-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    userId: userId,
    programId: programId,
    programTitle: program.title,
    applicantEmail: user.email,
    ...formData,
    status: 'pending',
    referenceNumber: `LF${new Date().getFullYear()}${Math.floor(10000 + Math.random() * 90000)}`,
    submissionDate: new Date().toISOString(),
  };

  MOCK_APPLICATIONS_DB.push(newApplication);
  
  // Send email notification (simulated)
  sendApplicationSubmittedEmail(user, program, newApplication).catch(console.error);
    
  return JSON.parse(JSON.stringify(newApplication)); // Deep copy
}

export async function getApplicationById(applicationId: string): Promise<Application | null> {
  const application = MOCK_APPLICATIONS_DB.find(app => app.id === applicationId);
  return application ? JSON.parse(JSON.stringify(application)) : null;
}

export async function getProgramForApplication(programId: string): Promise<Program | null> {
    // This function was originally for fetching from DB, now it can use programActions
    return getProgramById(programId);
}


export async function updateApplicationStatusAction(
  applicationId: string,
  status: 'approved' | 'denied',
  denialReason?: string,
  aiRecommendedPrograms?: string[]
): Promise<Application | null> {
  const appIndex = MOCK_APPLICATIONS_DB.findIndex(app => app.id === applicationId);
  if (appIndex === -1) throw new Error('Application not found');

  const application = MOCK_APPLICATIONS_DB[appIndex];
  application.status = status;
  if (status === 'denied') {
    application.denialReason = denialReason;
    if (aiRecommendedPrograms) {
        application.aiRecommendedPrograms = aiRecommendedPrograms;
    }
  }
  
  MOCK_APPLICATIONS_DB[appIndex] = application;

  if (application.applicantEmail && application.programTitle) {
     sendApplicationStatusUpdateEmail(
        application.applicantEmail,
        `${application.personalDetails.firstName} ${application.personalDetails.lastName}`,
        application.programTitle,
        status,
        denialReason,
        aiRecommendedPrograms
    ).catch(console.error);
  } else {
    console.warn("Could not send status update email: missing applicantEmail or programTitle on application ID:", applicationId);
  }
  return JSON.parse(JSON.stringify(application));
}

export async function getApplicationsByUserId(userId: string): Promise<Application[]> {
  const applications = MOCK_APPLICATIONS_DB.filter(app => app.userId === userId).sort((a, b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime());
  return JSON.parse(JSON.stringify(applications));
}

export async function getAllApplicationsForCounselor(filters?: { status?: string }): Promise<Application[]> {
  let applications = [...MOCK_APPLICATIONS_DB];
  if (filters?.status && filters.status !== 'all') {
    applications = applications.filter(app => app.status === filters.status);
  }
  applications.sort((a, b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime());
  return JSON.parse(JSON.stringify(applications));
}
