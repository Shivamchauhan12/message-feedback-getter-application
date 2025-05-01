'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import {
  FormControl,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { verifyCodeSchema } from '@/schemas/verifySchema';

export default function VerifyPage() {
  const searchParams = useParams();
 
  const route = useRouter();
  const username =  searchParams.username;
  const [isVerifying, setIsVerifying] = useState(false);

  const form = useForm<z.infer<typeof verifyCodeSchema>>({
    resolver: zodResolver(verifyCodeSchema),
    defaultValues: {
      code: 0,
    },
  });

  const onSubmit = async (data: z.infer<typeof verifyCodeSchema>) => {
    try {
      setIsVerifying(true);

      const res = await axios.post('/api/verify-code', { ...data, username });
      toast(res.data.message);
      route.push('/sign-in');
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast(axiosError?.response?.data.message ?? 'Error checking username');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-black p-8 my-8 rounded-3xl shadow-xl">
        <h1 className="text-3xl font-bold text-center mb-6">Verify Your Code</h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold">Verification Code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Please Enter your code"
                      className="bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isVerifying}
              className="w-full py-3 bg-white text-black hover:bg-gray-200 transition duration-300 rounded-md font-semibold"
            >
              {isVerifying ? 'Verifying...' : 'Verify'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
