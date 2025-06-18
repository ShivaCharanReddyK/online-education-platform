import type { Metadata } from 'next';
import { Inter as FontInter, Space_Grotesk as FontSpaceGrotesk } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

// Instead of using next/font, we will use <link> tags as per instructions
// const fontInter = FontInter({ subsets: ['latin'], variable: '--font-inter' });
// const fontSpaceGrotesk = FontSpaceGrotesk({ subsets: ['latin'], variable: '--font-space-grotesk' });

export const metadata: Metadata = {
  title: 'LearnFlow',
  description: 'Discover your next learning adventure with LearnFlow.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body 
        className={cn(
          "min-h-screen bg-background font-body antialiased"
          // fontInter.variable, // Removed as per instruction to use <link>
          // fontSpaceGrotesk.variable // Removed as per instruction to use <link>
        )}
      >
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
