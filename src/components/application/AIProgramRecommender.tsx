
"use client";

import { useState } from 'react';
import { recommendPrograms, type RecommendProgramsInput, type RecommendProgramsOutput } from '@/ai/flows/program-recommendation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Brain, Lightbulb, Loader2, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface AIProgramRecommenderProps {
  initialValues?: Partial<RecommendProgramsInput>;
  onRecommendation?: (recommendation: RecommendProgramsOutput) => void;
  compact?: boolean; // For use in smaller contexts like application denial
}

export function AIProgramRecommender({ initialValues, onRecommendation, compact = false }: AIProgramRecommenderProps) {
  const [formData, setFormData] = useState<RecommendProgramsInput>({
    background: initialValues?.background || '',
    interests: initialValues?.interests || '',
    statementOfPurpose: initialValues?.statementOfPurpose || '',
  });
  const [recommendation, setRecommendation] = useState<RecommendProgramsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setRecommendation(null);
    try {
      const result = await recommendPrograms(formData);
      setRecommendation(result);
      if (onRecommendation) {
        onRecommendation(result);
      }
      toast({
        title: "Recommendations Generated!",
        description: "AI has suggested some programs for you.",
        action: <CheckCircle className="text-green-500" />,
      });
    } catch (error) {
      console.error("Error getting recommendations:", error);
      toast({
        title: "Error",
        description: "Could not generate recommendations at this time. Please try again later.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  if (compact && recommendation) {
    return (
      <Alert variant="default" className="mt-4 bg-primary/5 border-primary/20">
        <Lightbulb className="h-5 w-5 text-primary" />
        <AlertTitle className="font-headline text-primary">AI Suggested Programs</AlertTitle>
        <AlertDescription>
          <p className="font-medium mt-2 mb-1">Based on the application, we also suggest considering:</p>
          <ul className="list-disc list-inside text-sm">
            {recommendation.programRecommendations.map((prog, index) => (
              <li key={index}>{prog}</li>
            ))}
          </ul>
          <p className="text-xs mt-2"><strong>Reasoning:</strong> {recommendation.reasoning}</p>
        </AlertDescription>
      </Alert>
    );
  }


  return (
    <Card className={`w-full ${compact ? 'shadow-none border-0 p-0' : 'max-w-2xl mx-auto shadow-xl'}`}>
      {!compact && (
        <CardHeader className="text-center">
            <div className="inline-block mx-auto p-3 bg-primary rounded-full mb-4">
                <Brain className="h-8 w-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-3xl font-headline">AI Program Recommender</CardTitle>
            <CardDescription>
            Let our AI help you find the perfect program. Tell us about yourself, and we&apos;ll provide personalized recommendations.
            </CardDescription>
        </CardHeader>
      )}
      <CardContent className={compact ? 'p-0' : ''}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="background" className="text-lg font-medium">Your Background</Label>
            <p className="text-sm text-muted-foreground mb-2">Describe your educational and professional background.</p>
            <Textarea
              id="background"
              name="background"
              value={formData.background}
              onChange={handleChange}
              placeholder="E.g., Bachelor's in Business, 2 years experience in marketing..."
              rows={compact ? 2 : 4}
              required
              disabled={isLoading}
              className="text-base"
            />
          </div>
          <div>
            <Label htmlFor="interests" className="text-lg font-medium">Your Interests</Label>
            <p className="text-sm text-muted-foreground mb-2">What topics or fields are you passionate about?</p>
            <Textarea
              id="interests"
              name="interests"
              value={formData.interests}
              onChange={handleChange}
              placeholder="E.g., Data analysis, creative writing, software development, renewable energy..."
              rows={compact ? 2 : 4}
              required
              disabled={isLoading}
              className="text-base"
            />
          </div>
          <div>
            <Label htmlFor="statementOfPurpose" className="text-lg font-medium">Statement of Purpose (Optional)</Label>
            <p className="text-sm text-muted-foreground mb-2">What are your goals for pursuing further education?</p>
            <Textarea
              id="statementOfPurpose"
              name="statementOfPurpose"
              value={formData.statementOfPurpose}
              onChange={handleChange}
              placeholder="E.g., To switch careers, gain advanced skills for promotion, start my own business..."
              rows={compact ? 2 : 4}
              disabled={isLoading}
              className="text-base"
            />
          </div>
          <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-6" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Getting Recommendations...
              </>
            ) : (
              <>
                <Lightbulb className="mr-2 h-5 w-5" />
                Get AI Recommendations
              </>
            )}
          </Button>
        </form>
      </CardContent>
      {recommendation && !compact && (
        <CardFooter className="mt-6">
          <Alert variant="default" className="w-full bg-primary/5 border-primary/20">
            <Lightbulb className="h-6 w-6 text-primary" />
            <AlertTitle className="text-xl font-headline text-primary">Personalized Recommendations</AlertTitle>
            <AlertDescription className="mt-2">
              <p className="font-semibold text-lg mb-2">We recommend the following programs for you:</p>
              <ul className="list-disc list-inside space-y-1 text-base mb-3">
                {recommendation.programRecommendations.map((prog, index) => (
                  <li key={index} className="text-muted-foreground">{prog}</li>
                ))}
              </ul>
              <p className="font-semibold text-lg mb-1">Reasoning:</p>
              <p className="text-muted-foreground text-base">{recommendation.reasoning}</p>
            </AlertDescription>
          </Alert>
        </CardFooter>
      )}
    </Card>
  );
}
