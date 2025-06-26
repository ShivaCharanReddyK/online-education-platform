
import { MainLayout } from '@/components/shared/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Brain, Search, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
  return (
    <MainLayout>
      <section className="py-16 md:py-24 lg:py-32 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                  Unlock Your Potential with <span className="text-primary">LearnFlow</span>
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Discover a wide range of online programs designed to help you achieve your career goals. Explore, apply, and grow with us.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button size="lg" asChild>
                  <Link href="/programs">
                    Browse Programs <Search className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/ai-recommender">
                    Get AI Recommendation <Brain className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
            <Image
              src="https://images.unsplash.com/photo-1506784926709-22f1ec395907?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHxDYXJlZXJ8ZW58MHx8fHwxNzUwOTMwNjQzfDA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Hero Learner"
              data-ai-hint="education learning"
              width={600}
              height={400}
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
              priority
            />
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">Key Features</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Why Choose LearnFlow?</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              We provide a seamless and supportive learning experience, from discovery to enrollment.
            </p>
          </div>
          <div className="mx-auto grid items-start gap-8 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-5xl lg:grid-cols-3">
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="mb-2 flex justify-center">
                  <div className="p-3 rounded-full bg-primary/10 text-primary">
                    <Search className="h-8 w-8" />
                  </div>
                </div>
                <CardTitle className="text-center">Diverse Program Catalog</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center">
                  Explore a wide variety of programs across technology, marketing, data science, and more. Find the perfect fit for your aspirations.
                </p>
              </CardContent>
            </Card>
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="mb-2 flex justify-center">
                  <div className="p-3 rounded-full bg-primary/10 text-primary">
                    <Brain className="h-8 w-8" />
                  </div>
                </div>
                <CardTitle className="text-center">AI-Powered Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center">
                  Our intelligent recommender helps you find programs tailored to your background, interests, and career goals.
                </p>
              </CardContent>
            </Card>
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="mb-2 flex justify-center">
                  <div className="p-3 rounded-full bg-primary/10 text-primary">
                    <CheckCircle className="h-8 w-8" />
                  </div>
                </div>
                <CardTitle className="text-center">Streamlined Application</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center">
                  Easy-to-use application process with clear guidance and timely updates on your application status.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 lg:py-32 bg-muted/40">
        <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight font-headline">
              Ready to Start Your Learning Journey?
            </h2>
            <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Take the first step towards your future. Explore our programs or get personalized recommendations today.
            </p>
          </div>
          <div className="mx-auto w-full max-w-sm space-y-2">
             <Button size="lg" className="w-full" asChild>
                <Link href="/programs">
                  Explore All Programs <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
