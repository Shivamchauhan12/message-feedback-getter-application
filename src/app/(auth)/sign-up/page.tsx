'use client'
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useDebounceCallback } from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from 'next/navigation';
import { signUpSchema } from "@/schemas/signUpSchema"
import { FormControl, Form,FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"

export default function page() {

  const [username, setUserName] = useState('');
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIscheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debounced = useDebounceCallback(setUserName, 500)
  const router = useRouter()

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: ""
    },
  })

  useEffect(() => {
    const checkUsernameUnique = async () => {
      try {
        if (username) {
          setIscheckingUsername(true);
          const res = await axios.get(`/api/check-username-unique/?username=${username}`)

          setUsernameMessage(res.data.message);

        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        setUsernameMessage(
          axiosError?.response?.data.message ?? "Error checking username"
        )
      } finally {
        setIscheckingUsername(false)
      }
    }

    checkUsernameUnique()
  }, [username])




  async function onSubmit(data: z.infer<typeof signUpSchema>) {

    console.log(data)


    try {

      setIsSubmitting(true);

      const res = await axios.post('/api/sign-up', data)

      toast(res.data.message);
      router.replace(`/verify?username=${data.username}`)



    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      setUsernameMessage(
        axiosError?.response?.data.message ?? "Error checking username"
      )
    } finally {
      setIsSubmitting(false)
    }
  }



  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="username" {...field} onChange={(e) => {
                    field.onChange(e);
                    debounced(e.target.value);
                  }} />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                {/* {isCheckingUsername && <Loader2 className="animate-spin" />} */}
                  {!isCheckingUsername && usernameMessage && (
                    <p
                      className={`text-sm ${
                        usernameMessage === 'Username is unique'
                          ? 'text-green-500'
                          : 'text-red-500'
                      }`}
                    >
                      {usernameMessage}
                    </p>
                  )}
                <FormMessage />
                
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="email" {...field} />
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
                  <Input placeholder="password" {...field} onChange={(e) => {
                    field.onChange(e);
                    setUserName(e.target.value);
                  }} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

         
          <Button type="submit"> {
            isSubmitting ? (<>
            Loading ...
            </>) : ("SignUp")
          }</Button>
        </form>
      </Form>
      <div>
        <p>
          Already a memeber ?{" "}
          <Link href="sign-in">Sign in</Link>
        </p>
      </div>
    </div>
  )

}