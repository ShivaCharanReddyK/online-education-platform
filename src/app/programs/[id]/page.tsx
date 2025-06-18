
"use client"; // This page uses client-side data fetching (mock) and interactivity

import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/shared/MainLayout';
import { DUMMY_PROGRAMS } from '@/lib/constants';
import type { Program } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Image from 'next/image';
import Link from 'next/link';
import { CalendarDays, Clock, Tag, CheckCircle, BookOpen, Users, GraduationCap, ArrowRight, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

export default function ProgramDetailPage({ params }: { params: { id: string } }) {
  const [program, setProgram] = useState<Program | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate fetching program data
    setIsLoading(true);
    const foundProgram = DUMMY_PROGRAMS.find(p => p.id === params.id);
    setTimeout(() => { // Simulate network delay
      if (foundProgram) {
        setProgram(foundProgram);
      } else {
        toast({
          title: "Error",
          description: "Program not found.",
          variant: "destructive",
        });
        // Potentially redirect or show a proper not found component
      }
      setIsLoading(false);
    }, 500);
  }, [params.id, toast]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto py-12 px-4 md:px-6 flex justify-center items-center min-h-[calc(100vh-10rem)]">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  if (!program) {
    return (
      <MainLayout>
        <div className="container mx-auto py-12 px-4 md:px-6 text-center">
          <h1 className="text-3xl font-bold font-headline">Program Not Found</h1>
          <p className="mt-4 text-muted-foreground">The program you are looking for does not exist or has been removed.</p>
          <Button asChild className="mt-6">
            <Link href="/programs">Back to Programs</Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-8 md:py-12 px-4 md:px-6">
        {/* Header Section */}
        <section className="mb-12">
          <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden shadow-xl">
            <Image
              src={program.imageUrl}
              alt={program.title}
              data-ai-hint={program.aiHint || 'education online learning'}
              layout="fill"
              objectFit="cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 md:p-10">
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 font-headline">{program.title}</h1>
              <p className="text-lg md:text-xl text-gray-200 max-w-3xl">{program.description}</p>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Main Content */}
          <main className="lg:col-span-2 space-y-8">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-headline">About the Program</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{program.longDescription || program.description}</p>
              </CardContent>
            </Card>

            {program.learningOutcomes && program.learningOutcomes.length > 0 && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl font-headline">Learning Outcomes</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {program.learningOutcomes.map((outcome, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-1 shrink-0" />
                        <span className="text-muted-foreground">{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {program.modules && program.modules.length > 0 && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl font-headline">Program Modules</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {program.modules.map((module, index) => (
                      <AccordionItem value={`item-${index}`} key={index}>
                        <AccordionTrigger className="text-lg hover:no-underline">
                          {module.title}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {module.description}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            )}
          </main>

          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-6">
            <Card className="shadow-lg sticky top-20"> {/* Sticky sidebar */}
              <CardHeader className="bg-primary/5">
                <div className="flex items-center text-primary mb-2">
                   <GraduationCap className="h-8 w-8 mr-3" />
                   <CardTitle className="text-2xl font-headline text-primary">Program At a Glance</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center">
                  <Tag className="mr-3 h-5 w-5 text-primary" />
                  <div>
                    <p className="font-semibold">Category</p>
                    <Badge variant="outline" className="mt-1">{program.category}</Badge>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center">
                  <Clock className="mr-3 h-5 w-5 text-primary" />
                  <div>
                    <p className="font-semibold">Duration</p>
                    <p className="text-muted-foreground">{program.duration}</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center">
                  <CalendarDays className="mr-3 h-5 w-5 text-primary" />
                   <div>
                    <p className="font-semibold">Start Date</p>
                    <p className="text-muted-foreground">{new Date(program.startDate).toLocaleDateString()}</p>
                  </div>
                </div>
                 <Separator />
                <div className="flex items-center">
                  <Users className="mr-3 h-5 w-5 text-primary" />
                  <div>
                    <p className="font-semibold">Format</p>
                    <p className="text-muted-foreground">100% Online</p>
                  </div>
                </div>
                <Separator />
                 <div className="flex items-center">
                  <BookOpen className="mr-3 h-5 w-5 text-primary" />
                  <div>
                    <p className="font-semibold">Tuition Fee</p>
                    <p className="text-2xl font-bold text-primary">${program.tuitionFee.toLocaleString()}</p>
                  </div>
                </div>
                <Button size="lg" className="w-full mt-4 bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
                  <Link href={`/apply/${program.id}`}>
                    Apply Now <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </MainLayout>
  );
}
