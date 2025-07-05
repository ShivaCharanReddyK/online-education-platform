import nodemailer from 'nodemailer'
import type { EmailTemplate } from '@/lib/models'
import fs from 'fs'
import path from 'path'

// Create a transporter using Gmail
// Note: For Gmail, you need to:
// 1. Enable "Less secure app access" or 
// 2. Use an "App Password" if 2FA is enabled
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER || 'your-email@gmail.com', // Set in .env.local
      pass: process.env.GMAIL_APP_PASSWORD || 'your-app-password' // Set in .env.local
    }
  })
}

// Also log emails to files for reference
const logEmail = async (emailData: EmailTemplate) => {
  const timestamp = new Date().toISOString()
  const emailLog = {
    timestamp,
    to: emailData.to,
    subject: emailData.subject,
    html: emailData.html
  }
  
  const logDir = path.join(process.cwd(), 'email-logs')
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true })
  }
  
  const logFile = path.join(logDir, `email-${Date.now()}.json`)
  fs.writeFileSync(logFile, JSON.stringify(emailLog, null, 2))
  
  return logFile
}

// Function to send emails via Gmail
export const sendEmail = async ({
  to,
  subject,
  html,
}: EmailTemplate): Promise<{ success: boolean; data?: any; error?: any }> => {
  try {
    // Log sending attempt
    console.log('\n📧 SENDING EMAIL VIA GMAIL')
    console.log('📧 To:', to)
    console.log('📧 Subject:', subject)
    
    // Create transporter
    const transporter = createTransporter()
    
    // Configure mail options
    const mailOptions = {
      from: `"LearnFlow Education" <${process.env.GMAIL_USER || 'your-email@gmail.com'}>`,
      to: to,
      subject: subject,
      html: html
    }
    
    // Log email to file as backup
    const logFile = await logEmail({ to, subject, html })
    
    // Send email
    const info = await transporter.sendMail(mailOptions)
    
    console.log('✅ EMAIL SENT SUCCESSFULLY!')
    console.log('📧 Message ID:', info.messageId)
    
    return { 
      success: true, 
      data: { 
        messageId: info.messageId,
        logFile,
        method: 'gmail'
      }
    }
  } catch (error: any) {
    console.error('❌ Email sending error:', error)
    
    // Fallback to console logging if Gmail fails
    console.log('\n⚠️ GMAIL FAILED - FALLBACK TO CONSOLE OUTPUT')
    console.log('📧 TO:', to)
    console.log('📧 SUBJECT:', subject)
    console.log('📧 HTML PREVIEW:')
    console.log(html.substring(0, 300) + '...')
    
    // Still log to file
    try {
      const logFile = await logEmail({ to, subject, html })
      console.log('📁 Email logged to:', logFile)
    } catch (logError) {
      console.error('Failed to log email to file:', logError)
    }
    
    return { 
      success: false, 
      error: error.message || 'Unknown error occurred',
      fallback: 'Email logged to console and file'
    }
  }
}

