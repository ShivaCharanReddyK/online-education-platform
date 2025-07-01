
"use client";

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Link from 'next/link';
import { UserPlus, GraduationCap, Briefcase, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { MainLayout } from '@/components/shared/MainLayout';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState<'student' | 'counselor'>('student');
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName.trim() || !lastName.trim()) {
      toast({
        title: "Signup Failed",
        description: "Please provide both first and last name.",
        variant: "destructive",
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "Signup Failed",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }
    
    if (password.length < 6) {
      toast({
        title: "Signup Failed",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    const result = await signup(email, password, role, firstName, lastName);
    
    if (result.success && result.user) {
        toast({
            title: "Signup Successful",
            description: `Welcome, ${result.user.firstName} ${result.user.lastName}! Your account has been created.`,
        });
        if (result.user.role === 'counselor') {
            router.push('/counselor/dashboard');
        } else {
            router.push('/dashboard');
        }
    } else {
         toast({
            title: "Signup Failed",
            description: result.message || "Please fill in all fields correctly.",
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
              <UserPlus className="h-8 w-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-3xl font-headline">Create Account</CardTitle>
            <CardDescription>Join LearnFlow to start your learning journey.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
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
                <Label htmlFor="password">Password (min. 6 characters)</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  minLength={6}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-3">
                <Label>Sign up as</Label>
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
                {isLoading ? <Loader2 className="animate-spin" /> : 'Sign Up'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="text-center text-sm">
            <p>
              Already have an account?{' '}
              <Link href="/login" className="font-medium text-primary hover:underline">
                Log in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
}
