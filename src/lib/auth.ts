import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import EmailProvider from "next-auth/providers/email";
import { db } from "@/lib/db";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { compare } from "bcryptjs";
import { NextResponse } from "next/server";

export const authOptions: NextAuthOptions = {
    adapter:PrismaAdapter(db),
    secret: process.env.NEXTAUTH_SECRET,
    session:{
      strategy:'jwt',
    },
    pages:{
      signIn:'/sign-in'
    },
   
    providers: [
         CredentialsProvider({
         
          name: "Credentials",
       
          credentials: {
            email: { label: "Email", type: "email", placeholder: "ex123@gmail.com" },
            password: { label: "Password", type: "password",placeholder:"password" }
          },
          async authorize(credentials) {
        
            
            if(!credentials?.email || !credentials?.password){
              return null;
            }

            const existingUser = await db.user.findUnique({
              where:{
                email:credentials.email
              }
            })
            if(!existingUser){
              throw new Error("User not found");
            }
            if(existingUser.password){
            const passwordMatch = await compare(credentials.password,existingUser.password);
            if(!passwordMatch){
               throw new Error("Password does not match");
            }
          }

            return {
              id:`${existingUser.id}`,
              username:existingUser.username,
              email:existingUser.email,
            }
      
          }
        }),
        GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID as string,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
          authorization: {
            params: {
              prompt: "consent",
              access_type: "offline",
              response_type: "code"
            }
          }
        }),
        GitHubProvider({
          clientId: process.env.GITHUB_CLIENT_ID as string,
          clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
          
        }),
        EmailProvider({
          // id: 'email',
          // name: 'email',
          server: {
            host: process.env.EMAIL_SERVER_HOST,
            port: process.env.EMAIL_SERVER_PORT,
            auth: {
              user: process.env.EMAIL_SERVER_USER,
              pass: process.env.EMAIL_SERVER_PASSWORD
            }
          },
          from: process.env.EMAIL_FROM
        }),
      ],
      callbacks: {
        async jwt({ token, user }) {
          // When a user logs in for the first time
          if (user) {
            // console.log(user)
            token.id = user.id; // Add user.id to the token
          }
          
          return token;
        },
        async session({ session, token }) {
          // Pass the user id from token to session
          session.user.id = token.id as string;
          session.user.credits = token.credits as string;
          return session;
        },
      },
}