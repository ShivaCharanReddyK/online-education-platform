
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/shared/MainLayout';
import { DUMMY_PROGRAMS } from '@/lib/constants';
import type { Program, Application } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Send, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import Link from 'next/link';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';


const applicationSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters."),
  lastName: z.string().min(2, "Last name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  dateOfBirth: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date."),
  phone: z.string().min(10, "Phone number must be at least 10 digits."),
  address: z.string().min(5, "Address is too short."),
  highestQualification: z.string().min(2, "Qualification is required."),
  institution: z.string().min(2, "Institution name is required."),
  yearOfCompletion: z.string().regex(/^\d{4}$/, "Invalid year format (YYYY)."),
  statementOfPurpose: z.string().min(50, "Statement of purpose must be at least 50 characters.").max(2000, "Statement is too long."),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

export default function ApplyPage({ params }: { params: { programId: string } }) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [program, setProgram] = useState<Program | null>(null);
  const [isLoadingProgram, setIsLoadingProgram] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationSubmitted, setApplicationSubmitted] = useState<Application | null>(null);

  const form = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: user?.email || '',
      dateOfBirth: '',
      phone: '',
      address: '',
      highestQualification: '',
      institution: '',
      yearOfCompletion: '',
      statementOfPurpose: '',
    },
  });

  useEffect(() => {
    if (!authLoading && !user) {
      toast({ title: "Authentication Required", description: "Please log in to apply for a program.", variant: "destructive" });
      router.push(`/login?redirect=/apply/${params.programId}`);
    } else if (user) {
      form.reset({ ...form.getValues(), email: user.email });
    }
  }, [user, authLoading, router, params.programId, toast, form]);

  useEffect(() => {
    setIsLoadingProgram(true);
    const foundProgram = DUMMY_PROGRAMS.find(p => p.id === params.programId);
    setTimeout(() => { // Simulate network delay
      if (foundProgram) {
        setProgram(foundProgram);
      } else {
        toast({ title: "Error", description: "Program not found.", variant: "destructive" });
        router.push('/programs');
      }
      setIsLoadingProgram(false);
    }, 500);
  }, [params.programId, toast, router]);

  const onSubmit = async (data: ApplicationFormData) => {
    if (!user) {
        toast({ title: "Error", description: "You must be logged in to submit an application.", variant: "destructive" });
        return;
    }
    setIsSubmitting(true);
    // Simulate API call for submission
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newApplication: Application = {
        id: `app-${Date.now()}`,
        userId: user.id,
        programId: params.programId,
        personalDetails: {
            firstName: data.firstName,
            lastName: data.lastName,
            dateOfBirth: data.dateOfBirth,
            phone: data.phone,
            address: data.address,
        },
        educationalBackground: {
            highestQualification: data.highestQualification,
            institution: data.institution,
            yearOfCompletion: data.yearOfCompletion,
        },
        statementOfPurpose: data.statementOfPurpose,
        status: 'pending',
        referenceNumber: `LF${new Date().getFullYear()}${Math.floor(1000 + Math.random() * 9000)}`,
        submissionDate: new Date().toISOString(),
    };
    
    // In a real app, you'd save this to your DB. We'll store in localStorage for demo.
    const existingApplications = JSON.parse(localStorage.getItem('learnflow-applications') || '[]');
    localStorage.setItem('learnflow-applications', JSON.stringify([...existingApplications, newApplication]));

    setApplicationSubmitted(newApplication);
    setIsSubmitting(false);
    toast({
      title: "Application Submitted!",
      description: `Your application for ${program?.title} has been received. Reference: ${newApplication.referenceNumber}`,
      duration: 7000,
    });
  };
  
  if (authLoading || isLoadingProgram) {
    return (
      <MainLayout>
        <div className="container mx-auto py-12 px-4 md:px-6 flex justify-center items-center min-h-[calc(100vh-10rem)]">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  if (!user) {
     // Should be redirected by useEffect, but this is a fallback.
    return (
      <MainLayout>
        <div className="container mx-auto py-12 px-4 md:px-6 text-center">
            <Alert variant="destructive" className="max-w-lg mx-auto">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Access Denied</AlertTitle>
                <AlertDescription>
                You need to be logged in to access this page. Redirecting to login...
                </AlertDescription>
            </Alert>
        </div>
      </MainLayout>
    );
  }

  if (!program) {
    // Should be redirected by useEffect, but this is a fallback.
    return (
      <MainLayout>
        <div className="container mx-auto py-12 px-4 md:px-6 text-center">
            <Alert variant="destructive" className="max-w-lg mx-auto">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Program Not Found</AlertTitle>
                <AlertDescription>
                The program you are trying to apply for could not be found.
                </AlertDescription>
            </Alert>
            <Button asChild className="mt-6"><Link href="/programs">Browse Programs</Link></Button>
        </div>
      </MainLayout>
    );
  }

  if (applicationSubmitted) {
    return (
      <MainLayout>
        <div className="container mx-auto py-12 px-4 md:px-6 flex flex-col items-center text-center">
          <Card className="w-full max-w-2xl shadow-xl">
            <CardHeader>
                <div className="mx-auto p-4 bg-green-100 rounded-full mb-4 inline-block">
                    <CheckCircle className="h-16 w-16 text-green-600" />
                </div>
              <CardTitle className="text-3xl font-headline">Application Submitted Successfully!</CardTitle>
              <CardDescription className="text-lg">
                Thank you for applying to the <strong>{program.title}</strong> program.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Your application reference number is: <strong className="text-primary">{applicationSubmitted.referenceNumber}</strong>.
                Please keep this for your records. You will also receive an email confirmation shortly.
              </p>
              <p className="text-muted-foreground">
                You can track the status of your application on your dashboard.
              </p>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/programs">Explore More Programs</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </MainLayout>
    );
  }


  return (
    <MainLayout>
      <div className="container mx-auto py-8 md:py-12 px-4 md:px-6">
        <Card className="w-full max-w-3xl mx-auto shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-headline">Apply for: {program.title}</CardTitle>
            <CardDescription>Fill out the form below to submit your application.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <section>
                <h3 className="text-xl font-semibold mb-4 pb-2 border-b font-headline">Personal Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField control={form.control} name="firstName" render={({ field }) => (
                      <FormItem><FormLabel>First Name</FormLabel><FormControl><Input placeholder="John" {...field} /></FormControl><FormMessage /></FormItem>
                    )}
                  />
                  <FormField control={form.control} name="lastName" render={({ field }) => (
                      <FormItem><FormLabel>Last Name</FormLabel><FormControl><Input placeholder="Doe" {...field} /></FormControl><FormMessage /></FormItem>
                    )}
                  />
                  <FormField control={form.control} name="email" render={({ field }) => (
                      <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" placeholder="john.doe@example.com" {...field} readOnly={!!user?.email} /></FormControl><FormMessage /></FormItem>
                    )}
                  />
                   <FormField control={form.control} name="dateOfBirth" render={({ field }) => (
                      <FormItem><FormLabel>Date of Birth</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                    )}
                  />
                  <FormField control={form.control} name="phone" render={({ field }) => (
                      <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input type="tel" placeholder="(123) 456-7890" {...field} /></FormControl><FormMessage /></FormItem>
                    )}
                  />
                  <FormField control={form.control} name="address" render={({ field }) => (
                      <FormItem className="md:col-span-2"><FormLabel>Full Address</FormLabel><FormControl><Input placeholder="123 Main St, Anytown, USA" {...field} /></FormControl><FormMessage /></FormItem>
                    )}
                  />
                </div>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-4 pb-2 border-b font-headline">Educational Background</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="highestQualification" render={({ field }) => (
                        <FormItem><FormLabel>Highest Qualification</FormLabel><FormControl><Input placeholder="e.g., Bachelor's Degree" {...field} /></FormControl><FormMessage /></FormItem>
                        )}
                    />
                    <FormField control={form.control} name="institution" render={({ field }) => (
                        <FormItem><FormLabel>Institution Name</FormLabel><FormControl><Input placeholder="e.g., University of Example" {...field} /></FormControl><FormMessage /></FormItem>
                        )}
                    />
                    <FormField control={form.control} name="yearOfCompletion" render={({ field }) => (
                        <FormItem><FormLabel>Year of Completion</FormLabel><FormControl><Input type="text" placeholder="YYYY" {...field} /></FormControl><FormMessage /></FormItem>
                        )}
                    />
                </div>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-4 pb-2 border-b font-headline">Statement of Purpose</h3>
                 <FormField control={form.control} name="statementOfPurpose" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Why are you interested in this program?</FormLabel>
                        <FormControl><Textarea placeholder="Tell us about your motivations, goals, and how this program fits into your career aspirations..." rows={8} {...field} /></FormControl>
                        <FormDescription>Minimum 50 characters. Maximum 2000 characters.</FormDescription>
                        <FormMessage />
                    </FormItem>
                    )}
                />
              </section>
              
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>AI Program Recommendation</AlertTitle>
                <AlertDescription>
                  Your statement of purpose can also be used by our AI to recommend other programs if this one isn't the best fit, or if your application is denied.
                </AlertDescription>
              </Alert>

              <Button type="submit" className="w-full text-lg py-6" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Submitting Application...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-5 w-5" /> Submit Application
                  </>
                )}
              </Button>
            </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
