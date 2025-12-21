"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import {signIn, signOut, useSession, getProviders} from "next-auth/react";

const Nav = () => {
  const {data: session} = useSession();
  const [providers, setProviders] = useState(null);

  useEffect(() => {
    // avoid shadowing the state setter `setProviders`
    const setUpProviders = async () => {
      const response = await getProviders();

      // call the state setter from useState
      setProviders(response);
    }

    setUpProviders();
  }, [])

  return (
    <nav className="flex w-full pt-3 justify-end ">
      
      {/* <Link href="/" className="flex gap-2 flex-center">
        
        
      
      </Link> */}


      <div className="sm:flex hidden">

        <Link href='/'>
          <Image
            src="/navigation.png"
            alt="navigation_logo"
            width={40}
            height={40}
            className="fixed top-4 left-4 rounded-full shadow-lg z-50"
          />
        </Link>

        {session?.user ? (
          <div className="flex gap-3 md:gap-5">
            <Link href="/create-task" className="bg-gray-900 text-white px-5 py-1.5 rounded-full hover:bg-gray-800">
              Make plans
            </Link>

            <Link href='/view-tasks' className="bg-gray-900 text-white px-5 py-1.5 rounded-full hover:bg-gray-800">
              View Plans
            </Link>

            <button type="button" onClick={() => signOut()} className="bg-gray-900 text-white px-5 py-1.5 rounded-full cursor-pointer hover:bg-gray-800">
              Sign Out
            </button>

            <Link href='/'>
              <Image
                src={session?.user.image}
                alt="profile"
                width={40}
                height={40}
                className="rounded-full mr-5"
              />
            </Link>

          </div>
        ) : (
          <>
            {providers && Object.values(providers).map((provider) => (
              <button 
                type="button"
                key={provider.name}
                onClick={() => signIn(provider.id)}
                className="bg-black text-white mr-5 px-5 py-1.5 rounded-full cursor-pointer hover:bg-gray-800"
              >
                Sign In
              </button>
            ))}
          </>
        )}
      </div>
    </nav>
  )
}

export default Nav
