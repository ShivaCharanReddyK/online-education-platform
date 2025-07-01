'use server';

import { sendEmail } from '@/lib/email';
import { format } from 'date-fns';

// Payment confirmation email
export async function sendPaymentConfirmationEmail(
  to: string,
  firstName: string,
  programTitle: string,
  amount: number,
  receiptUrl: string
) {
  try {
    const html = `
      <!DOCTYPE html>
      <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #4CAF50; color: white; padding: 20px; text-align: center;">
            <h1>Payment Confirmation</h1>
          </div>
          <div style="padding: 20px;">
            <p>Dear ${firstName},</p>
            <p>Thank you for your payment of <strong>$${amount.toFixed(2)}</strong> for the <strong>${programTitle}</strong> program.</p>
            <p>Your payment has been successfully processed. You can download your receipt by clicking the button below:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.APP_URL}${receiptUrl}" style="background-color: #3F51B5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
                Download Receipt
              </a>
            </div>
            <p>You're all set to start your learning journey! Please check your email for more information about program access details.</p>
            <p>Best regards,<br>The LearnFlow Team</p>
          </div>
        </body>
      </html>
    `;
    
    await sendEmail({
      to,
      subject: `Payment Confirmation - ${programTitle}`,
      html
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to send payment confirmation email:', error);
    return { success: false };
  }
}

// Payment plan confirmation email
export async function sendPaymentPlanConfirmationEmail(
  to: string,
  firstName: string,
  programTitle: string,
  totalAmount: number,
  installments: number,
  installmentAmount: number,
  nextPaymentDate: Date
) {
  try {
    const formattedDate = format(nextPaymentDate, 'MMMM d, yyyy');
    
    const html = `
      <!DOCTYPE html>
      <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #3F51B5; color: white; padding: 20px; text-align: center;">
            <h1>Payment Plan Confirmation</h1>
          </div>
          <div style="padding: 20px;">
            <p>Dear ${firstName},</p>
            <p>Your payment plan for <strong>${programTitle}</strong> has been set up successfully.</p>
            
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 4px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Payment Plan Details:</h3>
              <p><strong>Total Amount:</strong> $${totalAmount.toFixed(2)}</p>
              <p><strong>Number of Installments:</strong> ${installments}</p>
              <p><strong>Installment Amount:</strong> $${installmentAmount.toFixed(2)} per month</p>
              <p><strong>Next Payment Due:</strong> ${formattedDate}</p>
            </div>
            
            <p>You will receive payment reminders before each due date. To make your next payment, please log in to your dashboard.</p>
            <p>Thank you for choosing LearnFlow for your educational journey!</p>
            <p>Best regards,<br>The LearnFlow Team</p>
          </div>
        </body>
      </html>
    `;
    
    await sendEmail({
      to,
      subject: `Payment Plan Confirmation - ${programTitle}`,
      html
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to send payment plan confirmation email:', error);
    return { success: false };
  }
}
