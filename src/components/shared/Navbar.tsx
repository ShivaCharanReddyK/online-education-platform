
"use client";

import Link from 'next/link';
import { GraduationCap, LogIn, UserPlus, LayoutDashboard, BookOpen, LogOut, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <GraduationCap className="h-6 w-6 text-primary" />
          <span className="font-bold font-headline text-lg">LearnFlow</span>
        </Link>
        <nav className="flex flex-1 items-center space-x-6 text-sm font-medium">
          <Link href="/programs" className="transition-colors hover:text-foreground/80 text-foreground/60">
            Programs
          </Link>
          <Link href="/ai-recommender" className="transition-colors hover:text-foreground/80 text-foreground/60">
            AI Recommender
          </Link>
          {user && (
            <Link href="/dashboard" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Dashboard
            </Link>
          )}
           {user && user.role === 'counselor' && (
            <Link href="/counselor/dashboard" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Counselor Hub
            </Link>
          )}
        </nav>
        <div className="flex items-center space-x-2">
          {user ? (
            <>
              <span className="text-sm text-muted-foreground hidden sm:inline">Welcome, {user.email}! ({user.role})</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/signup">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Sign Up
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
