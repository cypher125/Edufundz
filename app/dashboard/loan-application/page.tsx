'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { loanApi } from '@/lib/api';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const loanApplicationSchema = z.object({
  amount: z.string().min(1, 'Amount is required')
    .refine(val => !isNaN(parseFloat(val)), { message: 'Amount must be a number' })
    .refine(val => parseFloat(val) > 0, { message: 'Amount must be greater than 0' }),
  reason: z.enum(['tuition', 'books', 'living', 'other'], {
    required_error: 'Please select a reason for your loan',
  }),
  reason_details: z.string().optional(),
});

type LoanApplicationValues = z.infer<typeof loanApplicationSchema>;

export default function LoanApplicationPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<LoanApplicationValues>({
    resolver: zodResolver(loanApplicationSchema),
    defaultValues: {
      amount: '',
      reason: 'tuition',
      reason_details: '',
    },
  });
  
  async function onSubmit(values: LoanApplicationValues) {
    try {
      setIsSubmitting(true);
      
      // Convert amount to number
      const applicationData = {
        ...values,
        amount: parseFloat(values.amount),
      };
      
      await loanApi.createApplication(applicationData);
      
      toast({
        title: 'Application Submitted',
        description: 'Your loan application has been submitted successfully. You will be notified when it is reviewed.',
      });
      
      // Redirect to loan status page
      router.push('/dashboard/loan-status');
    } catch (error: any) {
      console.error('Application error:', error);
      
      // Display error message
      const errorMsg = error.data ? 
        Object.values(error.data).flat().join(' ') : 
        'Failed to submit loan application. Please try again.';
      
      toast({
        title: 'Application Failed',
        description: errorMsg,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }
  
  return (
    <div className="max-w-2xl mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Apply for a Student Loan</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Loan Application Form</CardTitle>
          <CardDescription>
            Please fill out all required fields to apply for a student loan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loan Amount (₦)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Enter amount (e.g. 50000)" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Reason for Loan</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="tuition" />
                          </FormControl>
                          <FormLabel className="font-normal">Tuition Fees</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="books" />
                          </FormControl>
                          <FormLabel className="font-normal">Books and Materials</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="living" />
                          </FormControl>
                          <FormLabel className="font-normal">Living Expenses</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="other" />
                          </FormControl>
                          <FormLabel className="font-normal">Other Education Expenses</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="reason_details"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Details</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Please provide additional details about your loan request"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Loan Information</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Interest Rate: 5% per annum</li>
                  <li>• Loan Term: Based on amount (6-36 months)</li>
                  <li>• Repayment: Monthly installments</li>
                  <li>• Early Repayment: No penalties</li>
                </ul>
              </div>
              
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting Application...
                  </>
                ) : (
                  "Submit Application"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

