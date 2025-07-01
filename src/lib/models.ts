import { ObjectId } from 'mongodb'

// Database Models for MongoDB
export interface DbUser {
  _id?: ObjectId
  email: string
  password: string
  firstName: string
  lastName: string
  role: 'student' | 'counselor'
  isEmailVerified: boolean
  createdAt: Date
  updatedAt: Date
}

export interface DbProgram {
  _id?: ObjectId
  title: string
  description: string
  longDescription?: string
  category: string
  duration: string
  startDate: string
  imageUrl: string
  aiHint?: string
  features: string[]
  tuitionFee: number
  learningOutcomes?: string[]
  modules?: Array<{
    title: string
    description: string
  }>
  maxStudents?: number
  currentEnrollment: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface DbApplication {
  _id?: ObjectId
  userId: ObjectId
  programId: ObjectId
  programTitle: string
  applicantEmail: string
  personalDetails: {
    firstName: string
    lastName: string
    dateOfBirth: string
    phone: string
    address: string
  }
  educationalBackground: {
    highestQualification: string
    institution: string
    yearOfCompletion: string
  }
  statementOfPurpose: string
  status: 'pending' | 'approved' | 'denied'
  paymentStatus?: 'unpaid' | 'partial' | 'paid'
  denialReason?: string
  aiRecommendedPrograms?: string[]
  referenceNumber: string
  submissionDate: string
  reviewedAt?: Date
  reviewedBy?: ObjectId
  counselorNotes?: string
  createdAt: Date
  updatedAt: Date
}

export interface DbPayment {
  _id?: ObjectId
  applicationId: ObjectId
  userId: ObjectId
  programId: ObjectId
  amount: number
  paymentDate: string
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  paymentMethod: 'full' | 'plan'
  transactionId?: string
  stripePaymentIntentId?: string
  receiptUrl?: string
  createdAt: Date
  updatedAt: Date
}

export interface DbPaymentPlan {
  _id?: ObjectId
  applicationId: ObjectId
  userId: ObjectId
  programId: ObjectId
  totalAmount: number
  installmentsCount: number
  installmentAmount: number
  nextPaymentDate: Date
  remainingInstallments: number
  paidInstallments: number
  status: 'active' | 'completed' | 'cancelled'
  createdAt: Date
  updatedAt: Date
}

// Email Templates
export interface EmailTemplate {
  to: string
  subject: string
  html: string
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

// Pagination Types
export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// Filter Types
export interface ProgramFilters {
  category?: string
  duration?: string
  startDate?: string
  searchTerm?: string
  minPrice?: number
  maxPrice?: number
  page?: number
  limit?: number
}

export interface ApplicationFilters {
  status?: 'pending' | 'approved' | 'denied'
  programId?: string
  userId?: string
  dateFrom?: string
  dateTo?: string
  page?: number
  limit?: number
}

// Application Statistics for Counselor Dashboard
export interface ApplicationStats {
  total: number
  pending: number
  approved: number
  denied: number
  recentApplications: DbApplication[]
}
