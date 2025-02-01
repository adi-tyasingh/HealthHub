"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import GoogleSignInButton from "@/components/ui/GoogleSignInButton";
// import GithubSignInButton from "../ui/GithubSigninButton";
import { IconRocket } from "@tabler/icons-react";
import { useRouter } from 'next/navigation';

const formSchema = z.object({
    username: z.string().min(2, "Password must be at least 2 characters long"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

type formSchemaType = z.infer<typeof formSchema>;

type AuthFormProps = {
    type: "signup" | "login";
};

export function AuthForm({ type }: AuthFormProps) {
    const router = useRouter();
    const form = useForm<formSchemaType>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        },
    });

    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (data: formSchemaType) => {
        setIsLoading(true);

        try {
            
            const response = await fetch("/api/auth/register", {

                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data), 
            });

            const responseData = await response.json();
            console.log(responseData);

            if(responseData.error){
                toast.error("An error occurred. Please try again later.");
                return;
            }
            if(responseData.message){
                toast.success("Successfully registered!", {
                    description: "Login to meet your characters.",
                });
            }
            
            router.push("/sign-in");
    
        } catch (error) {
            toast.error("An error occurred. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full max-w-sm space-y-6 "
            >
                <div className="flex flex-col items-center space-y-4">
                    <Link
                        href="/"
                        className="flex items-center transition-transform hover:scale-90"
                    >
                       <IconRocket className="h-8 w-8 text-primary-foreground" />
                    </Link>
                    <div className="flex flex-col items-center space-y-1">
                        <h1 className="text-center text-2xl font-medium">
                            {type === "signup"
                                ? "Create an account"
                                : "Login to your account"}
                        </h1>
                        <Link
                            href={
                                type === "signup"
                                    ? "/sign-in"
                                    : "/sign-up"
                            }
                            className="text-center text-sm text-muted-foreground underline underline-offset-4"
                        >
                            {type === "signup"
                                ? "Already have an account? Login"
                                : "Don't have an account? Sign Up"}
                        </Link>
                    </div>
                </div>

                <div className="space-y-3">
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input
                                        className="bg-transparent w-[400px]"
                                        placeholder="abc"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    For personalized experience.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        className="bg-transparent w-[400px]"
                                        placeholder="hey@example.com"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    We&apos;ll never share your email with
                                    anyone else.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input
                                        className="bg-transparent w-[400px]"
                                        placeholder="••••••"
                                        type="password"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button
                        disabled={isLoading}
                        aria-disabled={isLoading}
                        type="submit"
                        className="w-full gap-2 h-6 p-6"
                    >
                        {isLoading && <Icons.loader className="h-4 w-4 " />}
                        {type === "signup" ? "Sign Up" : "Login"}
                    </Button>
                </div>

                <div className="mt-8 relative flex items-center justify-center">
                    <p className="absolute bg-background px-2 text-sm font-medium text-muted-foreground">
                        OR
                    </p>
                </div>

                <GoogleSignInButton>Sign in with Google</GoogleSignInButton>

               
            </form>
        </Form>
    );
}
