import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import Provider from "@/providers/Provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HealthHub",
  description: "Ollama chatbot web interface",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: true,  // Note: this should be a boolean, not 1
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider>
          {/* <ThemeProvider attribute="class" defaultTheme="Light"> */}
            {children}
            <Toaster />
          {/* </ThemeProvider> */}
        </Provider>
      </body>
    </html>
  );
}