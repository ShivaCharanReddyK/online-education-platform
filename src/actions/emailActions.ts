'use server';

import type { User, Program, Application } from '@/types';
import { sendEmail, emailTemplates } from '@/lib/email';

const appUrl = process.env.APP_URL || 'http://localhost:9002';

export async function sendApplicationSubmittedEmail(applicant: User, program: Program, application: Application) {
  const template = emailTemplates.applicationSubmitted(
    application.personalDetails.firstName || applicant.email,
    program.title,
    application.referenceNumber
  );
  
  template.to = applicant.email;
  
  console.log(`📧 Sending application submitted email to: ${applicant.email}`);
  console.log(`📧 Program: ${program.title}`);
  console.log(`📧 Reference: ${application.referenceNumber}`);
  
  return await sendEmail(template);
}

export async function sendApplicationStatusUpdateEmail(
  applicantEmail: string, 
  programTitle: string, 
  referenceNumber: string,
  status: 'approved' | 'denied', 
  denialReason?: string, 
  aiRecommendations?: string[]
) {
  let template;
  
  if (status === 'approved') {
    template = emailTemplates.applicationApproved(
      applicantEmail.split('@')[0], // Simple name extraction
      programTitle,
      5000 // Default tuition fee - you might want to get this from the program
    );
  } else {
    template = emailTemplates.applicationDenied(
      applicantEmail.split('@')[0], // Simple name extraction
      programTitle,
      denialReason || 'Application requirements not fully met',
      aiRecommendations || []
    );
  }
  
  template.to = applicantEmail;
  
  console.log(`📧 Sending application ${status} email to: ${applicantEmail}`);
  console.log(`📧 Program: ${programTitle}`);
  console.log(`📧 Reference: ${referenceNumber}`);
  
  return await sendEmail(template);
}

export async function sendWelcomeEmail(email: string, firstName: string, lastName: string, role: 'student' | 'counselor') {
  const template = emailTemplates.welcomeRegistration(
    `${firstName} ${lastName}`,
    role
  );
  
  template.to = email;
  
  console.log(`📧 Sending welcome email to: ${email}`);
  console.log(`📧 Role: ${role}`);
  
  return await sendEmail(template);
}