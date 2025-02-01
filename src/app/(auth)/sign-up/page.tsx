// import SignUpForm from '@/components/authentication/SignUpForm'
import {AuthForm} from '@/components/authentication/SignUpForm2'
import React, { ReactElement } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
interface Props {
    
}

export default function page({}: Props): ReactElement {
    return (
        <div className=' flex flex-col justify-center items-center p-8'>
            <ToastContainer/>
            {/* <SignUpForm/> */}
            <AuthForm type="signup" />
        </div>
    )
}
