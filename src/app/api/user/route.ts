import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import {hash} from "bcryptjs";
import * as z from "zod";
import router from "next/navigation";

const userSchema = z
  .object({
    email: z.string().min(1, 'Email is required').email('Invalid email'),
    username: z.string().min(1, 'Username is required').max(100),
    role: z.enum(["patient", "doctor"]).default("patient"), // Role validation
    password: z
      .string()
      .min(1, 'Password is required')
      .min(3, 'Password must have more than 3 characters'),
  })



export async function POST(req: Request) {
    try {
        const body = await req.json();
        
        const {email,username,role,password} = userSchema.parse(body);
        console.log("role: ",role);
            const existingUserByEmail = await db.user.findUnique({
                where:{
                    email:email
                }
            });
            if(existingUserByEmail){
                return NextResponse.json({user:null,error:"User with this email already exists"},{status:400});
            }
            
            const existingUserByUsername = await db.user.findUnique({
                where:{
                    username:username
                }
            })
            if(existingUserByUsername){
                return NextResponse.json({user:null,error:"User with this username already exists"},{status:400});
            }

            const hashedPassword = await hash(password,10);
            // console.log("role: ",role);
            const newUser = await db.user.create({
                data:{
                    email,
                    username,
                    password:hashedPassword,
                    role,
                }
            }); 
            // if(newUser){
            //     return NextResponse.json({user:newUser});
            // }

            const {password:newUserPassword, ...rest }=newUser ;
            return NextResponse.redirect(new URL(`/patient/${newUser.id}`, req.url)); // Corrected redirect handling
    } catch (error) {
        return NextResponse.json({error:"Something went wrong/ Zod req not satisfied"},{status:500});
    }
}