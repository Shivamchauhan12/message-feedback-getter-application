
'use client';
import React from 'react'
import { useSearchParams } from 'next/navigation';
 

export default function Page ()  {
  const searchParams = useSearchParams();
  const myParam = searchParams.get('username');
  console.log(myParam)

  return (
    <div>page</div>
  )
}