export const emailTemplates = {
  applicationSubmitted: (
    applicantName: string, 
    programTitle: string, 
    referenceNumber: string
  ): EmailTemplate => ({
    to: '', // Will be set by caller
    subject: `Application Submitted - ${programTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Application Submitted</title>
        </head>
        <body style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f5f5f5;">
          <div style="background: linear-gradient(135deg, #3F51B5, #5C6BC0); color: white; padding: 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px; font-weight: 700;">Application Submitted! ✅</h1>
          </div>
          <div style="background: white; padding: 30px; margin: 0;">
            <p style="font-size: 16px; color: #333; margin-bottom: 20px;">Dear ${applicantName},</p>
            
            <p style="font-size: 16px; color: #333; line-height: 1.6;">
              Thank you for your interest in LearnFlow! Your application for 
              <strong style="color: #3F51B5;">${programTitle}</strong> has been successfully submitted.
            </p>
            
            <div style="background: #f8f9fa; border-left: 4px solid #FF9800; padding: 20px; margin: 20px 0;">
              <p style="margin: 0; font-size: 16px; color: #333;">
                <strong>Reference Number:</strong> 
                <span style="color: #FF9800; font-family: monospace; font-size: 18px;">${referenceNumber}</span>
              </p>
            </div>
            
            <p style="font-size: 16px; color: #333; line-height: 1.6;">
              Our admissions team will review your application within <strong>3-5 business days</strong>. 
              You'll receive an email notification once a decision has been made.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.APP_URL}/dashboard" 
                 style="background: #3F51B5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">
                View Application Status
              </a>
            </div>
            
            <p style="font-size: 14px; color: #666; margin-top: 30px;">
              Best regards,<br>
              <strong>The LearnFlow Team</strong>
            </p>
          </div>
          <div style="background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666;">
            <p style="margin: 0;">© 2025 LearnFlow. All rights reserved.</p>
          </div>
        </body>
      </html>
    `
  }),

  applicationApproved: (
    applicantName: string, 
    programTitle: string, 
    tuitionFee: number
  ): EmailTemplate => ({
    to: '', // Will be set by caller
    subject: `🎉 Application Approved - ${programTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Application Approved</title>
        </head>
        <body style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f5f5f5;">
          <div style="background: linear-gradient(135deg, #4CAF50, #66BB6A); color: white; padding: 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px; font-weight: 700;">Congratulations! 🎉</h1>
          </div>
          <div style="background: white; padding: 30px; margin: 0;">
            <p style="font-size: 16px; color: #333; margin-bottom: 20px;">Dear ${applicantName},</p>
            
            <p style="font-size: 18px; color: #4CAF50; font-weight: 600; margin-bottom: 20px;">
              Your application has been APPROVED! 🎓
            </p>
            
            <p style="font-size: 16px; color: #333; line-height: 1.6;">
              We're excited to inform you that your application for 
              <strong style="color: #3F51B5;">${programTitle}</strong> has been approved.
            </p>
            
            <div style="background: #e8f5e8; border: 2px solid #4CAF50; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h3 style="color: #4CAF50; margin-top: 0;">Next Steps:</h3>
              <ol style="color: #333; line-height: 1.6;">
                <li>Complete your payment of <strong>$${tuitionFee.toLocaleString()}</strong></li>
                <li>Secure your spot in the program</li>
                <li>Receive access to course materials</li>
              </ol>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.APP_URL}/dashboard" 
                 style="background: #4CAF50; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block; font-size: 16px;">
                Complete Payment
              </a>
            </div>
            
            <p style="font-size: 14px; color: #666; margin-top: 30px;">
              Welcome to the LearnFlow community!<br>
              <strong>The LearnFlow Team</strong>
            </p>
          </div>
          <div style="background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666;">
            <p style="margin: 0;">© 2025 LearnFlow. All rights reserved.</p>
          </div>
        </body>
      </html>
    `
  }),

  applicationDenied: (
    applicantName: string, 
    programTitle: string, 
    denialReason: string,
    alternativePrograms: string[] = []
  ): EmailTemplate => ({
    to: '', // Will be set by caller
    subject: `Application Update - ${programTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Application Update</title>
        </head>
        <body style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f5f5f5;">
          <div style="background: linear-gradient(135deg, #FF9800, #FFB74D); color: white; padding: 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px; font-weight: 700;">Application Update</h1>
          </div>
          <div style="background: white; padding: 30px; margin: 0;">
            <p style="font-size: 16px; color: #333; margin-bottom: 20px;">Dear ${applicantName},</p>
            
            <p style="font-size: 16px; color: #333; line-height: 1.6;">
              Thank you for your interest in <strong>${programTitle}</strong>. 
              After careful review, we're unable to approve your application at this time.
            </p>
            
            <div style="background: #fff3e0; border-left: 4px solid #FF9800; padding: 20px; margin: 20px 0;">
              <h4 style="color: #FF9800; margin-top: 0;">Feedback:</h4>
              <p style="margin: 0; color: #333; line-height: 1.6;">${denialReason}</p>
            </div>
            
            ${alternativePrograms.length > 0 ? `
              <div style="background: #e3f2fd; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <h4 style="color: #3F51B5; margin-top: 0;">🤖 AI-Recommended Alternative Programs:</h4>
                <ul style="color: #333; line-height: 1.6;">
                  ${alternativePrograms.map(program => `<li>${program}</li>`).join('')}
                </ul>
              </div>
            ` : ''}
            
            <p style="font-size: 16px; color: #333; line-height: 1.6;">
              We encourage you to explore other programs that might be a better fit for your background and goals.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.APP_URL}/programs" 
                 style="background: #3F51B5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">
                Explore Other Programs
              </a>
            </div>
            
            <p style="font-size: 14px; color: #666; margin-top: 30px;">
              Thank you for considering LearnFlow.<br>
              <strong>The LearnFlow Team</strong>
            </p>
          </div>
          <div style="background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666;">
            <p style="margin: 0;">© 2025 LearnFlow. All rights reserved.</p>
          </div>
        </body>
      </html>
    `
  })
}
