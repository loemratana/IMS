import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import {
  User,
  Mail,
  Shield,
  Lock,
  Eye,
  EyeOff,
  Calendar,
  Edit3,
  CheckCircle2,
  Camera,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

import authService from '@/services/authService';

// ─── Schemas ────────────────────────────────────────────────
const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type ChangePasswordValues = z.infer<typeof changePasswordSchema>;

// ─── Helpers ─────────────────────────────────────────────────
function getInitials(name?: string) {
  if (!name) return 'U';
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(dateStr?: string) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function getRoleBadgeClass(role?: string) {
  switch (role?.toUpperCase()) {
    case 'ADMIN':
      return 'bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400 border-none';
    case 'MANAGER':
      return 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-none';
    default:
      return 'bg-slate-100 text-slate-700 dark:bg-slate-500/10 dark:text-slate-400 border-none';
  }
}

// ─── Password Field ───────────────────────────────────────────
function PasswordInput({ field, placeholder }: { field: any; placeholder: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Input
        type={show ? 'text' : 'password'}
        placeholder={placeholder}
        className="pr-10"
        {...field}
      />
      <button
        type="button"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        onClick={() => setShow((s) => !s)}
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────
export default function Profile() {
  // Fetch current user
  const { data: meResponse, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: () => authService.getMe(),
  });

  const user = meResponse?.data?.user ?? meResponse?.data ?? null;

  // Change password form
  const pwForm = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });

  const changePwMutation = useMutation({
    mutationFn: (payload: { currentPassword: string; newPassword: string }) =>
      authService.changePassword(payload),
    onSuccess: () => {
      toast.success('Password changed successfully');
      pwForm.reset();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to change password');
    },
  });

  const onSubmitPw = (values: ChangePasswordValues) => {
    changePwMutation.mutate({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* ── Page Header ── */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account information and security settings.
        </p>
      </div>

      {/* ── Profile Hero Card ── */}
      <Card className="border-border/60 overflow-hidden">
        {/* gradient banner */}
        <div className="h-24 bg-gradient-to-r from-violet-500/20 via-blue-500/20 to-cyan-500/20 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-card/40" />
        </div>

        <CardContent className="pt-0 pb-6 px-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-10">
            {/* Avatar */}
            <div className="relative shrink-0">
              <Avatar className="h-20 w-20 border-4 border-card shadow-lg">
                <AvatarImage src={user?.avatarUrl} />
                <AvatarFallback className="bg-gradient-to-br from-violet-500 to-blue-600 text-white text-xl font-bold">
                  {isLoading ? '…' : getInitials(user?.name)}
                </AvatarFallback>
              </Avatar>
              <button className="absolute bottom-0 right-0 h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:opacity-90 transition-opacity">
                <Camera className="h-3 w-3" />
              </button>
            </div>

            {/* Name / Role */}
            <div className="flex-1 min-w-0">
              {isLoading ? (
                <div className="space-y-2">
                  <div className="h-5 bg-muted rounded w-40 animate-pulse" />
                  <div className="h-4 bg-muted rounded w-28 animate-pulse" />
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-bold truncate">{user?.name ?? '—'}</h2>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <Badge variant="secondary" className={getRoleBadgeClass(user?.role)}>
                      <Shield className="mr-1 h-3 w-3" />
                      {user?.role ?? 'User'}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                      Active account
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Quick-info chips */}
          {!isLoading && user && (
            <div className="mt-5 flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 shrink-0" />
                <span className="truncate">{user.email ?? '—'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 shrink-0" />
                <span>Member since {formatDate(user.createdAt)}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Tabs ── */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-muted/40 border border-border/40">
          <TabsTrigger value="overview" className="gap-1.5">
            <User className="h-4 w-4" /> Overview
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-1.5">
            <Lock className="h-4 w-4" /> Security
          </TabsTrigger>
        </TabsList>

        {/* ─── Overview Tab ─── */}
        <TabsContent value="overview" className="space-y-4">
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" /> Personal Information
              </CardTitle>
              <CardDescription>Your account details stored on the system.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="space-y-1.5">
                      <div className="h-3 bg-muted rounded w-20 animate-pulse" />
                      <div className="h-5 bg-muted rounded w-48 animate-pulse" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <InfoRow icon={<User className="h-4 w-4" />} label="Full Name" value={user?.name} />
                  <InfoRow icon={<Mail className="h-4 w-4" />} label="Email Address" value={user?.email} />
                  <InfoRow
                    icon={<Shield className="h-4 w-4" />}
                    label="Role"
                    value={
                      <Badge variant="secondary" className={getRoleBadgeClass(user?.role)}>
                        {user?.role ?? '—'}
                      </Badge>
                    }
                  />
                  <InfoRow
                    icon={<Calendar className="h-4 w-4" />}
                    label="Last Updated"
                    value={formatDate(user?.updatedAt)}
                  />
                  <InfoRow icon={<Calendar className="h-4 w-4" />} label="Member Since" value={formatDate(user?.createdAt)} />
                  <InfoRow icon={<Calendar className="h-4 w-4" />} label="Last Login" value={formatDate(user?.lastLogin)} />
                  {user?.phone && (
                    <InfoRow icon={<User className="h-4 w-4" />} label="Phone" value={user.phone} />
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── Security Tab ─── */}
        <TabsContent value="security" className="space-y-4">
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Lock className="h-4 w-4 text-muted-foreground" /> Change Password
              </CardTitle>
              <CardDescription>
                Update your password. Use a strong password with at least 6 characters.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...pwForm}>
                <form onSubmit={pwForm.handleSubmit(onSubmitPw)} className="space-y-4 max-w-md">
                  <FormField
                    control={pwForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Password</FormLabel>
                        <FormControl>
                          <PasswordInput field={field} placeholder="Enter current password" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Separator />
                  <FormField
                    control={pwForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <PasswordInput field={field} placeholder="Enter new password" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={pwForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm New Password</FormLabel>
                        <FormControl>
                          <PasswordInput field={field} placeholder="Re-enter new password" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full sm:w-auto"
                    disabled={changePwMutation.isPending}
                  >
                    {changePwMutation.isPending ? 'Saving…' : 'Update Password'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Session Info */}
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-4 w-4 text-muted-foreground" /> Session
              </CardTitle>
              <CardDescription>Your current login session information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border border-border/40 px-4 py-3 bg-muted/20">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Current Session</p>
                  <p className="text-xs text-muted-foreground">
                    Authenticated · Access token in localStorage
                  </p>
                </div>
                <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-none">
                  <CheckCircle2 className="mr-1 h-3 w-3" /> Active
                </Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ─── Info Row Sub-component ───────────────────────────────────
function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
        {icon} {label}
      </span>
      <div className="text-sm font-medium">{value ?? '—'}</div>
    </div>
  );
}
