import { Icons } from "@/components/ui/icons";
import Link from "next/link";
import i1 from "singup.jpeg"
import Image from "next/image";
import { Proza_Libre } from "next/font/google";

type AuthLayoutProps = {
    children: React.ReactNode;
};
// intro busines
// problem
// solution
export default function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className=" text-black grid min-h-screen w-screen grid-cols-1 px-2 lg:grid-cols-3">
            <main className="col-span-2 flex items-center justify-center">
                {children}
            </main>
            <section className="col-span-1 hidden flex-col items-start justify-center gap-6 border-l border-border bg-muted/30 p-10 lg:flex">
            <Image src="/singup.jpeg" alt="Auth Image" width={400} height={400} className="!h-full !w-full" />
            </section>
        </div>
    );
}
