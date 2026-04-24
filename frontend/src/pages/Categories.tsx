import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit2,
  Trash2,
  Layers,
  Filter,
  CheckCircle2,
  XCircle,
  Image as ImageIcon
} from 'lucide-react';
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import categoryService from '@/services/categoryService';

// Form Schema
const categorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  description: z.string().max(500).optional(),
  slug: z.string().min(2).optional().or(z.literal("")),
  image: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  isActive: z.boolean().default(true),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

const Categories = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Queries
  const { data: categoriesResponse, isLoading, isError } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getAllCategories(),
  });

  const categories = Array.isArray(categoriesResponse?.data) ? categoriesResponse.data : [];

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data: CategoryFormValues) => categoryService.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success("Category created successfully");
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create category");
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: CategoryFormValues }) =>
      categoryService.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success("Category updated successfully");
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update category");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => categoryService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success("Category deleted successfully");
      setIsDeleteDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete category");
    }
  });

  // Form setup
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      description: '',
      slug: '',
      image: '',
      isActive: true,
    },
  });

  const handleCreate = () => {
    setEditingCategory(null);
    form.reset({
      name: '',
      description: '',
      slug: '',
      image: '',
      isActive: true,
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (category: any) => {
    setEditingCategory(category);
    form.reset({
      name: category.name,
      description: category.description || '',
      slug: category.slug || '',
      image: category.image || '',
      isActive: category.isActive ?? true,
    });
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeletingId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deletingId) {
      deleteMutation.mutate(deletingId);
    }
  };

  const onSubmit = (values: CategoryFormValues) => {
    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory.id, data: values });
    } else {
      createMutation.mutate(values);
    }
  };

  // Filter categories
  const filteredCategories = categories.filter((cat: any) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (cat.description && cat.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your product categories for better organization and navigation.
          </p>
        </div>
        <Button onClick={handleCreate} className="w-full md:w-auto shadow-sm">
          <Plus className="mr-2 h-4 w-4" /> Add Category
        </Button>
      </div>

      <Card className="border-border/50 shadow-none overflow-hidden">
        <div className="p-4 border-b dark:border-border/10 flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search categories..."
              className="pl-9 bg-muted/20 dark:bg-muted/10 border-border/40 focus:bg-primary/40 transition-all shadow-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <Button variant="outline" size="sm" className="h-9 px-3 border-border/50 dark:bg-muted/10">
              <Filter className="mr-2 h-4 w-4" /> Filter
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/30 dark:bg-blue-500/10">
              <TableRow className="hover:bg-transparent border-border/40">
                <TableHead className="w-[80px] font-semibold">Image</TableHead>
                <TableHead className="min-w-[200px] font-semibold">Category Name</TableHead>
                <TableHead className="hidden md:table-cell font-semibold">Slug</TableHead>
                <TableHead className="w-[100px] font-semibold">Status</TableHead>
                <TableHead className="text-right w-[100px] font-semibold pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="animate-pulse">
                    <TableCell><div className="h-10 w-10 bg-muted rounded-md" /></TableCell>
                    <TableCell><div className="h-4 bg-muted rounded w-32 mb-2" /><div className="h-3 bg-muted rounded w-48" /></TableCell>
                    <TableCell><div className="h-4 bg-muted rounded w-20" /></TableCell>
                    <TableCell><div className="h-5 bg-muted rounded w-16" /></TableCell>
                    <TableCell className="text-right"><div className="h-8 w-8 bg-muted rounded ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : filteredCategories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <Layers className="h-12 w-12 mb-4 opacity-20" />
                      <p className="text-lg font-medium">No categories found</p>
                      <p className="text-sm">Try adjusting your search or add a new category.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredCategories.map((category: any) => (
                <TableRow key={category.id} className="group hover:bg-muted/30 transition-colors border-border/30">
                    <TableCell>
                      <div className="h-10 w-10 rounded-md bg-muted/40 border border-border/40 overflow-hidden flex items-center justify-center">
                        {category.image ? (
                          <img src={category.image} alt={category.name} className="h-full w-full object-cover" />
                        ) : (
                          <ImageIcon className="h-5 w-5 text-muted-foreground/50" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold">{category.name}</div>
                      <div className="text-xs text-muted-foreground line-clamp-1 max-w-[300px]">
                        {category.description || 'No description'}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <code className="text-xs bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                        {category.slug || '-'}
                      </code>
                    </TableCell>
                    <TableCell>
                      {category.isActive !== false ? (
                        <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-none">
                          <CheckCircle2 className="mr-1 h-3 w-3" /> Active
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border-none">
                          <XCircle className="mr-1 h-3 w-3" /> Inactive
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0 border-none hover:bg-accent-soft">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[160px]">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleEdit(category)}>
                            <Edit2 className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteClick(category.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingCategory ? 'Edit Category' : 'Add New Category'}</DialogTitle>
            <DialogDescription>
              {editingCategory
                ? 'Update the category details below.'
                : 'Create a new category for your inventory.'}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Electronics, Furniture, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Brief description..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="electronics" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-col justify-end pb-2">
                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-2.5 shadow-sm space-y-0">
                        <FormLabel className="text-xs font-medium">Active Status</FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/image.jpg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {createMutation.isPending || updateMutation.isPending ? 'Saving...' : editingCategory ? 'Update' : 'Create'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the category
              and may affect products associated with it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Categories;
