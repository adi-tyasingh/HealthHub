import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { toast } from 'sonner';


const prisma = new PrismaClient();

export async function POST(req: Request){
    const body = await req.json();

    const {username,email,password} = body;
    console.log(body);

    if(!username || !email || !password){
        return NextResponse.json({error:"Missing username, email, or passowrd"},{status:400});
    }


    const exist = await prisma.user.findUnique({
        where:{
            email:email
        }

    });

    if(exist){
        return NextResponse.json({error:"Email already exists"},{status:400});
    }

    const hashedPassword = await bcrypt.hash(password,10);

    const user  = await prisma.user.create({
        data:{
            username:username,
            email:email,
            password:hashedPassword
        }


    })
    if(user === null){

        return NextResponse.json({error:"Error creating user"},{status:500});
    }



    return NextResponse.json({message:"User created successfully"});

    

}




