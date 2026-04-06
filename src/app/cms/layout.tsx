'use client'

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/features/auth/context/AuthContext";
import { LogOut } from "lucide-react";

export default function CmsLayout({ children }: { children: ReactNode }) {
  const { logout } = useAuth();
  const pathname = usePathname();

  // Check if we're on the login page
  const isLoginPage = pathname === '/cms/login';

  const handleLogout = async () => {
    await logout();
  };

  // If on login page, render only children without sidebar
  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 border-r bg-background/95 md:block">
          <div className="p-4">
            <div className="text-sm font-medium text-muted-foreground">Admin</div>
            <div className="mt-1 text-lg font-semibold">Battery CMS</div>
          </div>

          <nav className="px-2 pb-4 text-sm">
            <Link
              href="/cms/dashboard"
              className="block rounded-md px-3 py-2 hover:bg-muted"
            >
              Dashboard
            </Link>
            <Link
              href="/cms/products"
              className="block rounded-md px-3 py-2 hover:bg-muted"
            >
              Products
            </Link>
            <Link
              href="/cms/products/new"
              className="block rounded-md px-3 py-2 hover:bg-muted"
            >
              New Product
            </Link>
            <div className="mt-2 border-t pt-2">
              <Link
                href="/"
                className="block rounded-md px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                Back to site
              </Link>
              <button
                onClick={handleLogout}
                className="mt-1 flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </nav>
        </aside>

        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur md:hidden">
            <div className="container mx-auto flex h-14 items-center justify-between px-4">
              <Link href="/cms/dashboard" className="font-semibold">
                CMS
              </Link>
              <nav className="flex items-center gap-3 text-sm">
                <Link href="/cms/products" className="hover:underline">
                  Products
                </Link>
                <Link href="/" className="text-muted-foreground hover:underline">
                  Site
                </Link>
                <button
                  onClick={handleLogout}
                  className="rounded-md bg-destructive px-3 py-1 text-xs text-white hover:bg-destructive/90"
                >
                  Logout
                </button>
              </nav>
            </div>
          </header>

          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}