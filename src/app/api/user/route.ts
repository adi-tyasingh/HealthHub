import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import {hash} from "bcryptjs";
import * as z from "zod";

const userSchema = z
  .object({
    email: z.string().min(1, 'Email is required').email('Invalid email'),
    username: z.string().min(1, 'Username is required').max(100),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(3, 'Password must have more than 3 characters'),
  })



export async function POST(req: Request) {
    try {
            const body = await req.json();

            const {email,username,password} = userSchema.parse(body);
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
            const newUser = await db.user.create({
                data:{
                    email,
                    username,
                    password:hashedPassword
                }
            });
            // if(newUser){
            //     return NextResponse.json({user:newUser});
            // }

            const {password:newUserPassword, ...rest }=newUser ;
            return NextResponse.json({user:rest,message:"User created successfully"},{status:201});
    } catch (error) {
        return NextResponse.json({error:"Something went wrong/ Zod req not satisfied"},{status:500});
    }
}