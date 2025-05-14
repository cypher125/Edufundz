'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-emerald-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-emerald-50 to-white px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-emerald-600 mb-4">EduFundz</h1>
        <p className="text-xl text-gray-600 max-w-md">
          Student loan platform for educational funding and financial support
        </p>
      </div>

      <div className="space-y-4 w-full max-w-xs">
        <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-700">
          <Link href="/auth/login">Login</Link>
        </Button>
        
        <Button asChild variant="outline" className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50">
          <Link href="/auth/register">Register</Link>
        </Button>
      </div>
    </div>
  );
}

