import { ObjectId } from 'mongodb'
import bcrypt from 'bcryptjs'
import { 
  getUsersCollection, 
  getProgramsCollection, 
  getApplicationsCollection,
  getPaymentsCollection,
  getPaymentPlansCollection
} from '@/lib/mongodb'
import type { 
  DbUser, 
  DbProgram, 
  DbApplication, 
  DbPayment, 
  DbPaymentPlan,
  ApiResponse 
} from '@/lib/models'
import { DUMMY_PROGRAMS } from '@/lib/constants'

// Helper function to serialize MongoDB documents for Next.js
function serializeDocument(doc: any): any {
  if (!doc) return doc;
  
  // Convert directly to a plain object
  const obj = { ...doc };
  
  // Convert ObjectIds to strings
  if (obj._id) {
    obj._id = obj._id.toString();
  }
  
  // Process other ObjectId fields
  for (const key in obj) {
    if (obj[key] instanceof ObjectId) {
      obj[key] = obj[key].toString();
    }
  }
  
  // Convert dates to ISO strings
  for (const key in obj) {
    if (obj[key] instanceof Date) {
      obj[key] = obj[key].toISOString();
    }
  }
  
  return obj;
}

// Helper to serialize arrays of documents
function serializeDocuments<T>(docs: T[]): any[] {
  return docs.map(serializeDocument);
}

// User Database Operations
export async function createUser(userData: {
  email: string
  password: string
  firstName: string
  lastName: string
  role: 'student' | 'counselor'
}): Promise<ApiResponse<{ userId: string }>> {
  try {
    const users = await getUsersCollection()
    
    // Check if user already exists
    const existingUser = await users.findOne({ email: userData.email })
    if (existingUser) {
      return { success: false, error: 'User already exists with this email' }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 12)
    
    const user: Omit<DbUser, '_id'> = {
      ...userData,
      password: hashedPassword,
      isEmailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const result = await users.insertOne(user)
    return { 
      success: true, 
      data: { userId: result.insertedId.toString() },
      message: 'User created successfully'
    }
  } catch (error) {
    console.error('Create user error:', error)
    return { success: false, error: 'Failed to create user' }
  }
}

export async function getUserByEmail(email: string): Promise<DbUser | null> {
  try {
    const users = await getUsersCollection()
    const user = await users.findOne({ email }) as DbUser | null
    return user
  } catch (error) {
    console.error('Get user error:', error)
    return null
  }
}

export async function getUserById(userId: string): Promise<DbUser | null> {
  try {
    const users = await getUsersCollection()
    const user = await users.findOne({ _id: new ObjectId(userId) }) as DbUser | null
    return user
  } catch (error) {
    console.error('Get user by ID error:', error)
    return null
  }
}

// Program Database Operations
export async function getPrograms(filters?: {
  category?: string
  search?: string
  page?: number
  limit?: number
  isActive?: boolean
}): Promise<{
  programs: DbProgram[]
  totalPages: number
  currentPage: number
  totalPrograms: number
}> {
  try {
    const programs = await getProgramsCollection()
    
    const query: any = { isActive: filters?.isActive ?? true }
    
    if (filters?.category && filters.category !== 'all' && filters.category !== 'All') {
      query.category = filters.category
    }
    
    if (filters?.search) {
      query.$or = [
        { title: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } },
        { category: { $regex: filters.search, $options: 'i' } }
      ]
    }
    
    const page = filters?.page || 1
    const limit = filters?.limit || 6
    const skip = (page - 1) * limit
    
    const [programList, totalPrograms] = await Promise.all([
      programs.find(query).skip(skip).limit(limit).toArray(),
      programs.countDocuments(query)
    ])
    
    return {
      programs: programList as DbProgram[],
      totalPages: Math.ceil(totalPrograms / limit),
      currentPage: page,
      totalPrograms
    }
  } catch (error) {
    console.error('Get programs error:', error)
    return { programs: [], totalPages: 0, currentPage: 1, totalPrograms: 0 }
  }
}

export async function getProgramById(programId: string): Promise<DbProgram | null> {
  try {
    const programs = await getProgramsCollection()
    const program = await programs.findOne({ _id: new ObjectId(programId) }) as DbProgram | null
    return program
  } catch (error) {
    console.error('Get program by ID error:', error)
    return null
  }
}

