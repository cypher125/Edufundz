'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, ArrowUpRight, ArrowDownRight, InfoIcon, CreditCard } from 'lucide-react';
import { walletApi } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import PaystackButton from '@/components/wallet/PaystackButton';
import VirtualAccount from '@/components/wallet/VirtualAccount';

interface WalletData {
  id: number;
  user: number;
  balance: number;
  created_at: string;
  updated_at: string;
}

interface Transaction {
  id: number;
  wallet: number;
  amount: number;
  transaction_type: string;
  reference: string;
  paystack_reference: string | null;
  status: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export default function WalletPage() {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [amount, setAmount] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Check for payment reference in query params or localStorage
  useEffect(() => {
    const reference = searchParams.get('reference') || localStorage.getItem('paystack_reference');
    
    if (reference) {
      verifyPayment(reference);
      // Clear the reference
      localStorage.removeItem('paystack_reference');
      // Remove from URL
      if (searchParams.get('reference')) {
        router.replace('/dashboard/wallet');
      }
    }
    
    fetchWalletData();
  }, [searchParams, router]);
  
  const fetchWalletData = async () => {
    try {
      setLoading(true);
      // Fetch wallet details
      const walletData = await walletApi.getWallet();
      setWallet(walletData);
      
      // Fetch transactions
      const transactionsData = await walletApi.getTransactions();
      setTransactions(transactionsData);
    } catch (_ignored) {
      toast({
        title: 'Error',
        description: 'Failed to load wallet data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const verifyPayment = async (reference: string) => {
    try {
      const result = await walletApi.verifyPayment(reference);
      
      if (result.status === 'success') {
        toast({
          title: 'Payment Successful',
          description: 'Your payment has been verified and your wallet has been credited.',
        });
        
        // Refresh wallet data
        fetchWalletData();
      } else {
        toast({
          title: 'Payment Failed',
          description: result.message || 'Unable to verify your payment',
          variant: 'destructive',
        });
      }
    } catch (_ignored) {
      toast({
        title: 'Verification Error',
        description: 'An error occurred while verifying payment',
        variant: 'destructive',
      });
    }
  };
  
  const handleAmountChange = (e) => {
    // Only allow numeric input with up to 2 decimal places
    const value = e.target.value;
    if (/^\d*\.?\d{0,2}$/.test(value) || value === '') {
      setAmount(value);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getTransactionStatusColor = (status) => {
    switch (status) {
      case 'completed':
      case 'success':
        return 'text-green-600';
      case 'pending':
        return 'text-amber-600';
      case 'failed':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownRight className="h-4 w-4 text-green-600" />;
      case 'withdrawal':
      case 'payment':
      case 'loan_repayment':
        return <ArrowUpRight className="h-4 w-4 text-red-600" />;
      default:
        return <InfoIcon className="h-4 w-4 text-gray-600" />;
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Wallet</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Wallet Balance</CardTitle>
            <CardDescription>Your current balance and fund options</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Available Balance</p>
                <h3 className="text-3xl font-bold">₦{wallet?.balance?.toFixed(2) || '0.00'}</h3>
              </div>
              <Avatar className="h-16 w-16">
                <AvatarImage src="/wallet-icon.png" alt="Wallet" />
                <AvatarFallback>W</AvatarFallback>
              </Avatar>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start" onClick={fetchWalletData}>
              Refresh Balance
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => router.push('/dashboard/repayment')}>
              View Repayments
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => router.push('/dashboard/loan-application')}>
              Apply for Loan
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="fund">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="fund">Fund Wallet</TabsTrigger>
          <TabsTrigger value="virtual-account">Virtual Account</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="fund">
          <Card>
            <CardHeader>
              <CardTitle>Fund Your Wallet</CardTitle>
              <CardDescription>Add money to your wallet to pay for loans and other services</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₦)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={handleAmountChange}
                />
              </div>
              
              <PaystackButton 
                amount={parseFloat(amount) || 0}
                disabled={!amount || parseFloat(amount) <= 0}
                className="w-full"
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="virtual-account">
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg text-blue-800 flex items-start space-x-3">
              <CreditCard className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium mb-1">Dedicated Virtual Account</h3>
                <p className="text-sm">
                  A virtual account gives you a dedicated bank account number that you can use to deposit funds 
                  directly to your wallet. Any money sent to this account will be automatically credited to your 
                  wallet and can be used for loan repayments.
                </p>
              </div>
            </div>
            
      <VirtualAccount className="w-full" onAccountCreated={fetchWalletData} />
      
            <Card>
              <CardHeader>
                <CardTitle>Benefits of a Virtual Account</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-2">
                  <div className="bg-green-100 p-1 rounded-full">
                    <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <p className="text-sm">24/7 deposits directly to your wallet</p>
                </div>
                
                <div className="flex items-start space-x-2">
                  <div className="bg-green-100 p-1 rounded-full">
                    <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <p className="text-sm">No transfer fees between banks</p>
                </div>
                
                <div className="flex items-start space-x-2">
                  <div className="bg-green-100 p-1 rounded-full">
                    <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <p className="text-sm">Automated loan repayments from deposits</p>
                </div>
                
                <div className="flex items-start space-x-2">
                  <div className="bg-green-100 p-1 rounded-full">
                    <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <p className="text-sm">Easy to share with family members or sponsors</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="transactions">
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Transactions</TabsTrigger>
          <TabsTrigger value="deposits">Deposits</TabsTrigger>
          <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-4">
          <TransactionTable transactions={transactions} />
        </TabsContent>
        
        <TabsContent value="deposits" className="mt-4">
          <TransactionTable 
            transactions={transactions.filter(t => t.transaction_type === 'deposit')} 
          />
        </TabsContent>
        
        <TabsContent value="withdrawals" className="mt-4">
          <TransactionTable 
            transactions={transactions.filter(t => t.transaction_type === 'withdrawal')} 
          />
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function TransactionTable({ transactions }: { transactions: Transaction[] }) {
  if (transactions.length === 0) {
    return <p className="text-center py-4 text-muted-foreground">No transactions found</p>;
  }
  
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reference</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">{transaction.reference.slice(0, 10)}...</TableCell>
                <TableCell className="capitalize">{transaction.transaction_type}</TableCell>
                <TableCell>₦{transaction.amount.toFixed(2)}</TableCell>
                <TableCell>
                  <StatusBadge status={transaction.status} />
                </TableCell>
                <TableCell>{new Date(transaction.created_at).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, string> = {
    completed: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    failed: 'bg-red-100 text-red-800',
  };
  
  return (
    <Badge className={variants[status] || ''}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}

