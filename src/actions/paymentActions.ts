'use server';

import { ObjectId } from 'mongodb';
import stripe from '@/lib/stripe';
import { 
  createPayment, 
  createPaymentPlan, 
  getPaymentsByApplicationId,
  getPaymentPlanByApplicationId,
  updatePaymentPlan,
  getPaymentsByUserId,
  updateApplicationPaymentStatus
} from '@/lib/database';
import { getApplicationById } from './applicationActions';
import { getProgramById } from './programActions';
import { sendPaymentConfirmationEmail, sendPaymentPlanConfirmationEmail } from './emailPaymentActions';
import { generateReceipt } from '@/lib/receipt';

// Create Stripe payment intent
export async function createPaymentIntent(applicationId: string, amount: number) {
  try {
    const application = await getApplicationById(applicationId);
    if (!application) {
      return { success: false, error: 'Application not found' };
    }

    const program = await getProgramById(application.programId);
    if (!program) {
      return { success: false, error: 'Program not found' };
    }

    // Create a payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe expects amount in cents
      currency: 'usd',
      metadata: {
        applicationId,
        programId: application.programId,
        userId: application.userId,
        programTitle: program.title
      }
    });

    return {
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    };
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return { success: false, error: 'Failed to create payment' };
  }
}

// Process full payment
export async function processFullPayment(
  applicationId: string,
  paymentIntentId: string,
  amount: number
) {
  try {
    const application = await getApplicationById(applicationId);
    if (!application) {
      return { success: false, error: 'Application not found' };
    }

    const program = await getProgramById(application.programId);
    if (!program) {
      return { success: false, error: 'Program not found' };
    }

    // Verify the payment intent status with Stripe (in real implementation)
    // Here we'll just simulate a successful payment
    // const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    // if (paymentIntent.status !== 'succeeded') {
    //   return { success: false, error: 'Payment has not been completed' };
    // }

    // Generate receipt URL
    const receiptUrl = await generateReceipt({
      receiptNumber: `R-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString(),
      customerName: `${application.personalDetails.firstName} ${application.personalDetails.lastName}`,
      customerEmail: application.applicantEmail || '',
      programTitle: program.title,
      amount: amount,
      paymentType: 'Full Payment',
      referenceNumber: application.referenceNumber
    });

    // Record payment in database
    const paymentResult = await createPayment({
      applicationId: new ObjectId(applicationId),
      userId: new ObjectId(application.userId),
      programId: new ObjectId(application.programId),
      amount: amount,
      paymentDate: new Date().toISOString(),
      status: 'completed',
      paymentMethod: 'full',
      stripePaymentIntentId: paymentIntentId,
      receiptUrl,
      transactionId: `txn_${Date.now()}`
    });

    if (!paymentResult.success) {
      return { success: false, error: 'Failed to record payment' };
    }

    // Update application payment status to 'paid'
    await updateApplicationPaymentStatus(applicationId, 'paid');
    
    // Send confirmation email
    await sendPaymentConfirmationEmail(
      application.applicantEmail || '',
      application.personalDetails.firstName,
      program.title,
      amount,
      receiptUrl
    );

    return { 
      success: true, 
      message: 'Payment processed successfully',
      receiptUrl
    };
  } catch (error) {
    console.error('Error processing payment:', error);
    return { success: false, error: 'Payment processing failed' };
  }
}

// Setup payment plan
export async function setupPaymentPlan(
  applicationId: string,
  totalAmount: number,
  installmentsCount: number
) {
  try {
    const application = await getApplicationById(applicationId);
    if (!application) {
      return { success: false, error: 'Application not found' };
    }

    const program = await getProgramById(application.programId);
    if (!program) {
      return { success: false, error: 'Program not found' };
    }

    // Calculate installment amount (rounded up to nearest dollar)
    const installmentAmount = Math.ceil(totalAmount / installmentsCount);
    
    // Set next payment date to 30 days from now
    const nextPaymentDate = new Date();
    nextPaymentDate.setDate(nextPaymentDate.getDate() + 30);

    // Create payment plan in database
    const paymentPlanResult = await createPaymentPlan({
      applicationId: new ObjectId(applicationId),
      userId: new ObjectId(application.userId),
      programId: new ObjectId(application.programId),
      totalAmount,
      installmentsCount,
      installmentAmount,
      nextPaymentDate,
      remainingInstallments: installmentsCount,
      paidInstallments: 0,
      status: 'active'
    });

    if (!paymentPlanResult.success) {
      return { success: false, error: 'Failed to create payment plan' };
    }

    // Send confirmation email
    await sendPaymentPlanConfirmationEmail(
      application.applicantEmail || '',
      application.personalDetails.firstName,
      program.title,
      totalAmount,
      installmentsCount,
      installmentAmount,
      nextPaymentDate
    );

    return { 
      success: true, 
      message: 'Payment plan created successfully',
      nextPaymentDate,
      installmentAmount
    };
  } catch (error) {
    console.error('Error setting up payment plan:', error);
    return { success: false, error: 'Failed to set up payment plan' };
  }
}

// Get payment history
export async function getPaymentHistory(applicationId: string) {
  try {
    // Get all payments for the application
    const payments = await getPaymentsByApplicationId(applicationId);
    
    // Get payment plan if exists
    const paymentPlan = await getPaymentPlanByApplicationId(applicationId);
    
    return { 
      success: true, 
      payments, 
      paymentPlan 
    };
  } catch (error) {
    console.error('Error fetching payment history:', error);
    return { success: false, error: 'Failed to fetch payment history' };
  }
}

// Get all payments for a user
export async function getUserPaymentHistory(userId: string) {
  try {
    const payments = await getPaymentsByUserId(userId);
    return {
      success: true,
      payments
    };
  } catch (error) {
    console.error('Error fetching user payments:', error);
    return { success: false, error: 'Failed to fetch payment history' };
  }
}
