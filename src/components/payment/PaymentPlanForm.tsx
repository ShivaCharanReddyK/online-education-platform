'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { setupPaymentPlan } from '@/actions/paymentActions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Calendar, FileText, Calculator, CheckCircle, Clock } from 'lucide-react';
import { Application } from '@/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { format, addDays } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

interface PaymentPlanFormProps {
  application: Application;
  programTitle: string;
  totalAmount: number;
  onSuccess: () => void;
}

export function PaymentPlanForm({ application, programTitle, totalAmount, onSuccess }: PaymentPlanFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [installments, setInstallments] = useState('3');
  
  const calculateMonthlyPayment = () => {
    return Math.ceil(totalAmount / parseInt(installments));
  };
  
  const getPaymentDates = () => {
    const dates = [];
    const installmentCount = parseInt(installments);
    
    for (let i = 0; i < installmentCount; i++) {
      dates.push(addDays(new Date(), i * 30));
    }
    
    return dates;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    
    try {
      const result = await setupPaymentPlan(
        application.id,
        totalAmount,
        parseInt(installments)
      );
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to set up payment plan');
      }
      
      toast({
        title: 'Payment Plan Created',
        description: `Your payment plan has been set up. Your first installment of $${calculateMonthlyPayment()} is due on ${format(result.nextPaymentDate!, 'MMMM d, yyyy')}.`,
      });
      
      onSuccess();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to set up payment plan',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-semibold text-blue-600 flex items-center justify-center gap-2">
          <Calendar className="h-5 w-5" />
          Set Up Payment Plan
        </h2>
        <p className="text-muted-foreground mt-1">
          Split your payment for {programTitle} into monthly installments
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Left Side - Payment Schedule */}
        <div className="md:col-span-3 space-y-4">
          <Card>
            <CardHeader className="pb-3 border-b bg-blue-50">
              <CardTitle className="flex items-center text-blue-700">
                <FileText className="mr-2 h-5 w-5" />
                Payment Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                {getPaymentDates().map((date, index) => (
                  <div key={index} className="flex items-center p-3 rounded-md border bg-muted/30">
                    <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-sm mr-3">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-muted-foreground">Payment {index + 1}</div>
                      <div className="font-medium">{format(date, 'MMMM d, yyyy')}</div>
                    </div>
                    <div className="font-semibold text-right">
                      ${calculateMonthlyPayment().toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 flex justify-between items-center pt-3 border-t">
                <div className="text-sm font-medium">Total amount:</div>
                <div className="font-semibold text-lg">${totalAmount.toLocaleString()}</div>
              </div>
            </CardContent>
          </Card>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-700">
              <p className="font-medium">Flexible Payment Plan</p>
              <p className="text-blue-600 mt-1">No interest charges. No credit check required. Just split your tuition into manageable installments.</p>
            </div>
          </div>
        </div>
        
        {/* Right Side - Payment Plan Form */}
        <div className="md:col-span-2">
          <Card className="border shadow-sm">
            <CardHeader className="border-b bg-muted/30 pb-3">
              <CardTitle className="text-lg flex items-center">
                <Calculator className="mr-2 h-5 w-5" />
                Customize Your Plan
              </CardTitle>
            </CardHeader>
            
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="total-amount">Program Cost</Label>
                  <Input 
                    id="total-amount" 
                    value={`$${totalAmount.toLocaleString()}`}
                    className="font-medium"
                    disabled
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="installments">Number of Installments</Label>
                  <Select
                    value={installments}
                    onValueChange={setInstallments}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="border-muted-foreground/30">
                      <SelectValue placeholder="Select number of installments" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 Monthly Payments</SelectItem>
                      <SelectItem value="6">6 Monthly Payments</SelectItem>
                      <SelectItem value="12">12 Monthly Payments</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="monthly-payment">Monthly Payment</Label>
                  <div className="relative">
                    <Input 
                      id="monthly-payment" 
                      value={`$${calculateMonthlyPayment().toLocaleString()}`}
                      className="bg-blue-50 border-blue-200 font-semibold text-blue-700"
                      disabled
                    />
                    <Badge className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600">
                      per month
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                  <Clock className="h-4 w-4" />
                  First payment due immediately
                </div>
              </CardContent>
              
              <CardFooter className="border-t pt-4">
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full h-11"
                  variant="outline"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Setting Up Plan...
                    </div>
                  ) : (
                    'Confirm Payment Plan'
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
