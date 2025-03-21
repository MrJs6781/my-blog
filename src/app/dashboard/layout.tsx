"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  User,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Posts", href: "/dashboard/posts", icon: FileText },
  { name: "Comments", href: "/dashboard/comments", icon: MessageSquare },
  { name: "Profile", href: "/dashboard/profile", icon: User },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Mobile navigation */}
      <div className="flex items-center justify-between border-b px-4 py-2 md:hidden">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <span className="font-bold">Dashboard</span>
        </Link>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="border-b p-4">
              <div className="flex items-center justify-between">
                <Link href="/dashboard" className="flex items-center space-x-2">
                  <span className="font-bold">Dashboard</span>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setOpen(false)}
                >
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close</span>
                </Button>
              </div>
            </div>
            <nav className="flex flex-col gap-1 p-2">
              {navigation.map((item) => {
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${
                      isActive
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
            <div className="absolute bottom-4 left-0 right-0 p-2">
              <Button
                variant="outline"
                className="w-full justify-start gap-3 text-muted-foreground"
                asChild
              >
                <Link href="/">
                  <LogOut className="h-4 w-4" />
                  Sign out
                </Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex flex-1">
        {/* Desktop sidebar */}
        <aside className="hidden w-64 flex-shrink-0 border-r md:block">
          <div className="flex h-full flex-col">
            <div className="border-b p-4">
              <Link href="/dashboard" className="flex items-center space-x-2">
                <span className="text-xl font-bold">Dashboard</span>
              </Link>
            </div>
            <nav className="flex flex-1 flex-col gap-1 p-2">
              {navigation.map((item) => {
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${
                      isActive
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
            <div className="border-t p-2">
              <Button
                variant="outline"
                className="w-full justify-start gap-3 text-muted-foreground"
                asChild
              >
                <Link href="/">
                  <LogOut className="h-4 w-4" />
                  Sign out
                </Link>
              </Button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
