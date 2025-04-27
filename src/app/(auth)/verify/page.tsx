'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { toast } from "sonner"
import { useRouter } from 'next/navigation';
import { FormControl, Form,FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { verifyCodeSchema } from '@/schemas/verifySchema';

 

export default function VerifyPage( ) {
  const searchParams = useSearchParams();
  const route=useRouter()
  const [username, setUsername] = useState(searchParams.get('username'));
  const [isverifying,setIsVerifying] = useState(false)
  
  const form = useForm<z.infer<typeof verifyCodeSchema>>({
    resolver: zodResolver(verifyCodeSchema),
    defaultValues: {
        code: 0,  
      },
  })

  const onSubmit = async (data : z.infer<typeof verifyCodeSchema>)=> {
    console.log(data)

    try {
        setIsVerifying(true);
       
        const res = await axios.post('/api/verify-code', {...data,username})
        toast(res.data.message);
        route.push("/sign-in")
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast(
          axiosError?.response?.data.message ?? "Error checking username"
        )
      } finally {
        setIsVerifying(false)
      }
  }
 

  return (
    <div>
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Please Enter your code" {...field}   />
                </FormControl>
                <FormMessage />
                
              </FormItem>
            )}
          />
               <Button type="submit">Verify</Button>

        </form>
      </Form>
    </div>
  );
}
