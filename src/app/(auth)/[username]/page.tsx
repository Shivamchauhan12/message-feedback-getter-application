
'use client';
import React from 'react'
import { useRouter ,useSearchParams } from 'next/navigation';
import * as z from "zod";
import { Form,FormField } from '@/components/ui/form';

export default function Page ()  {
  const searchParams = useSearchParams();
  const myParam = searchParams.get('username');
  console.log(myParam)

  return (
    <div>page</div>
  )
}
