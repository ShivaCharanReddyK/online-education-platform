
export interface User {
  id: string;
  email: string;
  role: 'student' | 'counselor';
  firstName?: string;
  lastName?: string;
}

export interface Program {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string; // e.g., "6 Months", "1 Year"
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
  userId: string; // student's id
  programId: string;
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
  denialReason?: string;
  referenceNumber: string;
  submissionDate: string; // ISO date string
}

export interface Payment {
  id: string;
  applicationId: string;
  amount: number;
  paymentDate: string; // ISO date string
  status: 'pending' | 'completed' | 'failed';
  paymentMethod: 'full' | 'plan';
}

// For AI Program Recommender
export interface AIRecommendationInput {
  background: string;
  interests: string;
  statementOfPurpose: string;
}

export interface AIRecommendation {
  programRecommendations: string[];
  reasoning: string;
}
