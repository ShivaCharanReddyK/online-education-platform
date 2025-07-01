'use server';

import { ObjectId } from 'mongodb';
import type { Application, Program, User } from '@/types';
import { sendApplicationSubmittedEmail, sendApplicationStatusUpdateEmail } from './emailActions';
import { getProgramById } from './programActions';
import { getUserById } from './userActions';
import { 
  createApplication, 
  getApplicationsByUserId as dbGetApplicationsByUserId, 
  getAllApplications, 
  updateApplicationStatus,
  deleteApplication,
  checkExistingApplications
} from '@/lib/database';
import type { DbApplication } from '@/lib/models';

// Convert Database Application to App Application format
function dbApplicationToAppApplication(dbApp: DbApplication): Application {
  return {
    id: dbApp._id!.toString(),
    userId: dbApp.userId.toString(),
    programId: dbApp.programId.toString(),
    programTitle: dbApp.programTitle,
    applicantEmail: dbApp.applicantEmail,
    personalDetails: dbApp.personalDetails,
    educationalBackground: dbApp.educationalBackground,
    statementOfPurpose: dbApp.statementOfPurpose,
    status: dbApp.status,
    denialReason: dbApp.denialReason,
    aiRecommendedPrograms: dbApp.aiRecommendedPrograms,
    referenceNumber: dbApp.referenceNumber,
    submissionDate: dbApp.submissionDate
  };
}

export async function createApplicationAction(
  programId: string,
  userId: string,
  formData: Omit<Application, 'id' | 'userId' | 'programId' | 'status' | 'referenceNumber' | 'submissionDate' | 'programTitle' | 'applicantEmail' >
): Promise<Application | null> {
  try {
    const program = await getProgramById(programId);
    if (!program) throw new Error('Program not found');

    const user = await getUserById(userId);
    if (!user) throw new Error('User not found');

    const referenceNumber = `LF${new Date().getFullYear()}${Math.floor(10000 + Math.random() * 90000)}`;
    
    const applicationData: Omit<DbApplication, '_id' | 'createdAt' | 'updatedAt'> = {
      userId: new ObjectId(userId),
      programId: new ObjectId(programId),
      programTitle: program.title,
      applicantEmail: user.email,
      personalDetails: formData.personalDetails,
      educationalBackground: formData.educationalBackground,
      statementOfPurpose: formData.statementOfPurpose,
      status: 'pending',
      referenceNumber,
      submissionDate: new Date().toISOString()
    };

    const result = await createApplication(applicationData);
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to create application');
    }

    // Get the created application
    const applications = await dbGetApplicationsByUserId(userId);
    const newApplication = applications.find(app => app.referenceNumber === referenceNumber);
    
    if (!newApplication) {
      throw new Error('Application created but could not retrieve');
    }

    // Send email notification
    const appForEmail = dbApplicationToAppApplication(newApplication);
    sendApplicationSubmittedEmail(user, program, appForEmail).catch(console.error);
    
    return appForEmail;
  } catch (error) {
    console.error('Create application error:', error);
    throw error;
  }
}

export async function getApplicationById(applicationId: string): Promise<Application | null> {
  try {
    const allApplicationsResult = await getAllApplications();
    const application = allApplicationsResult.applications.find(app => app._id!.toString() === applicationId);
    
    return application ? dbApplicationToAppApplication(application) : null;
  } catch (error) {
    console.error('Get application by ID error:', error);
    return null;
  }
}

export async function getApplicationsByUserId(userId: string): Promise<Application[]> {
  try {
    const dbApplications = await dbGetApplicationsByUserId(userId);
    return dbApplications.map(dbApplicationToAppApplication);
  } catch (error) {
    console.error('Get applications by user ID error:', error);
    return [];
  }
}

export async function getAllApplicationsForCounselor(): Promise<Application[]> {
  try {
    const result = await getAllApplications();
    return result.applications.map(dbApplicationToAppApplication);
  } catch (error) {
    console.error('Get all applications error:', error);
    return [];
  }
}

export async function updateApplicationStatusAction(
  applicationId: string,
  status: 'approved' | 'denied',
  counselorNotes?: string,
  denialReason?: string,
  aiRecommendedPrograms?: string[]
): Promise<{ success: boolean; message?: string }> {
  try {
    // For better clarity, log what we're doing
    console.log(`Updating application ${applicationId} status to ${status}`);
    if (denialReason) console.log(`Denial reason: ${denialReason}`);
    if (aiRecommendedPrograms?.length) console.log(`AI recommendations: ${aiRecommendedPrograms.join(', ')}`);
    
    const result = await updateApplicationStatus(
      applicationId,
      status,
      counselorNotes,
      denialReason,
      aiRecommendedPrograms
    );

    if (result.success) {
      const application = await getApplicationById(applicationId);
      if (application) {
        const user = await getUserById(application.userId);
        const program = await getProgramById(application.programId);
        
        if (user && program) {
          if (status === 'approved') {
            sendApplicationStatusUpdateEmail(user.email, program.title, application.referenceNumber, 'approved').catch(console.error);
          } else {
            sendApplicationStatusUpdateEmail(user.email, program.title, application.referenceNumber, 'denied', denialReason, aiRecommendedPrograms).catch(console.error);
          }
        }
      }
    }

    return result;
  } catch (error) {
    console.error('Update application status error:', error);
    return { success: false, message: 'Failed to update application status' };
  }
}

export async function getProgramForApplication(programId: string): Promise<Program | null> {
  return await getProgramById(programId);
}

export async function deleteApplicationAction(applicationId: string): Promise<{ success: boolean; message?: string }> {
  try {
    const result = await deleteApplication(applicationId);
    return result;
  } catch (error) {
    console.error('Delete application error:', error);
    return { success: false, message: 'Failed to delete application' };
  }
}

export async function checkUserApplicationStatus(userId: string, programId: string): Promise<{ 
  canApply: boolean; 
  message?: string;
  existingStatus?: string;
  applicationId?: string;
}> {
  try {
    const result = await checkExistingApplications(userId, programId);
    
    if (!result.exists) {
      return { canApply: true };
    }
    
    // User already has an application for this program
    if (result.status === 'approved') {
      return { 
        canApply: false, 
        message: 'You are already enrolled in this program.',
        existingStatus: result.status,
        applicationId: result.applicationId
      };
    }
    
    return { 
      canApply: false, 
      message: `You already have a ${result.status} application for this program.`,
      existingStatus: result.status,
      applicationId: result.applicationId
    };
  } catch (error) {
    console.error('Check application status error:', error);
    return { canApply: true }; // Default to allowing application on error
  }
}
