'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { processFullPayment } from '@/actions/paymentActions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CreditCard, Lock, CheckCircle, CreditCardIcon } from 'lucide-react';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Application } from '@/types';
import { Separator } from '@/components/ui/separator';

interface PaymentFormProps {
  application: Application;
  programTitle: string;
  amount: number;
  onSuccess: (receiptUrl: string) => void;
}

export function PaymentForm({ application, programTitle, amount, onSuccess }: PaymentFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvc: '',
    cardholderName: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Format card number with spaces
    if (e.target.name === 'cardNumber') {
      value = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      value = value.substring(0, 19); // Limit to 16 digits + 3 spaces
    }
    
    // Format expiry date with slash
    if (e.target.name === 'expiryDate') {
      value = value.replace(/\D/g, '');
      if (value.length > 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
      }
    }
    
    setCardDetails({
      ...cardDetails,
      [e.target.name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // In a real implementation, we would use Stripe Elements here
      // For our dummy implementation, we'll just simulate a successful payment
      
      // Simulate Stripe payment intent ID
      const paymentIntentId = `pi_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
      
      const result = await processFullPayment(
        application.id,
        paymentIntentId,
        amount
      );
      
      if (!result.success) {
        throw new Error(result.error || 'Payment failed');
      }
      
      toast({
        title: 'Payment Successful',
        description: 'Your payment has been processed successfully.',
      });
      
      // Call success handler with receipt URL
      if (result.receiptUrl) {
        onSuccess(result.receiptUrl);
      }
    } catch (error: any) {
      toast({
        title: 'Payment Failed',
        description: error.message || 'An error occurred processing your payment.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-semibold text-primary flex items-center justify-center gap-2">
          <CreditCard className="h-5 w-5" />
          Make Full Payment
        </h2>
        <p className="text-muted-foreground mt-1">
          Pay the full amount to secure your spot in the program
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Left Side - Payment Summary */}
        <div className="md:col-span-2 space-y-4">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Payment Summary</CardTitle>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-muted-foreground">Program</div>
                  <div className="font-medium">{programTitle}</div>
                </div>
                
                <div>
                  <div className="text-sm text-muted-foreground">Reference</div>
                  <div className="font-medium">{application.referenceNumber}</div>
                </div>
              </div>
            </CardContent>
            <Separator />
            <CardFooter className="pt-3">
              <div className="w-full flex justify-between items-center">
                <span className="text-sm font-medium">Total Amount</span>
                <span className="text-2xl font-bold text-primary">${amount.toLocaleString()}</span>
              </div>
            </CardFooter>
          </Card>
          
          <div className="bg-green-50 border border-green-100 rounded-lg p-3 flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-green-700">
              <p className="font-medium">Secure Transaction</p>
              <p className="text-green-600 mt-1">Your payment information is encrypted and secure.</p>
            </div>
          </div>
        </div>
        
        {/* Right Side - Payment Form */}
        <div className="md:col-span-3">
          <Card className="border shadow-sm">
            <CardHeader className="border-b bg-muted/30 pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Card Information</CardTitle>
                <div className="flex items-center space-x-1">
                  <div className="w-10 h-6 bg-blue-600 rounded"></div>
                  <div className="w-10 h-6 bg-red-500 rounded"></div>
                  <div className="w-10 h-6 bg-gray-800 rounded"></div>
                </div>
              </div>
            </CardHeader>
            
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="cardholderName">Cardholder Name</Label>
                  <Input 
                    id="cardholderName"
                    name="cardholderName"
                    placeholder="Name on card"
                    value={cardDetails.cardholderName}
                    onChange={handleChange}
                    className="border-muted-foreground/30"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <div className="relative">
                    <Input 
                      id="cardNumber"
                      name="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardDetails.cardNumber}
                      onChange={handleChange}
                      className="pl-11 border-muted-foreground/30"
                      required
                    />
                    <CreditCardIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input 
                      id="expiryDate"
                      name="expiryDate"
                      placeholder="MM/YY"
                      value={cardDetails.expiryDate}
                      onChange={handleChange}
                      className="border-muted-foreground/30"
                      required
                      maxLength={5}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvc">CVC</Label>
                    <Input 
                      id="cvc"
                      name="cvc"
                      placeholder="123"
                      value={cardDetails.cvc}
                      onChange={handleChange}
                      className="border-muted-foreground/30"
                      required
                      maxLength={3}
                    />
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="border-t bg-muted/20 pt-4 pb-4">
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full h-11"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing Payment...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Lock className="mr-2 h-4 w-4" />
                      Pay ${amount.toLocaleString()}
                    </div>
                  )}
                </Button>
                
                <p className="w-full text-center text-xs text-muted-foreground mt-3">
                  By completing this payment, you agree to our Terms of Service
                </p>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
