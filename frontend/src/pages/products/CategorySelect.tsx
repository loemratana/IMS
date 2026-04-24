import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Layers } from 'lucide-react';

import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form';
import categoryService from '@/services/categoryService';

interface CategorySelectProps {
  control: any;
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
}

export function CategorySelect({ 
  control, name, label = "Category", placeholder = "Select a category", required = false 
}: CategorySelectProps) {
  
  const { data: categoriesResponse, isLoading } = useQuery({
    queryKey: ['categories', 'select'],
    queryFn: () => categoryService.getAllCategories(),
  });

  const categories = Array.isArray(categoriesResponse?.data) ? categoriesResponse.data : [];

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label} {required && "*"}</FormLabel>
          <Select onValueChange={field.onChange} value={field.value}>
            <FormControl>
              <SelectTrigger disabled={isLoading}>
                <Layers className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                <SelectValue placeholder={isLoading ? "Loading categories..." : placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="none">No Category (Default)</SelectItem>
              {categories.map((c: any) => (
                <SelectItem key={c.id} value={String(c.id)}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
