'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { userApi } from '@/lib/api';
import { useAuth } from '@/lib/auth';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, GraduationCap } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  
  async function onSubmit(values: LoginFormValues) {
    try {
      setIsSubmitting(true);
      const response = await userApi.login(values);
      
      // Use auth context login method instead of directly using localStorage
      login(response.token, response.user);
      
      toast({
        title: "Login successful",
        description: "Welcome back to EduFundz!",
      });
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error: any) {
      console.error("Login error:", error);
      
      toast({
        title: "Login failed",
        description: error.data?.detail || "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }
  
  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <GraduationCap className="h-6 w-6 text-emerald-600" />
            <CardTitle className="text-2xl font-bold">Student Login</CardTitle>
          </div>
          <CardDescription>
            Enter your credentials to access your student account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="student@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in to Student Portal"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <div className="text-sm text-center w-full space-y-2">
            <div>
              Don&apos;t have an account?{" "}
              <Link href="/auth/register" className="font-medium text-emerald-600 hover:underline">
                Create account
              </Link>
            </div>
            <div>
              <Link href="/admin/login" className="font-medium text-gray-600 hover:underline text-sm">
                Administrator access
              </Link>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
} 