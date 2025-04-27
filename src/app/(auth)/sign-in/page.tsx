
'use client'

import React from 'react'
import { useState } from 'react'
import { signInSchema } from '@/schemas/signInSchema'
import axios, { AxiosError } from 'axios'
import { useForm } from 'react-hook-form'
import * as z from "zod"
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ApiResponse } from '@/types/ApiResponse'
import { toast } from 'sonner'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'


export default function page () {

  const [isSigningIn,setIsSigningIn]=useState(false)
  const router=useRouter()

  const form = useForm <z.infer<typeof signInSchema>>({
    resolver:zodResolver(signInSchema),
    defaultValues:{
      identifier:"",
      password:""
    }
  })

   const onSubmit=async (data : z.infer<typeof signInSchema> )=>{

    console.log(data);

    setIsSigningIn(true);

    try {

      const res = await signIn("credentials", { redirect:false, ...data })

    //  const res=await axios.post('api/auth/sign-in',{data})

      console.log(res);

      if(res?.error){
        toast("Login Failder",{
          description:res?.error})
      }

      if(res?.ok){
        console.log("inside")
        router.push("/dashboard")
      }
    
      
    } catch (error) {
      const axiosError= error as AxiosError<ApiResponse>

      toast(axiosError?.response?.data?.message || "Somethiong went wrong")
    }finally{
      setIsSigningIn(false);
    }

  }


  return (
    <div>   
       <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
    <FormField
          control={form.control}
          name="identifier"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Please Enter email or username" {...field}   />
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
                <Input placeholder="Please Enter your password" {...field}   />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
             <Button type="submit"> {isSigningIn ?("Signing in") : ("sign in") }</Button>

      </form>
    </Form></div>
  )
}
