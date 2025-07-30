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
import { ThemeToggle } from "../../../../components/ui/ThemeToggle"
import { Tourney } from "next/font/google"
import Image from "next/image"
import Light from "@/public/Cyclespace-logo/CS logo color.png"
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet"
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'

const _tourney = Tourney({ subsets: ['latin'] })

export function NavMenu() {
  const [isOpen, setIsOpen] = React.useState(false)

  const navItems = [
    { name: 'Trade', href: '/Dashboard' },
    { name: 'Sentiment', href: '/News' },
    { name: 'Analysis', href: '/Research' },
    { name: 'Explore', href: '/vault' },
  ]

  return (
    <NavigationMenu className="w-full flex justify-between items-center gap-4 sm:gap-8 h-14 px-4 backdrop-filter backdrop-blur-2xl dark:bg-[#0F0F0F] bg-white border-b border-px dark:border-zinc-700 border-zinc-200 backdrop-brightness-200">
      <div className="flex items-center gap-2">
        {/* Mobile Menu Button */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]" onOpenAutoFocus={(e) => e.preventDefault()}>
            <div className="flex flex-col h-full">
              <div className="flex items-center gap-2 py-4 mb-4 border-b">
                <Image 
                  src={Light} 
                  width={25} 
                  height={25} 
                  alt="Cyclespace Logo"
                />
                <span className={`${_tourney.className} text-xl font-semibold`}>CYCLESPACE</span>
              </div>
              <nav className="flex-1 space-y-2">
                {navItems.map((item) => (
                  <SheetClose asChild key={item.href}>
                    <Link 
                      href={item.href}
                      className="flex items-center px-4 py-3 text-sm font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      {item.name}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
              <div className="pt-4 mt-auto border-t">
                <SignedOut>
                  <div className="flex flex-col gap-2">
                    <SignInButton>
                      <Button className="w-full">Sign In</Button>
                    </SignInButton>
                    <SignUpButton>
                      <Button variant="outline" className="w-full">Create Account</Button>
                    </SignUpButton>
                  </div>
                </SignedOut>
                <SignedIn>
                  <div className="flex justify-center">
                    <UserButton afterSignOutUrl="/" />
                  </div>
                </SignedIn>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Logo */}
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
      </div>

      {/* Desktop Navigation */}
      <NavigationMenuList className="hidden md:flex h-full items-center font-normal text-foreground">
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
