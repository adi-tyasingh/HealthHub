"use client"; // Ensure this is a client component

import React, { useState, useEffect, ReactElement } from "react";
import { getSession, signOut } from "next-auth/react"; // Import getSession from next-auth/react for client-side usage
import Link from "next/link";
import UserAccountNav from "@/components/ui/UserAccountNav";

const Logout = (): ReactElement => {
    const [session, setSession] = useState<any>(null);

    useEffect(() => {
        const fetchSession = async () => {
            const sessionData = await getSession(); // Use getSession for client-side session retrieval
            setSession(sessionData);
        };

        fetchSession();
    }, []);

    const handleLogout = async () => {
        await signOut(); // Call the signOut function to log the user out
        console.log('Logout clicked'); // Debugging log
    };

    return (
        <div>
            {session?.user ? (
                <button
              
                className="sticky left-20 z-50 top-10 inline-flex h-10 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
                 >
                <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                     <UserAccountNav/>
       
                </span>
                </button>
            ) : (
                <Link
                    href="/sign-up"
                    className="sticky left-20 z-50 top-10 inline-flex h-10 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
                >
                    <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                    <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                        Login
                    </span>
                </Link>
            )}
        </div>
    );
};

export default Logout;
