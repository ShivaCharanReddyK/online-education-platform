'use client';

import { useEffect, useState } from 'react';
import { getPaymentHistory } from '@/actions/paymentActions';
import { Application } from '@/types';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { format, parseISO } from 'date-fns';
import { Download, CalendarDays, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface PaymentHistoryProps {
  application: Application;
}

// Define types for our serialized data
interface SerializedPayment {
  _id: string;
  applicationId: string;
  userId: string;
  programId: string;
  amount: number;
  paymentDate: string; // ISO string
  status: 'pending' | 'completed' | 'failed';
  paymentMethod: 'full' | 'installment';
  stripePaymentIntentId?: string;
  receiptUrl?: string;
  transactionId: string;
}

interface SerializedPaymentPlan {
  _id: string;
  applicationId: string;
  userId: string;
  programId: string;
  totalAmount: number;
  installmentsCount: number;
  installmentAmount: number;
  nextPaymentDate: string; // ISO string
  remainingInstallments: number;
  paidInstallments: number;
  status: 'active' | 'completed' | 'cancelled';
}

interface PaymentHistory {
  success: boolean;
  payments: SerializedPayment[];
  paymentPlan: SerializedPaymentPlan | null;
  error?: string;
}

export function PaymentHistory({ application }: PaymentHistoryProps) {
  const [history, setHistory] = useState<PaymentHistory | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      const result = await getPaymentHistory(application.id);
      if (result.success) {
        setHistory(result as PaymentHistory);
      }
      setLoading(false);
    };

    fetchHistory();
  }, [application]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!history || (!history.payments?.length && !history.paymentPlan)) {
    return <div className="py-8 text-center text-muted-foreground">No payment records found.</div>;
  }

  return (
    <div className="space-y-6">
      {history.payments && history.payments.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-4">Payment Records</h3>
          <div className="space-y-4">
            {history.payments.map((payment) => (
              <Card key={payment._id} className="overflow-hidden">
                <div className={`h-2 ${payment.status === 'completed' ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-md">
                      {payment.paymentMethod === 'full' ? 'Full Payment' : 'Installment Payment'}
                    </CardTitle>
                    <span className={`font-medium ${payment.status === 'completed' ? 'text-green-600' : 'text-amber-600'}`}>
                      ${payment.amount.toLocaleString()}
                    </span>
                  </div>
                  <CardDescription>
                    {format(parseISO(payment.paymentDate), 'MMMM d, yyyy')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Payment ID: {payment._id.slice(-6)}
                    </span>
                    {payment.receiptUrl && (
                      <Link href={payment.receiptUrl} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Receipt
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {history.paymentPlan && (
        <Card>
          <CardHeader>
            <CardTitle>Payment Plan</CardTitle>
            <CardDescription>
              {history.paymentPlan.status === 'active' ? 'Active' : 'Completed'} plan with {history.paymentPlan.installmentsCount} installments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="font-medium">${history.paymentPlan.totalAmount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Installment Amount</p>
                  <p className="font-medium">${history.paymentPlan.installmentAmount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Paid Installments</p>
                  <p className="font-medium">{history.paymentPlan.paidInstallments} of {history.paymentPlan.installmentsCount}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Remaining</p>
                  <p className="font-medium">{history.paymentPlan.remainingInstallments}</p>
                </div>
              </div>

              {history.paymentPlan.status === 'active' && history.paymentPlan.remainingInstallments > 0 && (
                <div className="bg-blue-50 p-3 rounded-md flex items-center space-x-3">
                  <CalendarDays className="text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">Next Payment Due</p>
                    <p className="text-sm text-blue-700">
                      {format(parseISO(history.paymentPlan.nextPaymentDate), 'MMMM d, yyyy')} - ${history.paymentPlan.installmentAmount.toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
