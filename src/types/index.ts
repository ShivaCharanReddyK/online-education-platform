
import type { ObjectId } from 'mongodb';

export interface User {
  _id?: ObjectId; // MongoDB ID
  id?: string; // string representation of _id, or used if _id is not yet assigned
  email: string;
  role: 'student' | 'counselor';
  firstName?: string;
  lastName?: string;
  password?: string; // Only for backend, should not be sent to client
}

export interface Program {
  _id?: ObjectId;
  id?: string; // For frontend use if needed, can be string version of _id
  title: string;
  description: string;
  category: string;
  duration: string;
  startDate: string; // ISO date string
  imageUrl: string;
  features: string[];
  tuitionFee: number;
  longDescription?: string;
  learningOutcomes?: string[];
  modules?: { title: string; description: string }[];
  aiHint?: string;
}

export interface Application {
  _id?: ObjectId;
  id?: string; // For frontend use
  userId: string; // student's _id as string
  programId: string; // program's _id as string
  programTitle?: string; // Denormalized for easier display
  applicantEmail?: string; // Denormalized for easier display/notifications
  personalDetails: {
    firstName: string;
    lastName: string;
    dateOfBirth: string; // Should be stored as ISODate in DB ideally
    phone: string;
    address: string;
  };
  educationalBackground: {
    highestQualification: string;
    institution: string;
    yearOfCompletion: string;
  };
  statementOfPurpose: string;
  status: 'pending' | 'approved' | 'denied';
  denialReason?: string;
  referenceNumber: string;
  submissionDate: string; // ISO date string
  aiRecommendedPrograms?: string[]; // Store AI recommendations if denied
}

export interface Payment {
  _id?: ObjectId;
  id?: string;
  applicationId: string; // application _id as string
  userId: string; // student's _id as string
  amount: number;
  paymentDate: string; // ISO date string
  status: 'pending' | 'completed' | 'failed';
  paymentMethod: 'full' | 'plan'; // Added based on student dashboard
  transactionId?: string; // For payment gateway reference
}

// For AI Program Recommender
export interface AIRecommendationInput {
  background: string;
  interests: string;
  statementOfPurpose: string;
}

export interface AIRecommendationOutput { // Renamed from AIRecommendation to avoid conflict
  programRecommendations: string[];
  reasoning: string;
}
