
import type { Program } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { CalendarDays, Clock, Tag, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ProgramCardProps {
  program: Program;
}

export function ProgramCard({ program }: ProgramCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
      <div className="relative w-full h-48">
        <Image
          src={program.imageUrl}
          alt={program.title}
          data-ai-hint={program.aiHint || 'education online course'}
          layout="fill"
          objectFit="cover"
        />
      </div>
      <CardHeader>
        <CardTitle className="text-xl font-headline">{program.title}</CardTitle>
        <CardDescription className="text-sm h-16 overflow-hidden text-ellipsis">{program.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-3">
        <div className="flex items-center text-sm text-muted-foreground">
          <Tag className="mr-2 h-4 w-4 text-primary" />
          Category: <Badge variant="secondary" className="ml-1">{program.category}</Badge>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="mr-2 h-4 w-4 text-primary" />
          Duration: {program.duration}
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <CalendarDays className="mr-2 h-4 w-4 text-primary" />
          Start Date: {new Date(program.startDate).toLocaleDateString()}
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/programs/${program.id}`}>
            View Details <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
