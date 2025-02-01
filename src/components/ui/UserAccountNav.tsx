'use client';
import { signOut } from "next-auth/react";
import React from "react";

const UserAccountNav = () => {
  return (
   
      <button onClick={()=>signOut({
        redirect:true,
        callbackUrl:`${window.location.origin}/sign-in`

      })} className="">Logout</button>
     
   
  );
};

export default UserAccountNav;
