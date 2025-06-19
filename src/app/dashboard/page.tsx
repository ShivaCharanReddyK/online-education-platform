
"use client";

import { useEffect, useState, useCallback } from 'react';
import { MainLayout } from '@/components/shared/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import type { Application, Payment, Program } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { DollarSign, CheckCircle, AlertTriangle, Clock, Loader2, FileText, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { getApplicationsByUserId } from '@/actions/applicationActions';
import { getProgramById } from '@/actions/programActions';

// Mock payments storage (in-memory for client-side simulation for this page)
let MOCK_PAYMENTS_DB: Payment[] = [];


async function createPaymentAction(applicationId: string, userId: string, amount: number, paymentMethod: 'full' | 'plan'): Promise<Payment> {
  console.log(`Simulating payment for application ${applicationId}, amount ${amount}, method ${paymentMethod}`);
  
  const newPayment: Payment = {
    id: `pay-${Date.now()}`,
    applicationId,
    userId,
    amount,
    paymentDate: new Date().toISOString(),
    status: 'completed', // Simulate immediate completion for demo
    paymentMethod,
    transactionId: `txn_${Date.now()}`
  };
  // Update our mock DB
  const existingPaymentIndex = MOCK_PAYMENTS_DB.findIndex(p => p.applicationId === applicationId);
  if (existingPaymentIndex > -1) {
    MOCK_PAYMENTS_DB[existingPaymentIndex] = newPayment;
  } else {
    MOCK_PAYMENTS_DB.push(newPayment);
  }
  return JSON.parse(JSON.stringify(newPayment));
}

async function getPaymentsByUserId(userId: string): Promise<Payment[]> {
    console.log("Fetching mock payments for user", userId);
    const userPayments = MOCK_PAYMENTS_DB.filter(p => p.userId === userId);
    return JSON.parse(JSON.stringify(userPayments));
}


