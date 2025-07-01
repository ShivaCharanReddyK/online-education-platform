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
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, CheckCircle, AlertTriangle, Clock, Loader2, FileText, CreditCard, Calendar, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { getApplicationsByUserId, deleteApplicationAction } from '@/actions/applicationActions';
import { getProgramById } from '@/actions/programActions';
import { PaymentForm } from '@/components/payment/PaymentForm';
import { PaymentPlanForm } from '@/components/payment/PaymentPlanForm';
import { PaymentHistory } from '@/components/payment/PaymentHistory';
import { getUserPaymentHistory } from '@/actions/paymentActions';


export default function StudentDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [applications, setApplications] = useState<Application[]>([]);
  const [payments, setPayments] = useState<any[]>([]); 
  const [programsCache, setProgramsCache] = useState<Record<string, Program>>({});
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isDeletingApplication, setIsDeletingApplication] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [applicationToDelete, setApplicationToDelete] = useState<string | null>(null);
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/dashboard');
    } else if (user && user.role !== 'student') {
      toast({ title: "Access Denied", description: "This dashboard is for students only.", variant: "destructive"});
      router.push('/'); 
    }
  }, [user, authLoading, router, toast]);

  const fetchDashboardData = useCallback(async () => {
    if (!user || !user.id) { 
        return;
    }
    setIsLoadingData(true);
    try {
        const userApplications = await getApplicationsByUserId(user.id);
        setApplications(userApplications);

        const programIdsFromApps = userApplications.map(app => app.programId).filter(Boolean) as string[];
        const uniqueProgramIds = Array.from(new Set(programIdsFromApps));
        
        const newCacheEntries: Record<string, Program> = {};
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

        // Get payment history
        const paymentHistoryResult = await getUserPaymentHistory(user.id);
        if (paymentHistoryResult.success) {
          setPayments(paymentHistoryResult.payments || []);
        }
    } catch (error) {
        console.error("Failed to load dashboard data:", error);
        toast({ title: "Error", description: "Could not load dashboard data.", variant: "destructive"});
    } finally {
        setIsLoadingData(false);
    }
  }, [user, toast, programsCache]); 

  useEffect(() => {
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

  const handleDeleteApplication = async (applicationId: string) => {
    if (!applicationId) return;
    
    setIsDeletingApplication(applicationId);
    try {
      const result = await deleteApplicationAction(applicationId);
      if (result.success) {
        // Remove the application from the list
        setApplications(prevApplications => 
          prevApplications.filter(app => app.id !== applicationId)
        );
        toast({
          title: "Application Deleted",
          description: "Your application has been successfully deleted."
        });
        setShowDeleteDialog(false);
      } else {
        throw new Error(result.message || "Failed to delete application");
      }
    } catch (error) {
      console.error("Delete application error:", error);
      toast({
        title: "Delete Failed",
        description: "Could not delete application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsDeletingApplication(null);
      setApplicationToDelete(null);
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
  
  if (!user && !authLoading) { 
    return null;
  }
  if (!user && authLoading) { 
     return (
      <MainLayout>
        <div className="container mx-auto py-12 px-4 md:px-6 flex justify-center items-center min-h-[calc(100vh-10rem)]">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }
  if (!user) return null; 

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
          {applications.length === 0 && !isLoadingData ? ( 
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>No Applications Found</AlertTitle>
              <AlertDescription>
                You haven&apos;t applied to any programs yet.{" "}
                <Button variant="link" asChild className="p-0 h-auto font-medium text-primary hover:underline">
                  <Link href="/programs">Browse programs</Link>
                </Button>
                {" "}to get started.
              </AlertDescription>
            </Alert>
          ) : isLoadingData && applications.length === 0 ? ( 
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
                        <div className="mt-4">
                          <Button variant="outline" asChild>
                              <Link href="/programs">Browse Other Programs</Link>
                          </Button>
                        </div>
                     </CardContent>
                  )}
                  {app.status === 'approved' && (
                    <>
                      <Separator className="my-4"/>
                      <CardContent>
                        <h3 className="text-lg font-semibold mb-3 flex items-center">
                            <CreditCard className="mr-2 h-5 w-5 text-primary" /> Payment Required
                        </h3>
                        {!app.paymentStatus || app.paymentStatus === 'unpaid' ? (
                          <div className="space-y-4">
                            <div className="max-w-4xl mx-auto text-center mb-6">
                              <Badge variant="outline" className="mb-2 bg-green-50 text-green-600 border-green-200">
                                Application Approved
                              </Badge>
                              <h3 className="text-xl font-semibold mb-2">Complete Your Payment</h3>
                              <p className="text-muted-foreground">
                                Congratulations! Your application has been approved. Please complete your payment to secure your spot.
                              </p>
                              <div className="mt-2 text-lg font-semibold">
                                Tuition Fee: <span className="text-primary">${getProgramTuition(app.programId).toLocaleString()}</span>
                              </div>
                            </div>
                            
                            <Tabs defaultValue="full-payment" className="w-full">
                              <div className="bg-muted/30 p-4 rounded-lg mb-6 max-w-md mx-auto">
                                <TabsList className="grid grid-cols-2 w-full">
                                  <TabsTrigger value="full-payment" className="text-sm font-medium py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                                    <div className="flex items-center gap-2">
                                      <CreditCard className="h-4 w-4" />
                                      Full Payment
                                    </div>
                                  </TabsTrigger>
                                  <TabsTrigger value="payment-plan" className="text-sm font-medium py-2.5 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                                    <div className="flex items-center gap-2">
                                      <Calendar className="h-4 w-4" />
                                      Payment Plan
                                    </div>
                                  </TabsTrigger>
                                </TabsList>
                              </div>
                              
                              <TabsContent value="full-payment" className="mt-0">
                                <div className="bg-white rounded-lg p-6 shadow-sm border">
                                  <PaymentForm 
                                    application={app} 
                                    programTitle={getProgramTitle(app.programId)}
                                    amount={getProgramTuition(app.programId)}
                                    onSuccess={(url) => {
                                      setReceiptUrl(url);
                                      toast({
                                        title: "Payment Successful",
                                        description: "Your payment has been processed successfully!"
                                      });
                                      fetchDashboardData();
                                    }}
                                  />
                                </div>
                              </TabsContent>
                              
                              <TabsContent value="payment-plan" className="mt-0">
                                <div className="bg-white rounded-lg p-6 shadow-sm border">
                                  <PaymentPlanForm 
                                    application={app}
                                    programTitle={getProgramTitle(app.programId)}
                                    totalAmount={getProgramTuition(app.programId)}
                                    onSuccess={() => {
                                      toast({
                                        title: "Payment Plan Created",
                                        description: "Your payment plan has been set up successfully!"
                                      });
                                      fetchDashboardData();
                                    }}
                                  />
                                </div>
                              </TabsContent>
                            </Tabs>
                          </div>
                        ) : app.paymentStatus === 'paid' || app.paymentStatus === 'partial' ? (
                          <div className="space-y-6 max-w-4xl mx-auto">
                            <Alert variant="default" className={app.paymentStatus === 'paid' ? "bg-green-50 border-green-200 text-green-700" : "bg-blue-50 border-blue-200 text-blue-700"}>
                              {app.paymentStatus === 'paid' ? (
                                <CheckCircle className="h-5 w-5 text-green-600" />
                              ) : (
                                <Clock className="h-5 w-5 text-blue-600" />
                              )}
                              <AlertTitle className={app.paymentStatus === 'paid' ? "text-green-700" : "text-blue-700"}>
                                {app.paymentStatus === 'paid' ? 'Payment Completed!' : 'Payment Plan Active'}
                              </AlertTitle>
                              <AlertDescription className={app.paymentStatus === 'paid' ? "text-green-600" : "text-blue-600"}>
                                {app.paymentStatus === 'paid' 
                                  ? 'Your payment for this program has been successfully processed. Welcome aboard!'
                                  : 'Your payment plan is active. Please check the payment history for details.'}
                              </AlertDescription>
                            </Alert>
                            
                            <div className="mt-8">
                              <div className="mb-5 pb-2 border-b">
                                <h3 className="text-lg font-medium flex items-center gap-2">
                                  <FileText className="h-5 w-5 text-primary" /> Payment History
                                </h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                  View your payment records and plan details
                                </p>
                              </div>
                              <div className="bg-white rounded-lg p-6 shadow-sm border">
                                <PaymentHistory application={app} />
                              </div>
                            </div>
                          </div>
                        ) : null}
                      </CardContent>
                    </>
                  )}
                   <CardFooter className="flex justify-between">
                     <div className="flex items-center gap-3">
                         <Button variant="link" asChild className="p-0 h-auto">
                             <Link href={`/programs/${app.programId}`}>View Program Details</Link>
                         </Button>
                     </div>
                     {/* Add delete button for both pending and denied applications */}
                     {(app.status === 'pending' || app.status === 'denied') && (
                       <Button 
                         variant="outline" 
                         className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-700"
                         onClick={() => {
                           setApplicationToDelete(app.id);
                           setShowDeleteDialog(true);
                         }}
                       >
                         <Trash2 className="h-4 w-4 mr-2" />
                         Delete Application
                       </Button>
                     )}
                   </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
      
      {/* Global Dialog for Application Deletion */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Application</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete your application for {applicationToDelete && getProgramTitle(applications.find(app => app.id === applicationToDelete)?.programId || '')}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" onClick={() => setApplicationToDelete(null)}>Cancel</Button>
            </DialogClose>
            <Button 
              variant="destructive" 
              onClick={() => applicationToDelete && handleDeleteApplication(applicationToDelete)}
              disabled={isDeletingApplication !== null}
            >
              {isDeletingApplication !== null ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Delete Application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}

