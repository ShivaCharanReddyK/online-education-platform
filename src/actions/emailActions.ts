
'use server';

import type { User, Program, Application } from '@/types';

const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(options: EmailOptions): Promise<{ success: boolean; error?: string }> {
  console.log("---- SIMULATING EMAIL SEND ----");
  console.log("To:", options.to);
  console.log("Subject:", options.subject);
  console.log("HTML Body (first 100 chars):", options.html.substring(0, 100) + "...");
  console.log("---- END SIMULATED EMAIL ----");
  // Simulate success for prototype
  return { success: true };
}

// Specific email templates (remain largely the same, but use the simulated sendEmail)

export async function sendApplicationSubmittedEmail(applicant: User, program: Program, application: Application) {
  const subject = `Your Application for ${program.title} has been Received!`;
  const html = `
    <h1>Application Received!</h1>
    <p>Dear ${application.personalDetails.firstName || applicant.email},</p>
    <p>Thank you for applying to the <strong>${program.title}</strong> program at LearnFlow.</p>
    <p>Your application reference number is: <strong>${application.referenceNumber}</strong>.</p>
    <p>We have received your application and it is currently under review. You can track its status on your dashboard:</p>
    <p><a href="${appUrl}/dashboard">Go to Dashboard</a></p>
    <p>Sincerely,<br/>The LearnFlow Admissions Team</p>
  `;
  return sendEmail({ to: applicant.email, subject, html });
}

export async function sendApplicationStatusUpdateEmail(applicantEmail: string, applicantName: string, programTitle: string, status: 'approved' | 'denied', denialReason?: string, aiRecommendations?: string[]) {
  let subject = '';
  let html = '';

  if (status === 'approved') {
    subject = `Congratulations! Your Application for ${programTitle} is Approved!`;
    html = `
      <h1>Application Approved!</h1>
      <p>Dear ${applicantName},</p>
      <p>We are delighted to inform you that your application for the <strong>${programTitle}</strong> program has been approved!</p>
      <p>Next steps, including payment information and enrollment details, can be found on your dashboard:</p>
      <p><a href="${appUrl}/dashboard">Go to Dashboard</a></p>
      <p>Welcome to LearnFlow!</p>
      <p>Sincerely,<br/>The LearnFlow Admissions Team</p>
    `;
  } else { // denied
    subject = `Update on Your Application for ${programTitle}`;
    html = `
      <h1>Application Update</h1>
      <p>Dear ${applicantName},</p>
      <p>Thank you for your interest in the <strong>${programTitle}</strong> program at LearnFlow.</p>
      <p>After careful consideration, we regret to inform you that we are unable to offer you admission to this program at this time.</p>
      ${denialReason ? `<p><strong>Reason:</strong> ${denialReason}</p>` : ''}
      ${aiRecommendations && aiRecommendations.length > 0 ? `
        <p>Based on your profile, our AI has suggested a few other programs you might be interested in:</p>
        <ul>
          ${aiRecommendations.map(rec => `<li>${rec}</li>`).join('')}
        </ul>
        <p>You can explore these and other programs <a href="${appUrl}/programs">here</a>.</p>
      ` : ''}
      <p>We wish you the best in your future endeavors.</p>
      <p>Sincerely,<br/>The LearnFlow Admissions Team</p>
    `;
  }
  return sendEmail({ to: applicantEmail, subject, html });
}
