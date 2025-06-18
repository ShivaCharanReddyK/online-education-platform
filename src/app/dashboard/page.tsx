
"use client";

import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/shared/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import type { Application, Payment, Program } from '@/types';
import { DUMMY_APPLICATIONS, DUMMY_PROGRAMS } from '@/lib/constants'; // Assuming DUMMY_APPLICATIONS exist
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { DollarSign, CheckCircle, AlertTriangle, Clock, Loader2, FileText, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export default function StudentDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [applications, setApplications] = useState<Application[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]); // Mock payments
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/dashboard');
    } else if (user && user.role !== 'student') {
      toast({ title: "Access Denied", description: "This dashboard is for students only.", variant: "destructive"});
      router.push('/'); // Or counselor dashboard if applicable
    }
  }, [user, authLoading, router, toast]);

  useEffect(() => {
    if (user) {
      setIsLoadingData(true);
      // Simulate fetching user's applications and payments
      setTimeout(() => {
        const userApplications = DUMMY_APPLICATIONS.filter(app => app.userId === user.id);
        // In a real app, you'd also fetch from localStorage or a backend.
        const storedApplications = JSON.parse(localStorage.getItem('learnflow-applications') || '[]').filter((app: Application) => app.userId === user.id);
        const combinedApplications = [...userApplications, ...storedApplications.filter((sa: Application) => !userApplications.find(ua => ua.id === sa.id))];

        setApplications(combinedApplications);
        
        // Mock payments for approved applications
        const userPayments: Payment[] = combinedApplications
          .filter(app => app.status === 'approved')
          .map(app => ({
            id: `pay-${app.id}`,
            applicationId: app.id,
            amount: DUMMY_PROGRAMS.find(p => p.id === app.programId)?.tuitionFee || 5000,
            paymentDate: new Date().toISOString(), // Placeholder
            status: 'pending', // Default to pending payment
            paymentMethod: 'full',
          }));
        setPayments(userPayments);
        setIsLoadingData(false);
      }, 1000);
    }
  }, [user]);

  const getProgramTitle = (programId: string) => {
    return DUMMY_PROGRAMS.find(p => p.id === programId)?.title || 'Unknown Program';
  };

  const handleMakePayment = (applicationId: string, paymentMethod: 'full' | 'plan') => {
    setIsLoadingData(true);
    // Simulate payment processing
    setTimeout(() => {
      setPayments(prevPayments => prevPayments.map(p => 
        p.applicationId === applicationId ? { ...p, status: 'completed', paymentMethod } : p
      ));
      toast({
        title: "Payment Successful!",
        description: `Your ${paymentMethod} payment has been processed.`,
      });
      setIsLoadingData(false);
    }, 1500);
  };

  if (authLoading || isLoadingData) {
    return (
      <MainLayout>
        <div className="container mx-auto py-12 px-4 md:px-6 flex justify-center items-center min-h-[calc(100vh-10rem)]">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }
  
  if (!user) return null; // Should be redirected

  return (
    <MainLayout>
      <div className="container mx-auto py-8 md:py-12 px-4 md:px-6">
        <header className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight font-headline">Student Dashboard</h1>
          <p className="mt-2 text-lg text-muted-foreground">Welcome back, {user.firstName || user.email}! Manage your applications and payments here.</p>
        </header>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 font-headline flex items-center">
            <FileText className="mr-3 h-7 w-7 text-primary" /> My Applications
          </h2>
          {applications.length === 0 ? (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>No Applications Found</AlertTitle>
              <AlertDescription>
                You haven&apos;t applied to any programs yet. <Link href="/programs" className="font-medium text-primary hover:underline">Browse programs</Link> to get started.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-6">
              {applications.map(app => (
                <Card key={app.id} className="shadow-lg">
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                        <CardTitle className="text-xl font-headline mb-2 sm:mb-0">{getProgramTitle(app.programId)}</CardTitle>
                        <Badge variant={
                            app.status === 'approved' ? 'default' :
                            app.status === 'denied' ? 'destructive' :
                            'secondary'
                        } className="capitalize text-sm px-3 py-1">
                            {app.status === 'approved' && <CheckCircle className="mr-1.5 h-4 w-4" />}
                            {app.status === 'denied' && <AlertTriangle className="mr-1.5 h-4 w-4" />}
                            {app.status === 'pending' && <Clock className="mr-1.5 h-4 w-4" />}
                            Status: {app.status}
                        </Badge>
                    </div>
                    <CardDescription>Ref: {app.referenceNumber} | Submitted: {new Date(app.submissionDate).toLocaleDateString()}</CardDescription>
                  </CardHeader>
                  {app.status === 'denied' && app.denialReason && (
                     <CardContent>
                        <Alert variant="destructive" className="mt-2">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>Application Denied</AlertTitle>
                            <AlertDescription>Reason: {app.denialReason}</AlertDescription>
                        </Alert>
                     </CardContent>
                  )}
                  {app.status === 'approved' && (
                    <>
                      <Separator className="my-4"/>
                      <CardContent>
                        <h3 className="text-lg font-semibold mb-3 flex items-center">
                            <CreditCard className="mr-2 h-5 w-5 text-primary" /> Payment Required
                        </h3>
                        {payments.find(p => p.applicationId === app.id && p.status === 'pending') ? (
                          <div className="space-y-3">
                            <p className="text-muted-foreground">
                              Congratulations! Your application has been approved. Please complete your payment to secure your spot.
                              Tuition Fee: <strong className="text-foreground">${payments.find(p => p.applicationId === app.id)?.amount.toLocaleString()}</strong>
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3">
                              <Button onClick={() => handleMakePayment(app.id, 'full')} disabled={isLoadingData}>
                                {isLoadingData ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Pay Full Amount
                              </Button>
                              <Button variant="outline" onClick={() => handleMakePayment(app.id, 'plan')} disabled={isLoadingData}>
                                {isLoadingData ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Set Up Payment Plan
                              </Button>
                            </div>
                          </div>
                        ) : payments.find(p => p.applicationId === app.id && p.status === 'completed') ? (
                          <Alert variant="default" className="bg-green-50 border-green-200 text-green-700">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <AlertTitle className="text-green-700">Payment Completed!</AlertTitle>
                            <AlertDescription className="text-green-600">
                              Your payment for this program has been successfully processed using the {payments.find(p => p.applicationId === app.id)?.paymentMethod} method. Welcome aboard!
                            </AlertDescription>
                          </Alert>
                        ) : null}
                      </CardContent>
                    </>
                  )}
                   <CardFooter>
                        <Button variant="link" asChild className="p-0 h-auto">
                            <Link href={`/programs/${app.programId}`}>View Program Details</Link>
                        </Button>
                   </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </MainLayout>
  );
}
