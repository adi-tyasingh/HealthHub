"use client"
import { SessionProvider } from 'next-auth/react'
import React, {FC, ReactNode, useEffect, useState } from 'react'
interface ProviderProps{
    children:ReactNode,

}
const  Provider:FC<ProviderProps> = ({children}) =>{
  // const[isMounted,setIsMounted] = useState(false)
  //   useEffect(()=>{
  //     setIsMounted(true)
  //   })
  return (
    <SessionProvider>{children}</SessionProvider>
  )
}

export default Provider;