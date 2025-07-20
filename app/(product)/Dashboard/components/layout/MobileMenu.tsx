"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Home, Newspaper, BarChart2, Compass } from "lucide-react"

import { cn } from "@/lib/utils"

import {
  NavigationMenuLink,
} from "@/components/ui/navigation-menu"
import { Tourney } from "next/font/google"


const _tourney = Tourney({ subsets: ['latin'] })

export function MobileMenu() {
  const navigationItems = [
    { href: "/Dashboard", label: "Trade", icon: Home },
    { href: "/News", label: "Sentiment", icon: Newspaper },
    { href: "/Research", label: "Analysis", icon: BarChart2 },
    { href: "/vault", label: "Explore", icon: Compass },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 block lg:hidden bg-white dark:bg-[#0F0F0F] border-t border-zinc-200 dark:border-zinc-800 shadow-md">
      <ul className="flex justify-around items-center h-14">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.href} className="flex-1">
              <Link href={item.href} className="flex flex-col items-center justify-center py-2 text-xs text-zinc-700 dark:text-zinc-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <Icon className="h-6 w-6 mb-1" />
                <span className="text-[11px] font-medium">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 text-zinc-100 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <p className="text-sm font-normal leading-none text-zinc-100">{title}</p>
          <p className="line-clamp-2 text-m leading-snug text-zinc-100 font-light">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"
