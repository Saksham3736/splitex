"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Home, User } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/store/auth-store";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

const navItems: NavItem[] = [
  { href: "/app", label: "Groups", icon: Home },
  { href: "/app/notifications", label: "Notifications", icon: Bell },
  { href: "/app/profile", label: "Profile", icon: User },
];

function isActive(pathname: string, href: string) {
  if (href === "/app") return pathname === "/app";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);

  return (
    <div className="flex flex-1 min-h-0">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:border-r md:bg-background">
        <div className="px-4 py-4">
          <div className="text-lg font-semibold tracking-tight">SplitEX</div>
          <div className="text-xs text-muted-foreground">{user?.name ?? ""}</div>
        </div>
        <Separator />
        <nav className="flex flex-col gap-1 p-2">
          {navItems.map((item) => {
            const active = isActive(pathname, item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  buttonVariants({ variant: active ? "secondary" : "ghost" }),
                  "justify-start gap-2"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main column */}
      <div className="flex flex-1 min-h-0 flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-14 items-center justify-between px-4">
            <div className="font-medium tracking-tight md:hidden">SplitEX</div>
            <div className="hidden md:block text-sm text-muted-foreground">
              Split expenses, settle smart.
            </div>
            <Link
              href="/app/profile"
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "gap-2")}
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">{user?.name ?? "Profile"}</span>
            </Link>
          </div>
        </header>

        <main className="flex flex-1 min-h-0 flex-col pb-16 md:pb-0">{children}</main>

        {/* Mobile bottom nav */}
        <nav className="fixed inset-x-0 bottom-0 z-20 border-t bg-background md:hidden">
          <div className="mx-auto grid max-w-md grid-cols-3">
            {navItems.map((item) => {
              const active = isActive(pathname, item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1 px-2 py-2 text-xs",
                    active ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}

