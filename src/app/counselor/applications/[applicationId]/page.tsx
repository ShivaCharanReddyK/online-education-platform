
"use client";

import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/shared/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import type { Application, Program, AIRecommendationOutput } from '@/types';
import { DUMMY_APPLICATIONS, DUMMY_PROGRAMS } from '@/lib/constants';
import { AIProgramRecommender } from '@/components/application/AIProgramRecommender';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { CheckCircle, XCircle, Loader2, UserCircle, BookOpen, FileText, MessageSquare, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ApplicationReviewPage({ params }: { params: { applicationId: string } }) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [application, setApplication] = useState<Application | null>(null);
  const [program, setProgram] = useState<Program | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [denialReason, setDenialReason] = useState('');
  const [showDenialDialog, setShowDenialDialog] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState<AIRecommendationOutput | null>(null);


  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/login?redirect=/counselor/applications/${params.applicationId}`);
    } else if (user && user.role !== 'counselor') {
      toast({ title: "Access Denied", description: "This page is for counselors only.", variant: "destructive"});
      router.push('/');
    }
  }, [user, authLoading, router, params.applicationId, toast]);

  useEffect(() => {
    if (user && user.role === 'counselor') {
      setIsLoadingData(true);
      // Simulate fetching application data
      setTimeout(() => {
        const allApplications = [
            ...DUMMY_APPLICATIONS,
            ...JSON.parse(localStorage.getItem('learnflow-applications') || '[]')
                .filter((storedApp: Application) => !DUMMY_APPLICATIONS.find(da => da.id === storedApp.id))
        ];
        const foundApp = allApplications.find((app: Application) => app.id === params.applicationId);
        
        if (foundApp) {
          setApplication(foundApp);
          const foundProgram = DUMMY_PROGRAMS.find(p => p.id === foundApp.programId);
          setProgram(foundProgram || null);
        } else {
          toast({ title: "Error", description: "Application not found.", variant: "destructive"});
          router.push('/counselor/dashboard');
        }
        setIsLoadingData(false);
      }, 1000);
    }
  }, [user, params.applicationId, router, toast]);

  const updateApplicationStatus = (status: 'approved' | 'denied', reason?: string) => {
    if (!application) return;
    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      const updatedApp = { ...application, status, denialReason: reason };
      setApplication(updatedApp);

      // Update in localStorage for demo
      let storedApps: Application[] = JSON.parse(localStorage.getItem('learnflow-applications') || '[]');
      const appIndex = storedApps.findIndex(a => a.id === application.id);
      if (appIndex > -1) {
        storedApps[appIndex] = updatedApp;
      } else {
        storedApps.push(updatedApp); // Should not happen if app was found initially
      }
      localStorage.setItem('learnflow-applications', JSON.stringify(storedApps));
      
      // Also update DUMMY_APPLICATIONS if it's there (for non-localStorage ones)
      const dummyAppIndex = DUMMY_APPLICATIONS.findIndex(a => a.id === application.id);
      if (dummyAppIndex > -1) {
        DUMMY_APPLICATIONS[dummyAppIndex] = updatedApp;
      }


      toast({
        title: `Application ${status === 'approved' ? 'Approved' : 'Denied'}`,
        description: `The application has been successfully updated. An email notification ${status === 'approved' ? 'will be sent.' : 'with feedback and recommendations will be sent.'}`,
      });
      setIsProcessing(false);
      if (status === 'denied') setShowDenialDialog(false);
    }, 1500);
  };

  const handleApprove = () => {
    updateApplicationStatus('approved');
  };

  const handleDenySubmit = () => {
    if (!denialReason.trim()) {
        toast({title: "Error", description: "Please provide a reason for denial.", variant: "destructive"});
        return;
    }
    updateApplicationStatus('denied', denialReason);
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

  if (!user || !application || !program) return null; // Should be redirected or error handled by useEffect

  const applicationDetails = [
    { label: "Full Name", value: `${application.personalDetails.firstName} ${application.personalDetails.lastName}` },
    { label: "Email", value: DUMMY_APPLICATIONS.find(a=>a.id === application.id)?.personalDetails.email || 'student@example.com' /* Placeholder */ },
    { label: "Date of Birth", value: new Date(application.personalDetails.dateOfBirth).toLocaleDateString() },
    { label: "Phone", value: application.personalDetails.phone },
    { label: "Address", value: application.personalDetails.address },
  ];

  const educationDetails = [
    { label: "Highest Qualification", value: application.educationalBackground.highestQualification },
    { label: "Institution", value: application.educationalBackground.institution },
    { label: "Year of Completion", value: application.educationalBackground.yearOfCompletion },
  ];

  return (
    <MainLayout>
      <div className="container mx-auto py-8 md:py-12 px-4 md:px-6">
        <header className="mb-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
                <h1 className="text-4xl font-bold tracking-tight font-headline">Application Review</h1>
                <p className="mt-1 text-lg text-muted-foreground">For: {program.title}</p>
            </div>
            <Badge variant={
                application.status === 'approved' ? 'default' :
                application.status === 'denied' ? 'destructive' :
                'secondary'
            } className="capitalize text-md px-4 py-2 mt-4 sm:mt-0">
                Status: {application.status}
            </Badge>
          </div>
          <Separator className="my-6" />
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-headline flex items-center"><UserCircle className="mr-3 h-6 w-6 text-primary" /> Personal Details</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                {applicationDetails.map(detail => (
                  <div key={detail.label}>
                    <p className="text-sm font-medium text-muted-foreground">{detail.label}</p>
                    <p className="text-md font-semibold">{detail.value}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-headline flex items-center"><BookOpen className="mr-3 h-6 w-6 text-primary" /> Educational Background</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                {educationDetails.map(detail => (
                  <div key={detail.label}>
                    <p className="text-sm font-medium text-muted-foreground">{detail.label}</p>
                    <p className="text-md font-semibold">{detail.value}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-headline flex items-center"><FileText className="mr-3 h-6 w-6 text-primary" /> Statement of Purpose</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-md leading-relaxed whitespace-pre-wrap">{application.statementOfPurpose}</p>
              </CardContent>
            </Card>
          </div>

          <aside className="lg:col-span-1 space-y-6">
            <Card className="shadow-lg sticky top-20">
              <CardHeader>
                <CardTitle className="text-xl font-headline flex items-center"><MessageSquare className="mr-3 h-6 w-6 text-primary" /> Actions & Feedback</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {application.status === 'pending' ? (
                  <>
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white" onClick={handleApprove} disabled={isProcessing}>
                      {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                      Approve Application
                    </Button>
                    
                    <Dialog open={showDenialDialog} onOpenChange={setShowDenialDialog}>
                      <DialogTrigger asChild>
                        <Button variant="destructive" className="w-full" disabled={isProcessing}>
                          {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <XCircle className="mr-2 h-4 w-4" />}
                          Deny Application
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[525px]">
                        <DialogHeader>
                          <DialogTitle className="font-headline text-2xl">Deny Application</DialogTitle>
                          <DialogDescription>
                            Provide a reason for denial. This will be included in the email to the applicant.
                            Optionally, use the AI tool to suggest other relevant programs.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4 space-y-4">
                          <div>
                            <Label htmlFor="denialReason" className="text-md">Reason for Denial</Label>
                            <Textarea
                              id="denialReason"
                              value={denialReason}
                              onChange={(e) => setDenialReason(e.target.value)}
                              placeholder="Explain why the application is being denied..."
                              rows={4}
                              className="mt-1"
                            />
                          </div>
                          <AIProgramRecommender
                            compact
                            initialValues={{
                                background: `${application.educationalBackground.highestQualification} from ${application.educationalBackground.institution}`,
                                interests: "Related to applied program", // Generic placeholder
                                statementOfPurpose: application.statementOfPurpose
                            }}
                            onRecommendation={setAiRecommendation}
                           />
                        </div>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button type="button" variant="outline" disabled={isProcessing}>Cancel</Button>
                          </DialogClose>
                          <Button type="button" variant="destructive" onClick={handleDenySubmit} disabled={isProcessing || !denialReason.trim()}>
                            {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Confirm Denial
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </>
                ) : (
                  <Alert variant={application.status === 'approved' ? 'default' : 'destructive'} className={application.status === 'approved' ? 'bg-green-50 border-green-200' : ''}>
                    {application.status === 'approved' ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                    <AlertTitle className={application.status === 'approved' ? 'text-green-700' : ''}>Application {application.status}</AlertTitle>
                    <AlertDescription className={application.status === 'approved' ? 'text-green-600' : ''}>
                      This application has been {application.status}.
                      {application.status === 'denied' && application.denialReason && (
                        <p className="mt-2"><strong>Reason:</strong> {application.denialReason}</p>
                      )}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
              <CardFooter>
                 <Button variant="outline" className="w-full" onClick={() => router.back()} disabled={isProcessing}>
                    Back to Dashboard
                </Button>
              </CardFooter>
            </Card>
          </aside>
        </div>
      </div>
    </MainLayout>
  );
}

