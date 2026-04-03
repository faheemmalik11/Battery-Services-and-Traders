import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist } from "next/font/google";
import { Toaster } from "sonner";
import { AuthProvider } from "@/features/auth/context/AuthContext";
import { QueryProvider } from "@/lib/queryProvider";
import "./globals.css";

const geist = Geist({
    subsets: ["latin"],
    variable: "--font-geist",
});

export const metadata: Metadata = {
    title: "Battery Services & Traders",
    description: "Battery services and trading platform.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en" className={geist.variable}>
            <body>
                <QueryProvider>
                    <AuthProvider>
                        {children}
                        <Toaster position="top-right" richColors />
                    </AuthProvider>
                </QueryProvider>
            </body>
        </html>
    );
}