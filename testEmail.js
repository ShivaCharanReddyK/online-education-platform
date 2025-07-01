/**
 * LearnFlow Email Test Script
 * 
 * Usage: 
 *   node testEmail.js [recipient-email] [template-type]
 * 
 * Examples:
 *   node testEmail.js user@example.com
 *   node testEmail.js user@example.com approved
 *   node testEmail.js user@example.com denied
 * 
 * Template Types:
 *   - submitted (default): Application submitted confirmation
 *   - approved: Application approved notification
 *   - denied: Application denied notification
 */

import { sendEmail, emailTemplates } from './src/lib/email.js'
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function testEmail() {
  // Get arguments from command line
  const testEmailAddress = process.argv[2] || 'test@example.com';
  const templateType = process.argv[3] || 'submitted';
  
  console.log('🧪 LEARNFLOW EMAIL TEST')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📧 Gmail Account:', process.env.GMAIL_USER || '❌ NOT SET - Check your .env.local file')
  console.log('📧 Recipient:', testEmailAddress)
  console.log('📧 Template:', templateType)
  
  let template;
  
  // Create appropriate template based on type
  switch(templateType.toLowerCase()) {
    case 'approved':
      console.log('📧 Sending: Application Approved Email')
      template = emailTemplates.applicationApproved(
        'John Doe',
        'Full-Stack Web Development Bootcamp',
        5999
      )
      break;
      
    case 'denied':
      console.log('📧 Sending: Application Denied Email')
      template = emailTemplates.applicationDenied(
        'John Doe',
        'Full-Stack Web Development Bootcamp',
        'Your educational background doesn\'t match the program prerequisites.',
        ['Data Science & Machine Learning Certificate', 'UX/UI Design Professional Certificate']
      )
      break;
      
    case 'submitted':
    default:
      console.log('📧 Sending: Application Submitted Email')
      template = emailTemplates.applicationSubmitted(
        'John Doe',
        'Full-Stack Web Development Bootcamp',
        'LF202572366'
      )
  }
  
  template.to = testEmailAddress
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('⏳ Sending email...')
  
  try {
    const result = await sendEmail(template)
    
    if (result.success) {
      console.log('\n✅ EMAIL SENT SUCCESSFULLY!')
      console.log('📧 Message ID:', result.data?.messageId || 'N/A')
      console.log('📧 Check your inbox:', testEmailAddress)
      if (result.data?.logFile) {
        console.log('📁 Email log saved to:', result.data.logFile)
      }
    } else {
      console.log('\n❌ EMAIL FAILED')
      console.log('Error:', result.error)
      console.log('\nPlease check:')
      console.log('1. Your Gmail credentials in .env.local')
      console.log('2. That you\'ve created an App Password if using 2FA')
      console.log('3. That "Less secure app access" is enabled if not using App Password')
    }
  } catch (error) {
    console.error('\n❌ UNEXPECTED ERROR')
    console.error(error)
  }
  
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
}

// Run the test
testEmail()
