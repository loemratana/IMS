import { z } from 'zod';

// ─── Types ────────────────────────────────────────────────────────────────────
export interface Product {
  id: string;
  name: string;
  sku: string;
  description?: string;
  price: number;
  quantity: number;
  minStock: number;
  category?: { id: string; name: string };
  supplier?: { id: string; name: string };
  imageUrl?: string;
  isActive: boolean;
  isLowStock: boolean;
  stockValue: number;
  createdAt: string;
}

export type SheetMode = 'create' | 'edit' | 'view' | null;

// ─── Validation ────────────────────────────────────────────────────────────────
export const productSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  category_id: z.string().optional(),
  supplier_id: z.string().optional(),
  price: z.coerce.number({ invalid_type_error: 'Price must be a number' }).positive('Price must be positive'),
  min_stock: z.coerce.number().int().min(0, 'Min stock must be ≥ 0').optional(),
  sku: z.string().optional(),
  image_url: z.string().optional().or(z.literal('')),
  is_active: z.boolean().default(true),
});

export type ProductFormValues = z.infer<typeof productSchema>;

// ─── Utilities ─────────────────────────────────────────────────────────────────
export const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(val);
};

export const generateSKU = (name: string) => {
  const prefix = name.substring(0, 3).toUpperCase().replace(/\s/g, '');
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${rand}`;
};
