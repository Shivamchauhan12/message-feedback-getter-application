 


"use client";

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
 

const Navbar = () => {
  const { data: session } = useSession();
 

  return (
    <nav className="bg-white shadow-md py-4">
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo or Title */}
        <a href="#" className="text-xl font-bold text-gray-800 hover:text-gray-600 transition-colors">
          Mystery Message
        </a>

        {/* User Section */}
        {session ? (
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">
              Welcome, {session.user?.username || session.user?.email}
            </span>
            <Button
              onClick={() =>{ signOut() }}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Logout
            </Button>
          </div>
        ) : (
          <Link
            href="/sign-in"
            className="text-blue-600 hover:text-blue-800 font-semibold transition-colors"
          >
            Log In
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
