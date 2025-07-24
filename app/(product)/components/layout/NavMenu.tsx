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

  


  return (
    <NavigationMenu className="w-full flex justify-between items-center gap-8 h-14 px-4 backdrop-filter backdrop-blur-2xl dark:bg-[#0F0F0F] bg-zinc-200/80 border-b border-px border-zinc-700   backdrop-brightness-200 ">

      <NavigationMenuList className="w-full justify-between h-full items-center font-normal text-foreground">
          <NavigationMenuItem className="flex flex-row items-center gap-2">
            <div>
              <Image 
                src={Light} 
                width={25} 
                height={25} 
                alt={""}
                className=""
              />
            </div>
            <Link href="/" className={`${_tourney.className} antialiased text-xl md:text-2xl font-semibold bg-black dark:bg-white text-transparent bg-clip-text`}>
              CYCLESPACE
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem className="font-light flex gap-0">
              <NavigationMenuLink href="/Dashboard" className={navigationMenuTriggerStyle()}>
                <p className="text-sm font-medium">
                  Trade
                </p>
              </NavigationMenuLink>
              <NavigationMenuLink href="/News" className={navigationMenuTriggerStyle()}>
                <p className="text-sm font-medium">
                  Sentiment
                </p>
              </NavigationMenuLink>
              <NavigationMenuLink  href="/Research" className={navigationMenuTriggerStyle()}>
                <p className="text-sm font-medium flex flex-row gap-1">
                  Analysis
                </p>
              </NavigationMenuLink>
              <NavigationMenuLink href="/vault" className={navigationMenuTriggerStyle()}>
                <p className="text-sm font-medium flex flex-row gap-1">
                  Explore
                </p>
              </NavigationMenuLink>
          </NavigationMenuItem>
      </NavigationMenuList>
      <NavigationMenuList className="w-full gap-3">
        <div className="flex flex-row items-center gap-2">
          <SignedOut>
            <SignInButton>
              <button className="bg-[#6c47ff] text-white rounded-full font-medium text-xs sm:text-xs h-9 sm:h-9 px-4 sm:px-5 cursor-pointer">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton>
              <button className="bg-[#6c47ff] text-white rounded-full font-medium text-xs sm:text-xs h-9 sm:h-9 px-4 sm:px-5 cursor-pointer">
                Sign Up
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
        <div>
          <ThemeToggle/>
        </div>
        <div className="text-xs h-fit py-1" >
          <ConnectButton/>
        </div>

      </NavigationMenuList>

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
