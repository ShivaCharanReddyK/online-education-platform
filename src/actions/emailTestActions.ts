'use server'

import { sendEmail, emailTemplates } from '@/lib/email'

export async function sendTestEmail(recipientEmail: string): Promise<{ success: boolean; message: string }> {
  try {
    const testTemplate = emailTemplates.applicationSubmitted(
      'Test User',
      'Full-Stack Web Development Bootcamp',
      'LF202512345'
    )

    const result = await sendEmail({
      to: recipientEmail,
      subject: testTemplate.subject,
      html: testTemplate.html
    })

    if (result.success) {
      return {
        success: true,
        message: 'Test email sent successfully! Check your console for simulation details.'
      }
    } else {
      return {
        success: false,
        message: 'Failed to send test email: ' + (result.error?.message || 'Unknown error')
      }
    }
  } catch (error) {
    console.error('Test email error:', error)
    return {
      success: false,
      message: 'Error sending test email: ' + (error as Error).message
    }
  }
}
