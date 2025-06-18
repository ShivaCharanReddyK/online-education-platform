
"use client";

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Link from 'next/link';
import { LogIn, GraduationCap, Briefcase, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { MainLayout } from '@/components/shared/MainLayout';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'counselor'>('student');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const result = await login(email, password, role);

    if (result.success && result.user) {
        toast({
            title: "Login Successful",
            description: `Welcome back, ${result.user.email}!`,
        });
        const redirectUrl = searchParams.get('redirect');
        if (redirectUrl) {
            router.push(redirectUrl);
        } else {
            if (result.user.role === 'counselor') {
                router.push('/counselor/dashboard');
            } else {
                router.push('/dashboard');
            }
        }
    } else {
        toast({
            title: "Login Failed",
            description: result.message || "Please enter valid credentials.",
            variant: "destructive",
        });
    }
    setIsLoading(false);
  };

  return (
    <MainLayout>
      <div className="flex flex-1 items-center justify-center bg-gradient-to-br from-primary/10 via-background to-background p-4 min-h-[calc(100vh-var(--header-height)-var(--footer-height))]">
        <Card className="w-full max-w-md shadow-2xl">
          <CardHeader className="text-center">
            <div className="inline-block mx-auto p-3 bg-primary rounded-full mb-4">
              <LogIn className="h-8 w-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-3xl font-headline">Welcome Back!</CardTitle>
            <CardDescription>Log in to your LearnFlow account.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-3">
                <Label>Log in as</Label>
                <RadioGroup defaultValue="student" onValueChange={(value: 'student' | 'counselor') => setRole(value)} className="flex gap-4" disabled={isLoading}>
                  <Label htmlFor="role-student" className="flex items-center space-x-2 p-3 border rounded-md hover:bg-muted/50 cursor-pointer data-[state=checked]:border-primary flex-1 justify-center">
                    <RadioGroupItem value="student" id="role-student" />
                    <GraduationCap className="h-5 w-5 text-primary" />
                    <span>Student</span>
                  </Label>
                  <Label htmlFor="role-counselor" className="flex items-center space-x-2 p-3 border rounded-md hover:bg-muted/50 cursor-pointer data-[state=checked]:border-primary flex-1 justify-center">
                    <RadioGroupItem value="counselor" id="role-counselor" />
                    <Briefcase className="h-5 w-5 text-primary" />
                    <span>Counselor</span>
                  </Label>
                </RadioGroup>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" /> : 'Log In'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="text-center text-sm">
            <p>
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="font-medium text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
}
