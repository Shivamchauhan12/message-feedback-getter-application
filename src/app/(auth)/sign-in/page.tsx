'use client'
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useState } from "react"
import Link from "next/link"
import { useDebounceValue } from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from "next/router"
import { signUpSchema } from "@/schemas/signUpSchema"

export default function page() {

  const [username,setUserName]=useState('');
  const [usernameMessage,setUsernameMessage]=useState("");
  const [isCheckingUsername,setIscheckingUsername]=useState(false);
  const [isSubmitting,setIsSubmitting]=useState(false);
  const [debouncedValue, setValue] = useDebounceValue(username, 300)
  const router = useRouter()

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email:"",
      password:""
    },
  })
  return (
    <div>page</div>
  )
   
}