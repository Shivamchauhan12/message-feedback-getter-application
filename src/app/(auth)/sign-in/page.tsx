'use client'

import React, { useState } from 'react'
import { signInSchema } from '@/schemas/signInSchema'
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
import { AxiosError } from 'axios'

export default function Page() {

  const [isSigningIn, setIsSigningIn] = useState(false)
  const router = useRouter()

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: ""
    }
  })

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    console.log(data);
    setIsSigningIn(true);

    try {
      const res = await signIn("credentials", { redirect: false, ...data })

      console.log(res);

      if (res?.error) {
        toast("Login Failed", { description: res?.error })
      }

      if (res?.ok) {
        router.push("/dashboard")
      }

    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast(axiosError?.response?.data?.message || "Something went wrong")
    } finally {
      setIsSigningIn(false);
    }
  }

  

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white px-4">
      <div className="w-full max-w-md p-8 space-y-6 rounded-lg shadow-lg bg-white/5 backdrop-blur-md border border-white/10">
        <h2 className="text-3xl font-bold text-center">Welcome Back</h2>
        <p className="text-center text-sm text-gray-400">Sign in to your account</p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Username or Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your username or email"
                      {...field}
                      className="bg-black border-white/20 placeholder-gray-500 text-white focus-visible:ring-white"
                    />
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
                  <FormLabel className="text-white">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                      className="bg-black border-white/20 placeholder-gray-500 text-white focus-visible:ring-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-white text-black hover:bg-gray-200 transition font-semibold"
              disabled={isSigningIn}
            >
              {isSigningIn ? "Signing In..." : "Sign In"}
            </Button>
          </form>
        </Form>

        <p className="text-center text-xs text-gray-500">
          Don not have an account? <span onClick={()=>{router.push("/sign-up")}} className="underline cursor-pointer hover:text-white">Register</span>
        </p>
      </div>
    </div>
  )
}
