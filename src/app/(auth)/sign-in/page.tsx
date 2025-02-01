"use client"
// import SignInForm from '@/components/authentication/SignInForm'
import SignInForm from '@/components/authentication/SignInForm'
import React, { ReactElement } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Props {
    
}

export default function page({}: Props): ReactElement {
    const handleSubmit = ()=>{
        console.log("clicked");
    }
    return (
        <div className=' flex flex-col justify-center items-center'>
            <ToastContainer/>
             <SignInForm  />;
           
        </div>
    )
}
