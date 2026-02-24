"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import {signIn, signOut, useSession, getProviders} from "next-auth/react";

const Nav = () => {
  const {data: session} = useSession();
  const [providers, setProviders] = useState(null);

  const [toggleDropdown, setToggleDropdown] = useState(false);

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
    <nav className="w-full flex flex-col items-center gap-6">
      {session?.user ? (
        <>
          <Image
            src={session.user.image}
            alt={session.user.name}
            width={48}
            height={48}
            className="w-12 h-12 rounded-2xl"
          />
          <span className="py-2 mb-2 text-gray-800 font-bold">{session.user.name}</span>
          <Link href="/create-task" className="w-full">
            <button className="w-full py-2 mb-2 bg-transparent border-none text-gray-800 font-medium rounded hover:bg-gray-100 transition-colors text-base focus:outline-none">
              Make plans
            </button>
          </Link>
          <Link href="/view-tasks" className="w-full">
            <button className="w-full py-2 mb-2 bg-transparent border-none text-gray-800 font-medium rounded hover:bg-gray-100 transition-colors text-base focus:outline-none">
              View plans
            </button>
          </Link>
          <button
            type="button"
            onClick={() => signOut()}
            className="w-full py-2 mb-2 bg-transparent border-none text-gray-800 font-medium rounded hover:bg-gray-100 transition-colors text-base focus:outline-none"
          >
            Sign Out
          </button>
        </>
      ) : (
        <>
          {providers && Object.values(providers).map((provider) => (
            <button
              type="button"
              key={provider.name}
              onClick={() => signIn(provider.id)}
              className="w-full py-2 mb-2 bg-transparent border-none text-gray-800 font-medium rounded hover:bg-gray-100 transition-colors text-base focus:outline-none"
            >
              Sign In
            </button>
          ))}
        </>
      )}
    </nav>
  )
}

export default Nav