// Application Database Operations
export async function createApplication(applicationData: Omit<DbApplication, '_id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<{ applicationId: string }>> {
  try {
    const applications = await getApplicationsCollection()
    
    const application: Omit<DbApplication, '_id'> = {
      ...applicationData,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const result = await applications.insertOne(application)
    return { 
      success: true, 
      data: { applicationId: result.insertedId.toString() },
      message: 'Application created successfully'
    }
  } catch (error) {
    console.error('Create application error:', error)
    return { success: false, error: 'Failed to create application' }
  }
}

export async function getApplicationsByUserId(userId: string): Promise<DbApplication[]> {
  try {
    const applications = await getApplicationsCollection()
    const userApplications = await applications
      .find({ userId: new ObjectId(userId) })
      .sort({ createdAt: -1 })
      .toArray()
    
    return userApplications as DbApplication[]
  } catch (error) {
    console.error('Get applications by user ID error:', error)
    return []
  }
}

export async function getAllApplications(filters?: {
  status?: string
  page?: number
  limit?: number
}): Promise<{
  applications: DbApplication[]
  totalPages: number
  currentPage: number
  totalApplications: number
}> {
  try {
    const applications = await getApplicationsCollection()
    
    const query: any = {}
    
    if (filters?.status && filters.status !== 'all') {
      query.status = filters.status
    }
    
    const page = filters?.page || 1
    const limit = filters?.limit || 10
    const skip = (page - 1) * limit
    
    const [applicationList, totalApplications] = await Promise.all([
      applications.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray(),
      applications.countDocuments(query)
    ])
    
    return {
      applications: applicationList as DbApplication[],
      totalPages: Math.ceil(totalApplications / limit),
      currentPage: page,
      totalApplications
    }
  } catch (error) {
    console.error('Get all applications error:', error)
    return { applications: [], totalPages: 0, currentPage: 1, totalApplications: 0 }
  }
}

export async function updateApplicationStatus(
  applicationId: string,
  status: 'approved' | 'denied',
  counselorNotes?: string,
  denialReason?: string,
  aiRecommendedPrograms?: string[]
): Promise<ApiResponse> {
  try {
    const applications = await getApplicationsCollection()
    
    const updateData: any = {
      status,
      reviewedAt: new Date(),
      updatedAt: new Date()
    }
    
    if (counselorNotes) updateData.counselorNotes = counselorNotes
    if (denialReason) updateData.denialReason = denialReason
    if (aiRecommendedPrograms) updateData.aiRecommendedPrograms = aiRecommendedPrograms
    
    const result = await applications.updateOne(
      { _id: new ObjectId(applicationId) },
      { $set: updateData }
    )
    
    if (result.modifiedCount === 0) {
      return { success: false, error: 'Application not found or not updated' }
    }
    
    return { success: true, message: 'Application status updated successfully' }
  } catch (error) {
    console.error('Update application status error:', error)
    return { success: false, error: 'Failed to update application status' }
  }
}

export async function deleteApplication(applicationId: string): Promise<ApiResponse> {
  try {
    const applications = await getApplicationsCollection()
    
    const result = await applications.deleteOne({ _id: new ObjectId(applicationId) })
    
    if (result.deletedCount === 0) {
      return { success: false, error: 'Application not found or not deleted' }
    }
    
    return { success: true, message: 'Application deleted successfully' }
  } catch (error) {
    console.error('Delete application error:', error)
    return { success: false, error: 'Failed to delete application' }
  }
}

export async function checkExistingApplications(
  userId: string, 
  programId: string
): Promise<{ exists: boolean; status?: string; applicationId?: string }> {
  try {
    const applications = await getApplicationsCollection()
    
    const existingApplication = await applications.findOne({
      userId: new ObjectId(userId),
      programId: new ObjectId(programId)
    })
    
    if (!existingApplication) {
      return { exists: false }
    }
    
    return { 
      exists: true, 
      status: existingApplication.status,
      applicationId: existingApplication._id.toString()
    }
  } catch (error) {
    console.error('Check existing applications error:', error)
    return { exists: false }
  }
}

// Payment Database Operations
export async function createPayment(paymentData: Omit<DbPayment, '_id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<{ paymentId: string }>> {
  try {
    const payments = await getPaymentsCollection()
    
    const payment: Omit<DbPayment, '_id'> = {
      ...paymentData,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const result = await payments.insertOne(payment)
    return { 
      success: true, 
      data: { paymentId: result.insertedId.toString() },
      message: 'Payment created successfully'
    }
  } catch (error) {
    console.error('Create payment error:', error)
    return { success: false, error: 'Failed to create payment' }
  }
}

export async function getPaymentById(paymentId: string): Promise<DbPayment | null> {
  try {
    const payments = await getPaymentsCollection()
    const payment = await payments.findOne({ _id: new ObjectId(paymentId) }) as DbPayment | null
    return payment
  } catch (error) {
    console.error('Get payment by ID error:', error)
    return null
  }
}

export async function getPaymentsByUserId(userId: string): Promise<any[]> {
  try {
    const payments = await getPaymentsCollection()
    const userPayments = await payments
      .find({ userId: new ObjectId(userId) })
      .sort({ createdAt: -1 })
      .toArray()
    
    return serializeDocuments(userPayments)
  } catch (error) {
    console.error('Get payments by user ID error:', error)
    return []
  }
}

export async function getPaymentsByApplicationId(applicationId: string): Promise<any[]> {
  try {
    const payments = await getPaymentsCollection()
    const applicationPayments = await payments
      .find({ applicationId: new ObjectId(applicationId) })
      .sort({ createdAt: -1 })
      .toArray()
    
    return serializeDocuments(applicationPayments)
  } catch (error) {
    console.error('Get payments by application ID error:', error)
    return []
  }
}

export async function createPaymentPlan(planData: Omit<DbPaymentPlan, '_id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<{ paymentPlanId: string }>> {
  try {
    const paymentPlans = await getPaymentPlansCollection()
    
    const paymentPlan: Omit<DbPaymentPlan, '_id'> = {
      ...planData,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const result = await paymentPlans.insertOne(paymentPlan)
    
    // Update application payment status
    await updateApplicationPaymentStatus(planData.applicationId.toString(), 'partial')
    
    return { 
      success: true, 
      data: { paymentPlanId: result.insertedId.toString() },
      message: 'Payment plan created successfully'
    }
  } catch (error) {
    console.error('Create payment plan error:', error)
    return { success: false, error: 'Failed to create payment plan' }
  }
}

export async function getPaymentPlanByApplicationId(applicationId: string): Promise<any | null> {
  try {
    const paymentPlans = await getPaymentPlansCollection()
    const paymentPlan = await paymentPlans.findOne({ 
      applicationId: new ObjectId(applicationId) 
    }) as DbPaymentPlan | null
    
    return paymentPlan ? serializeDocument(paymentPlan) : null
  } catch (error) {
    console.error('Get payment plan by application ID error:', error)
    return null
  }
}

export async function updatePaymentPlan(paymentPlanId: string, updateData: Partial<Omit<DbPaymentPlan, '_id' | 'createdAt' | 'updatedAt'>>): Promise<ApiResponse> {
  try {
    const paymentPlans = await getPaymentPlansCollection()
    
    await paymentPlans.updateOne(
      { _id: new ObjectId(paymentPlanId) },
      { 
        $set: { 
          ...updateData,
          updatedAt: new Date() 
        } 
      }
    )
    
    return { 
      success: true,
      message: 'Payment plan updated successfully'
    }
  } catch (error) {
    console.error('Update payment plan error:', error)
    return { success: false, error: 'Failed to update payment plan' }
  }
}

// Update application payment status
export async function updateApplicationPaymentStatus(applicationId: string, status: 'unpaid' | 'partial' | 'paid'): Promise<ApiResponse> {
  try {
    const applications = await getApplicationsCollection()
    
    await applications.updateOne(
      { _id: new ObjectId(applicationId) },
      { 
        $set: { 
          paymentStatus: status,
          updatedAt: new Date() 
        } 
      }
    )
    
    return { 
      success: true,
      message: 'Application payment status updated successfully'
    }
  } catch (error) {
    console.error('Update application payment status error:', error)
    return { success: false, error: 'Failed to update application payment status' }
  }
}

// Utility function to seed initial programs
export async function seedPrograms(): Promise<void> {
  try {
    const programs = await getProgramsCollection()
    const count = await programs.countDocuments()
    
    if (count === 0) {
      console.log('Seeding initial programs...')
      
      // Convert DUMMY_PROGRAMS to database format
      const seedData: Omit<DbProgram, '_id'>[] = DUMMY_PROGRAMS.map(program => ({
        ...program,
        currentEnrollment: 0, // Add missing field
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }))
      
      await programs.insertMany(seedData)
      console.log(`✅ ${seedData.length} programs seeded successfully`)
    }
  } catch (error) {
    console.error('❌ Error seeding programs:', error)
  }
}