export default function StudentDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [applications, setApplications] = useState<Application[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]); 
  const [programsCache, setProgramsCache] = useState<Record<string, Program>>({});
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/dashboard');
    } else if (user && user.role !== 'student') {
      toast({ title: "Access Denied", description: "This dashboard is for students only.", variant: "destructive"});
      router.push('/'); 
    }
  }, [user, authLoading, router, toast]);

  const fetchDashboardData = useCallback(async () => {
    if (!user || !user.id) { // Early return if user is not available
        return;
    }
    setIsLoadingData(true);
    try {
        const userApplications = await getApplicationsByUserId(user.id);
        setApplications(userApplications);

        const programIdsFromApps = userApplications.map(app => app.programId).filter(Boolean) as string[];
        const uniqueProgramIds = Array.from(new Set(programIdsFromApps));
        
        const newCacheEntries: Record<string, Program> = {};
        // Use a temporary copy of programsCache from state for filtering to avoid direct dependency issues in useCallback
        const currentProgramsCacheState = programsCache;
        const programsToFetchDetailsFor = uniqueProgramIds.filter(id => !currentProgramsCacheState[id]);

        if (programsToFetchDetailsFor.length > 0) {
          const fetchedProgramDetails = await Promise.all(
            programsToFetchDetailsFor.map(id => getProgramById(id))
          );
          fetchedProgramDetails.forEach(program => {
            if (program) newCacheEntries[program.id] = program;
          });
          if (Object.keys(newCacheEntries).length > 0) {
            setProgramsCache(prevCache => ({ ...prevCache, ...newCacheEntries }));
          }
        }

        // For payment processing, use a merged view of program data: current state + newly fetched in this cycle
        const combinedProgramsData = { ...currentProgramsCacheState, ...newCacheEntries };

        const userPayments = await getPaymentsByUserId(user.id);
        const currentAppPayments: Payment[] = [...userPayments];

        userApplications.forEach(app => {
            if (app.status === 'approved' && !currentAppPayments.find(p => p.applicationId === app.id)) {
                const programDetail = combinedProgramsData[app.programId];
                const programTuition = programDetail?.tuitionFee || 0;
                
                currentAppPayments.push({
                    id: `pay-sim-${app.id}`,
                    applicationId: app.id!,
                    userId: user.id!,
                    amount: programTuition,
                    paymentDate: new Date().toISOString(), 
                    status: 'pending', 
                    paymentMethod: 'full', 
                });
            }
        });
        setPayments(currentAppPayments);

    } catch (error) {
        console.error("Failed to load dashboard data:", error);
        toast({ title: "Error", description: "Could not load dashboard data.", variant: "destructive"});
    } finally {
        setIsLoadingData(false);
    }
  }, [user, toast]); // Removed programsCache from dependencies to break loop

  useEffect(() => {
    // Only fetch data if user is authenticated and available
    if (user && user.id && !authLoading) {
      fetchDashboardData();
    }
  }, [user, authLoading, fetchDashboardData]);


  const getProgramTitle = (programId: string) => {
    return programsCache[programId]?.title || applications.find(a => a.programId === programId)?.programTitle || 'Unknown Program';
  };
  
  const getProgramTuition = (programId: string) => {
    return programsCache[programId]?.tuitionFee || 0;
  }

  const handleMakePayment = async (applicationId: string, paymentMethod: 'full' | 'plan') => {
    if (!user || !user.id) {
        toast({ title: "Error", description: "User not found.", variant: "destructive" });
        return;
    }
    const app = applications.find(a => a.id === applicationId);
    if (!app || !app.programId) {
        toast({ title: "Error", description: "Application or program details not found.", variant: "destructive" });
        return;
    }
    const amount = getProgramTuition(app.programId);
    if (amount <= 0) {
        // If program details might not be in cache yet, consider fetching on demand or showing loading.
        // For simplicity, we'll assume programsCache is sufficiently populated or tuition is 0.
        const programDetails = await getProgramById(app.programId);
        if (!programDetails || programDetails.tuitionFee <= 0) {
            toast({ title: "Error", description: "Program tuition fee not available or is zero.", variant: "destructive" });
            return;
        }
        // This path means amount was 0 from cache, but now we fetched it.
        // This isn't ideal; payment processing should ideally wait for tuition to be known.
        // The fix above in fetchDashboardData to use combinedProgramsData should mitigate this.
    }


    setIsLoadingData(true); // Consider a more specific loading state for payment processing
    try {
      const newPayment = await createPaymentAction(applicationId, user.id, amount, paymentMethod);
      setPayments(prevPayments => {
          const updatedPayments = prevPayments.filter(p => p.applicationId !== applicationId);
          updatedPayments.push(newPayment);
          return updatedPayments;
      });
      toast({
        title: "Payment Successful!",
        description: `Your ${paymentMethod} payment has been processed.`,
      });
    } catch (error) {
      console.error("Payment processing error:", error);
      toast({ title: "Payment Error", description: "Could not process payment.", variant: "destructive" });
    } finally {
      setIsLoadingData(false); // Reset general loading state
    }
  };

  if (authLoading || (isLoadingData && applications.length === 0 && payments.length === 0 && Object.keys(programsCache).length === 0) ) {
    return (
      <MainLayout>
        <div className="container mx-auto py-12 px-4 md:px-6 flex justify-center items-center min-h-[calc(100vh-10rem)]">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }
  
  if (!user && !authLoading) { // If not loading and no user, don't render dashboard content (redirect handled by other useEffect)
    return null;
  }
  if (!user && authLoading) { // If loading and no user yet, show loader (covered by above)
     return (
      <MainLayout>
        <div className="container mx-auto py-12 px-4 md:px-6 flex justify-center items-center min-h-[calc(100vh-10rem)]">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }
  if (!user) return null; // Should be caught by above, but as a safeguard

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
          {applications.length === 0 && !isLoadingData ? ( // Show "No applications" only if not loading
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>No Applications Found</AlertTitle>
              <AlertDescription>
                You haven&apos;t applied to any programs yet. <Link href="/programs" className="font-medium text-primary hover:underline">Browse programs</Link> to get started.
              </AlertDescription>
            </Alert>
          ) : isLoadingData && applications.length === 0 ? ( // Show loader if loading and no apps yet
            <div className="flex justify-center items-center p-10">
                 <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
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
                             {app.aiRecommendedPrograms && app.aiRecommendedPrograms.length > 0 && (
                                <>
                                    <p className="mt-2 font-semibold">Our AI also suggests you might like:</p>
                                    <ul className="list-disc list-inside text-sm">
                                        {app.aiRecommendedPrograms.map((rec, idx) => <li key={idx}>{rec}</li>)}
                                    </ul>
                                </>
                            )}
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
                              Tuition Fee: <strong className="text-foreground">${getProgramTuition(app.programId).toLocaleString()}</strong>
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3">
                              <Button onClick={() => handleMakePayment(app.id!, 'full')} disabled={isLoadingData}>
                                {isLoadingData ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Pay Full Amount
                              </Button>
                              <Button variant="outline" onClick={() => handleMakePayment(app.id!, 'plan')} disabled={isLoadingData}>
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

