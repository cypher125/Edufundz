'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { loanApi } from '@/lib/api';
import { useRouter } from 'next/navigation';
import PaystackButton from '@/components/wallet/PaystackButton';
import VirtualAccount from '@/components/wallet/VirtualAccount';
import RepaymentComponent from "@/components/repayment";

interface Repayment {
  id: number;
  loan: number;
  user: number;
  amount: number;
  due_date: string;
  payment_date: string | null;
  status: string;
  transaction_id: string | null;
  created_at: string;
  updated_at: string;
}

interface Loan {
  id: number;
  application: number;
  user: number;
  amount: number;
  interest_rate: number;
  term_months: number;
  monthly_payment: number;
  status: string;
  disbursed_date: string;
  due_date: string;
  created_at: string;
  updated_at: string;
}

export default function RepaymentPage() {
  const [loading, setLoading] = useState(true);
  const [loans, setLoans] = useState<any[]>([]);
  const [repayments, setRepayments] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch loans
      const loansData = await loanApi.getLoans();
      setLoans(loansData);
        
        // Fetch repayments
        const repaymentsData = await loanApi.getRepayments();
        setRepayments(repaymentsData);
      } catch (error: any) {
        console.error("Failed to fetch loan data:", error);
        setError("Failed to load your loan and repayment information");
      toast({
          title: "Error",
          description: "Failed to retrieve your loan information. Please try again.",
          variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

    fetchData();
  }, [toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-emerald-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
  return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
          onClick={() => router.refresh()}
        >
          Try Again
        </button>
                </div>
    );
  }

  if (loans.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">No Active Loans</h1>
        <p className="text-gray-600 mb-6">You don't have any active loans to repay.</p>
        <button
          className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
          onClick={() => router.push('/dashboard/loan-application')}
        >
          Apply for a Loan
        </button>
                </div>
    );
  }

  // Find the active loan (assuming there's only one active loan at a time)
  const activeLoan = loans.find(loan => loan.status === 'active');
  
  if (!activeLoan) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">No Active Loans</h1>
        <p className="text-gray-600 mb-6">You have loans, but none are currently active.</p>
        <button
          className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
          onClick={() => router.push('/dashboard/loan-application')}
        >
          Apply for a Loan
        </button>
    </div>
  );
  }

  // Get repayments for the active loan
  const loanRepayments = repayments.filter(repayment => repayment.loan === activeLoan.id);
  
  return <RepaymentComponent loan={activeLoan} repayments={loanRepayments} />;
}

function RepaymentStatusBadge({ status }: { status: string }) {
  const variants: Record<string, string> = {
    paid: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    late: 'bg-red-100 text-red-800',
    missed: 'bg-slate-100 text-slate-800',
  };
  
  return (
    <Badge className={variants[status] || ''}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}

