
"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PROGRAM_CATEGORIES, PROGRAM_DURATIONS } from "@/lib/constants";
import { SlidersHorizontal, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface ProgramFilterProps {
  onFilterChange: (filters: { category: string; duration: string; startDate: string; searchTerm: string }) => void;
  initialFilters: { category: string; duration: string; startDate: string; searchTerm: string };
}

export function ProgramFilter({ onFilterChange, initialFilters }: ProgramFilterProps) {
  
  const handleCategoryChange = (value: string) => {
    onFilterChange({ ...initialFilters, category: value });
  };

  const handleDurationChange = (value: string) => {
    onFilterChange({ ...initialFilters, duration: value });
  };

  const handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...initialFilters, startDate: event.target.value });
  };

  const handleSearchTermChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...initialFilters, searchTerm: event.target.value });
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center text-xl font-headline">
          <SlidersHorizontal className="mr-2 h-5 w-5 text-primary" />
          Filter Programs
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-4">
        <div className="space-y-2">
          <Label htmlFor="search-term">Search by Keyword</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="search-term"
              type="text"
              placeholder="e.g., Web Development, Marketing"
              value={initialFilters.searchTerm}
              onChange={handleSearchTermChange}
              className="pl-10"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category / Subject Area</Label>
          <Select value={initialFilters.category} onValueChange={handleCategoryChange}>
            <SelectTrigger id="category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {PROGRAM_CATEGORIES.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="duration">Duration</Label>
          <Select value={initialFilters.duration} onValueChange={handleDurationChange}>
            <SelectTrigger id="duration">
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              {PROGRAM_DURATIONS.map(duration => (
                <SelectItem key={duration} value={duration}>{duration}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="start-date">Start Date</Label>
          <Input
            id="start-date"
            type="date"
            value={initialFilters.startDate}
            onChange={handleStartDateChange}
          />
        </div>
         <Button onClick={() => onFilterChange({ category: 'All', duration: 'All', startDate: '', searchTerm: '' })} variant="outline" className="w-full">
          Clear Filters
        </Button>
      </CardContent>
    </Card>
  );
}
