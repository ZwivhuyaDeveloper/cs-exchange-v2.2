"use client"

import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { Button } from '@/components/ui/button';
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import Image from "next/image"
import Light from "@/public/Cyclespace-logo/CS logo color.png"
import { Tourney } from 'next/font/google'
import { ThemeToggle } from '../../../../components/ui/ThemeToggle';

const _tourney = Tourney({ subsets: ['latin'] })

export function NavMenu() {
  const navItems = [
    { name: 'Trade', href: '/Dashboard' },
    { name: 'Sentiment', href: '/News' },
    { name: 'Analysis', href: '/Research' },
    { name: 'Explore', href: '/vault' },
  ]

  return (
    <NavigationMenu className="w-full flex justify-between items-center gap-4 sm:gap-8 h-14 px-4 backdrop-filter backdrop-blur-2xl dark:bg-[#0F0F0F] bg-white border-b border-px dark:border-zinc-700 border-zinc-200 backdrop-brightness-200">
      {/* Logo and Desktop Navigation */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <Image 
            src={Light} 
            width={25} 
            height={25} 
            alt="Cyclespace Logo"
          />
          <Link href="/" className={`${_tourney.className} antialiased text-xl md:text-2xl font-semibold bg-black dark:bg-white text-transparent bg-clip-text`}>
            CYCLESPACE
          </Link>
        </div>

        {/* Desktop Navigation */}
        <NavigationMenuList className="hidden md:flex h-full items-center font-normal text-foreground ml-6">
          <NavigationMenuItem className="font-light flex gap-0">
            {navItems.map((item) => (
              <Link href={item.href} key={item.href} legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  <p className="text-sm font-medium">{item.name}</p>
                </NavigationMenuLink>
              </Link>
            ))}
          </NavigationMenuItem>
        </NavigationMenuList>
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-2">
          <SignedOut>
            <SignInButton>
              <Button size="sm" className="bg-[#6c47ff] hover:bg-[#5a3bd8] text-white">
                Sign In
              </Button>
            </SignInButton>
            <SignUpButton>
              <Button variant="outline" size="sm" className="hidden sm:flex">
                Sign Up
              </Button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
        <div className="ml-2">
          <ThemeToggle />
        </div>
        <div className="text-xs h-fit py-1 hidden sm:block">
          <ConnectButton />
        </div>
      </div>
    </NavigationMenu>
  )
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
          <p className="line-clamp-2 text-sm leading-snug text-zinc-100 font-light">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"
