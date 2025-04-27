"use client";

import React from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react';
import { User } from 'next-auth';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button'


const Navbar = () => {

    const { data: session, status } = useSession()

   // const user = session?.user 


  return (
   <nav>
    <div>
        <a href="#">Mystery message</a>
        {
            session ? (<div><span>Weilcome ,{session?.user?.username || session?.user?.email}</span> 
                <Button onClick={()=>{signOut()}}> Logout</Button>
           </div> ):(
           <Link href="/sign-in"> {"Log In"}</Link>
           )
        }
    </div>
   </nav>
  )
}

export default Navbar