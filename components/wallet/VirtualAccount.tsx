import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Copy, AlertTriangle } from 'lucide-react';
import { walletApi } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';

interface VirtualAccountProps {
  onAccountCreated?: () => void;
  className?: string;
}

export default function VirtualAccount({ onAccountCreated, className }: VirtualAccountProps) {
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [virtualAccount, setVirtualAccount] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchVirtualAccount();
  }, []);

  const fetchVirtualAccount = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await walletApi.getVirtualAccount();
      setVirtualAccount(data);
    } catch (error: any) {
      console.error('Virtual account fetch error:', error);
      
      if (error.status === 404) {
        // 404 is expected if no virtual account exists yet, not an error to display
        setVirtualAccount(null);
      } else if (error.message?.includes('no such table') || error.data?.detail?.includes('no such table')) {
        setError('Database tables for virtual accounts need to be created. Please run migrations first.');
      } else {
        setError('Failed to fetch virtual account details. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const createVirtualAccount = async () => {
    try {
      setCreating(true);
      setError(null);
      const response = await walletApi.createVirtualAccount();
      setVirtualAccount(response.virtual_account || response);
      
      toast({
        title: 'Success',
        description: 'Virtual account created successfully',
      });
      
      if (onAccountCreated) {
        onAccountCreated();
      }
    } catch (error: any) {
      console.error('Virtual account creation error:', error);
      
      if (error.message?.includes('no such table') || error.data?.detail?.includes('no such table')) {
        setError('Database tables for virtual accounts need to be created. Please run migrations first.');
      } else {
        setError(error.data?.message || error.message || 'Failed to create virtual account');
        
        toast({
          title: 'Error',
          description: error.data?.message || error.message || 'Failed to create virtual account',
          variant: 'destructive',
        });
      }
    } finally {
      setCreating(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied!',
      description: `${label} copied to clipboard`,
    });
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="pt-6 flex justify-center items-center min-h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Virtual Account</CardTitle>
          <CardDescription>Create a dedicated account for transactions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-800 flex items-start">
            <AlertTriangle className="h-5 w-5 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <p className="font-medium">Unable to Load Virtual Account</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </div>
          <Button 
            onClick={fetchVirtualAccount} 
            variant="outline"
            className="w-full"
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!virtualAccount) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Virtual Account</CardTitle>
          <CardDescription>Create a dedicated account for loan repayments</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            You don&apos;t have a virtual account yet. Create one to easily repay your loans.
          </p>
          <Button 
            onClick={createVirtualAccount} 
            disabled={creating}
            className="w-full"
          >
            {creating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create Virtual Account"
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Your Virtual Account</CardTitle>
        <CardDescription>Use this account for repayments</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="p-4 border rounded-lg bg-slate-50">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-muted-foreground">Account Number</span>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => copyToClipboard(virtualAccount.account_number, 'Account number')}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xl font-mono">{virtualAccount.account_number}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Bank Name</p>
              <p className="font-medium">{virtualAccount.bank_name}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Account Name</p>
              <p className="font-medium">{virtualAccount.account_name}</p>
            </div>
          </div>
          
          <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-600">
            <p className="font-medium">Important</p>
            <p className="mt-1">
              This account is dedicated for your loan repayments. Funds sent to this account will be automatically applied to your outstanding loans.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 