
"use client";

import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/shared/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import type { Application } from '@/types';
import { DUMMY_APPLICATIONS, DUMMY_PROGRAMS } from '@/lib/constants';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, Briefcase, Users, AlertTriangle, CheckCircle, Clock, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export default function CounselorDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [pendingApplications, setPendingApplications] = useState<Application[]>([]);
  const [reviewedApplications, setReviewedApplications] = useState<Application[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/counselor/dashboard');
    } else if (user && user.role !== 'counselor') {
      toast({ title: "Access Denied", description: "This dashboard is for counselors only.", variant: "destructive"});
      router.push('/');
    }
  }, [user, authLoading, router, toast]);

  useEffect(() => {
    if (user && user.role === 'counselor') {
      setIsLoadingData(true);
      // Simulate fetching applications
      setTimeout(() => {
        // In a real app, fetch from backend. For demo, combine dummy data and localStorage.
        const allApplications = [
            ...DUMMY_APPLICATIONS,
            ...JSON.parse(localStorage.getItem('learnflow-applications') || '[]')
                .filter((storedApp: Application) => !DUMMY_APPLICATIONS.find(da => da.id === storedApp.id))
        ];

        const pending = allApplications.filter(app => app.status === 'pending');
        const reviewed = allApplications.filter(app => app.status === 'approved' || app.status === 'denied');
        
        setPendingApplications(pending);
        setReviewedApplications(reviewed);
        setIsLoadingData(false);
      }, 1000);
    }
  }, [user]);

  const getProgramTitle = (programId: string) => {
    return DUMMY_PROGRAMS.find(p => p.id === programId)?.title || 'Unknown Program';
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

  const stats = [
    { title: "Pending Applications", value: pendingApplications.length, icon: Clock, color: "text-yellow-500" },
    { title: "Approved Applications", value: reviewedApplications.filter(a=>a.status === 'approved').length, icon: CheckCircle, color: "text-green-500" },
    { title: "Denied Applications", value: reviewedApplications.filter(a=>a.status === 'denied').length, icon: AlertTriangle, color: "text-red-500" },
    { title: "Total Applications", value: pendingApplications.length + reviewedApplications.length, icon: Users, color: "text-blue-500" },
  ];

  return (
    <MainLayout>
      <div className="container mx-auto py-8 md:py-12 px-4 md:px-6">
        <header className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight font-headline">Counselor Dashboard</h1>
          <p className="mt-2 text-lg text-muted-foreground">Welcome, Counselor {user.email}! Review and manage student applications.</p>
        </header>

        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-10">
            {stats.map(stat => (
                <Card key={stat.title} className="shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                        <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{stat.value}</div>
                    </CardContent>
                </Card>
            ))}
        </section>


        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 font-headline flex items-center">
            <Briefcase className="mr-3 h-7 w-7 text-primary" /> Pending Applications
          </h2>
          {pendingApplications.length === 0 ? (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>All Clear!</AlertTitle>
              <AlertDescription>There are no pending applications to review at this time.</AlertDescription>
            </Alert>
          ) : (
            <Card className="shadow-lg">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Applicant Name</TableHead>
                      <TableHead>Program</TableHead>
                      <TableHead>Submission Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingApplications.map(app => (
                      <TableRow key={app.id}>
                        <TableCell>{app.personalDetails.firstName} {app.personalDetails.lastName}</TableCell>
                        <TableCell>{getProgramTitle(app.programId)}</TableCell>
                        <TableCell>{new Date(app.submissionDate).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/counselor/applications/${app.id}`}>
                              <Eye className="mr-2 h-4 w-4" /> Review
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6 font-headline">Reviewed Applications</h2>
           {reviewedApplications.length === 0 ? (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>No Reviewed Applications</AlertTitle>
              <AlertDescription>No applications have been reviewed yet.</AlertDescription>
            </Alert>
          ) : (
            <Card className="shadow-lg">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Applicant Name</TableHead>
                      <TableHead>Program</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reviewedApplications.map(app => (
                      <TableRow key={app.id}>
                        <TableCell>{app.personalDetails.firstName} {app.personalDetails.lastName}</TableCell>
                        <TableCell>{getProgramTitle(app.programId)}</TableCell>
                        <TableCell>
                           <Badge variant={app.status === 'approved' ? 'default' : 'destructive'} className="capitalize">
                             {app.status}
                           </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/counselor/applications/${app.id}`}>
                              <Eye className="mr-2 h-4 w-4" /> View
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </section>
      </div>
    </MainLayout>
  );
}
