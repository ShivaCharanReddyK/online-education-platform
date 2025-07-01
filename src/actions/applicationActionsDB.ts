'use server';

import { getApplicationsCollection, getProgramsCollection, getUsersCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import type { Application } from '@/types';
import type { DbApplication, DbProgram, DbUser, ApplicationFilters, PaginatedResponse } from '@/lib/models';
import { sendEmail, emailTemplates } from '@/lib/email';

// Convert Database Application to App Application format
function dbApplicationToAppApplication(dbApp: DbApplication): Application {
  return {
    id: dbApp._id?.toString() || '',
    userId: dbApp.userId.toString(),
    programId: dbApp.programId.toString(),
    programTitle: dbApp.programTitle,
    applicantEmail: dbApp.applicantEmail,
    personalDetails: dbApp.personalDetails,
    educationalBackground: dbApp.educationalBackground,
    statementOfPurpose: dbApp.statementOfPurpose,
    status: dbApp.status,
    denialReason: dbApp.denialReason,
    referenceNumber: dbApp.referenceNumber,
    submissionDate: dbApp.submissionDate,
    aiRecommendedPrograms: dbApp.aiRecommendedPrograms,
  };
}

export async function createApplicationAction(
  programId: string,
  userId: string,
  formData: Omit<Application, 'id' | 'userId' | 'programId' | 'status' | 'referenceNumber' | 'submissionDate' | 'programTitle' | 'applicantEmail'>
): Promise<Application | null> {
  try {
    const applications = await getApplicationsCollection();
    const programs = await getProgramsCollection();
    const users = await getUsersCollection();

    // Verify program exists
    const program = await programs.findOne({ 
      _id: new ObjectId(programId),
      isActive: true 
    }) as DbProgram | null;
    
    if (!program) {
      throw new Error('Program not found');
    }

    // Verify user exists
    const user = await users.findOne({ 
      _id: new ObjectId(userId) 
    }) as DbUser | null;
    
    if (!user) {
      throw new Error('User not found');
    }

    // Check if user already applied to this program
    const existingApplication = await applications.findOne({
      userId: new ObjectId(userId),
      programId: new ObjectId(programId)
    });

    if (existingApplication) {
      throw new Error('You have already applied to this program');
    }

    // Generate reference number
    const referenceNumber = `LF${new Date().getFullYear()}${Math.floor(10000 + Math.random() * 90000)}`;

    const newApplication: Omit<DbApplication, '_id'> = {
      userId: new ObjectId(userId),
      programId: new ObjectId(programId),
      programTitle: program.title,
      applicantEmail: user.email,
      personalDetails: formData.personalDetails,
      educationalBackground: formData.educationalBackground,
      statementOfPurpose: formData.statementOfPurpose,
      status: 'pending',
      referenceNumber,
      submissionDate: new Date().toISOString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await applications.insertOne(newApplication);
    
    // Send confirmation email
    const emailTemplate = emailTemplates.applicationSubmitted(
      `${user.firstName} ${user.lastName}`,
      program.title,
      referenceNumber
    );
    
    await sendEmail({
      ...emailTemplate,
      to: user.email,
    });

    // Get the created application
    const createdApp = await applications.findOne({ 
      _id: result.insertedId 
    }) as DbApplication;

    return dbApplicationToAppApplication(createdApp);
  } catch (error) {
    console.error('❌ Error creating application:', error);
    throw error;
  }
}

export async function getApplicationById(applicationId: string): Promise<Application | null> {
  try {
    const applications = await getApplicationsCollection();
    const dbApp = await applications.findOne({ 
      _id: new ObjectId(applicationId) 
    }) as DbApplication | null;

    if (!dbApp) {
      return null;
    }

    return dbApplicationToAppApplication(dbApp);
  } catch (error) {
    console.error('❌ Error fetching application by ID:', error);
    return null;
  }
}

export async function getApplicationsByUserId(userId: string): Promise<Application[]> {
  try {
    const applications = await getApplicationsCollection();
    const dbApps = await applications
      .find({ userId: new ObjectId(userId) })
      .sort({ createdAt: -1 })
      .toArray() as DbApplication[];

    return dbApps.map(dbApplicationToAppApplication);
  } catch (error) {
    console.error('❌ Error fetching user applications:', error);
    return [];
  }
}

export async function getAllApplicationsForCounselor(filters?: ApplicationFilters): Promise<Application[]> {
  try {
    const applications = await getApplicationsCollection();
    const query: any = {};

    // Apply filters
    if (filters?.status) {
      query.status = filters.status;
    }
    
    if (filters?.programId) {
      query.programId = new ObjectId(filters.programId);
    }
    
    if (filters?.userId) {
      query.userId = new ObjectId(filters.userId);
    }
    
    if (filters?.dateFrom || filters?.dateTo) {
      query.createdAt = {};
      if (filters.dateFrom) query.createdAt.$gte = new Date(filters.dateFrom);
      if (filters.dateTo) query.createdAt.$lte = new Date(filters.dateTo);
    }

    const dbApps = await applications
      .find(query)
      .sort({ createdAt: -1 })
      .toArray() as DbApplication[];

    return dbApps.map(dbApplicationToAppApplication);
  } catch (error) {
    console.error('❌ Error fetching applications for counselor:', error);
    return [];
  }
}

export async function updateApplicationStatus(
  applicationId: string,
  status: 'approved' | 'denied',
  counselorNotes?: string,
  denialReason?: string,
  counselorId?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const applications = await getApplicationsCollection();
    const users = await getUsersCollection();
    
    // Get the application
    const application = await applications.findOne({ 
      _id: new ObjectId(applicationId) 
    }) as DbApplication | null;
    
    if (!application) {
      return { success: false, error: 'Application not found' };
    }

    // Get the user for email
    const user = await users.findOne({ 
      _id: application.userId 
    }) as DbUser | null;

    // Update application
    const updateData: any = {
      status,
      reviewedAt: new Date(),
      updatedAt: new Date(),
    };
    
    if (counselorNotes) updateData.counselorNotes = counselorNotes;
    if (denialReason) updateData.denialReason = denialReason;
    if (counselorId) updateData.reviewedBy = new ObjectId(counselorId);

    const result = await applications.updateOne(
      { _id: new ObjectId(applicationId) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return { success: false, error: 'Application not found' };
    }

    // Send status update email
    if (user) {
      if (status === 'approved') {
        // Get program info for tuition fee
        const programs = await getProgramsCollection();
        const program = await programs.findOne({ 
          _id: application.programId 
        }) as DbProgram | null;
        
        const emailTemplate = emailTemplates.applicationApproved(
          `${user.firstName} ${user.lastName}`,
          application.programTitle,
          program?.tuitionFee || 0
        );
        
        await sendEmail({
          ...emailTemplate,
          to: user.email,
        });
      } else {
        const emailTemplate = emailTemplates.applicationDenied(
          `${user.firstName} ${user.lastName}`,
          application.programTitle,
          denialReason || 'Requirements not met'
        );
        
        await sendEmail({
          ...emailTemplate,
          to: user.email,
        });
      }
    }

    return { success: true };
  } catch (error) {
    console.error('❌ Error updating application status:', error);
    return { success: false, error: 'Failed to update application status' };
  }
}

export async function getApplicationsPaginated(filters?: ApplicationFilters): Promise<PaginatedResponse<Application>> {
  try {
    const applications = await getApplicationsCollection();
    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const skip = (page - 1) * limit;
    
    const query: any = {};
    
    // Apply filters
    if (filters?.status) {
      query.status = filters.status;
    }
    
    if (filters?.programId) {
      query.programId = new ObjectId(filters.programId);
    }
    
    if (filters?.userId) {
      query.userId = new ObjectId(filters.userId);
    }
    
    if (filters?.dateFrom || filters?.dateTo) {
      query.createdAt = {};
      if (filters.dateFrom) query.createdAt.$gte = new Date(filters.dateFrom);
      if (filters.dateTo) query.createdAt.$lte = new Date(filters.dateTo);
    }

    const [dbApps, total] = await Promise.all([
      applications
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray() as Promise<DbApplication[]>,
      applications.countDocuments(query)
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: dbApps.map(dbApplicationToAppApplication),
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
    console.error('❌ Error fetching paginated applications:', error);
    return {
      data: [],
      pagination: {
        page: 1,
        limit: filters?.limit || 10,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      },
    };
  }
}

export async function getApplicationStats(): Promise<{
  total: number;
  pending: number;
  approved: number;
  denied: number;
  recentApplications: Application[];
}> {
  try {
    const applications = await getApplicationsCollection();
    
    const [total, pending, approved, denied, recent] = await Promise.all([
      applications.countDocuments(),
      applications.countDocuments({ status: 'pending' }),
      applications.countDocuments({ status: 'approved' }),
      applications.countDocuments({ status: 'denied' }),
      applications
        .find()
        .sort({ createdAt: -1 })
        .limit(5)
        .toArray() as Promise<DbApplication[]>
    ]);

    return {
      total,
      pending,
      approved,
      denied,
      recentApplications: recent.map(dbApplicationToAppApplication),
    };
  } catch (error) {
    console.error('❌ Error fetching application stats:', error);
    return {
      total: 0,
      pending: 0,
      approved: 0,
      denied: 0,
      recentApplications: [],
    };
  }
}
