export interface User {
  id?: string; 
  email: string;
  role: 'student' | 'counselor';
  firstName?: string;
  lastName?: string;
  password?: string; // Only for in-memory/localStorage mock, not for real DBs
}

// NextAuth extensions
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: 'student' | 'counselor'
    }
  }

  interface User {
    id: string
    email: string
    name: string
    role: 'student' | 'counselor'
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: 'student' | 'counselor'
  }
}

export interface Program {
  id: string; 
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
  id: string; 
  userId: string; 
  programId: string; 
  programTitle?: string; 
  applicantEmail?: string; 
  personalDetails: {
    firstName: string;
    lastName: string;
    dateOfBirth: string; 
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
  paymentStatus?: 'unpaid' | 'partial' | 'paid';
  denialReason?: string;
  referenceNumber: string;
  submissionDate: string; // ISO date string
  aiRecommendedPrograms?: string[];
}

export interface Payment {
  id: string;
  applicationId: string; 
  userId: string; 
  amount: number;
  paymentDate: string; // ISO date string
  status: 'pending' | 'completed' | 'failed';
  paymentMethod: 'full' | 'plan';
  transactionId?: string; 
}

// For AI Program Recommender
export interface AIRecommendationInput {
  background: string;
  interests: string;
  statementOfPurpose: string;
}

export interface AIRecommendationOutput {
  programRecommendations: string[];
  reasoning: string;
}
