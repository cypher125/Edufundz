import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { walletApi } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';

interface PaystackButtonProps {
  amount: number;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
  className?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  disabled?: boolean;
}

export default function PaystackButton({
  amount,
  onSuccess,
  onError,
  className,
  variant = 'default',
  disabled = false,
}: PaystackButtonProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handlePayment = async () => {
    try {
      setLoading(true);
      
      // Initialize payment
      const response = await walletApi.deposit(amount);
      
      if (response.status === 'success' && response.payment_url) {
        // Redirect to Paystack checkout
        window.location.href = response.payment_url;
        
        // Store the reference in localStorage to verify later
        localStorage.setItem('paystack_reference', response.reference);
        
        if (onSuccess) {
          onSuccess(response);
        }
      } else {
        throw new Error(response.message || 'Payment initialization failed');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      
      toast({
        title: 'Payment Error',
        description: error.message || 'An error occurred while initializing payment',
        variant: 'destructive',
      });
      
      if (onError) {
        onError(error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handlePayment}
      className={className}
      variant={variant}
      disabled={disabled || loading}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        `Pay ₦${amount.toFixed(2)}`
      )}
    </Button>
  );
} 