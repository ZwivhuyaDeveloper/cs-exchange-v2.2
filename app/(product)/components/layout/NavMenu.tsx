"use client"

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';
import { Tourney } from 'next/font/google';
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Drawer, DrawerContent, DrawerTrigger, DrawerClose, DrawerTitle } from '@/components/ui/drawer';
import "@rainbow-me/rainbowkit/styles.css";


import DarkLogo from "@/public/Cyclespace-logo/CS logo color.png";
import LightLogo from "@/public/Cyclespace-logo/CSblue.png";

const _tourney = Tourney({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-tourney'
});

// Memoized components
const NavLink = React.memo(({ href, children, className = '' }: { 
  href: string; 
  children: React.ReactNode;
  className?: string;
}) => (
  <Link 
    href={href} 
    className={cn(
      navigationMenuTriggerStyle(),
      'text-sm font-medium',
      className
    )}
  >
    {children}
  </Link>
));

NavLink.displayName = 'NavLink';

const navItems = [
  { name: 'Trade', href: '/Dashboard' },
  { name: 'Sentiment', href: '/News' },
  { name: 'Analysis', href: '/Research' },
  { name: 'Signals', href: '/signals'}

] as const;

export const NavMenu = React.memo(() => {
  const [isOpen, setIsOpen] = React.useState(false);
  
  // Memoize handlers
  const handleOpenChange = React.useCallback((open: boolean) => {
    setIsOpen(open);
  }, []);
  
  const handleNavClick = React.useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <NavigationMenu 
      className="w-full flex justify-between items-center gap-4 sm:gap-8 h-14 px-4 backdrop-filter backdrop-blur-2xl dark:bg-[#0F0F0F] bg-white border-b border-px dark:border-zinc-700 border-zinc-200 backdrop-brightness-200"
      data-testid="nav-menu"
    >
      {/* Logo and Desktop Navigation */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <Image 
            src={DarkLogo} 
            width={25} 
            height={25} 
            alt="Cyclespace Logo"
            className="hidden dark:block"
          />
          <Image 
            src={LightLogo} 
            width={25} 
            height={25} 
            alt="Cyclespace Logo"
            className="block dark:hidden"
          />
          <Link href="/" className={`${_tourney.className} antialiased text-xl  sm:flex md:text-2xl font-semibold bg-black dark:bg-white text-transparent bg-clip-text`}>
            CYCLESPACE
          </Link>
        </div>

        {/* Desktop Navigation */}
        <NavigationMenuList className="hidden md:flex h-full items-center font-normal text-foreground ml-6">
          <NavigationMenuItem className="font-light flex gap-2">
            {navItems.map((item) => (
              <NavLink className='bg-zinc-200/50 dark:bg-zinc-900' key={item.href} href={item.href}>
                {item.name}
              </NavLink>
            ))}
          </NavigationMenuItem>
        </NavigationMenuList>
      </div>

      {/* Desktop Right side controls */}
      <div className="hidden md:flex items-center gap-2">
        <div className="flex items-center gap-2">
          <SignedOut>
            <SignInButton>
              <Button size="sm" className="bg-[#6c47ff] hover:bg-[#5a3bd8] text-white">
                Sign In
              </Button>
            </SignInButton>
            <SignUpButton>
              <Button variant="outline" size="sm">
                Sign Up
              </Button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
        <div className="text-xs h-fit py-1">
          <ConnectButton />
        </div>
        <div className="ml-2">
          <ThemeToggle />
        </div>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-foreground"
          onClick={() => setIsOpen(true)}
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Open menu</span>
        </Button>
      </div>

      {/* Mobile Menu Drawer */}
      <Drawer open={isOpen} onOpenChange={handleOpenChange}>
        <DrawerContent className="h-[100dvh] mt-0 rounded-t-2xl">
          <div className="p-4 flex flex-col h-full">
            <DrawerTitle className="sr-only">Mobile Navigation Menu</DrawerTitle>
            {/* Header with close button */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Image 
                  src={DarkLogo} 
                  width={25} 
                  height={25} 
                  alt="Cyclespace Logo"
                  className="hidden dark:block"
                />
                <Image 
                  src={LightLogo} 
                  width={25} 
                  height={25} 
                  alt="Cyclespace Logo"
                  className="block dark:hidden"
                />
                <span className={`${_tourney.className} text-xl font-semibold bg-black dark:bg-white text-transparent bg-clip-text`}>
                  CYCLESPACE
                </span>
              </div>
              <DrawerClose asChild>
                <Button variant="ghost" size="icon">
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close menu</span>
                </Button>
              </DrawerClose>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 space-y-2">
              {navItems.map((item) => (
                <Link 
                  key={item.href} 
                  href={item.href}
                  className="block px-4 py-3 text-lg font-medium rounded-lg hover:bg-accent transition-colors duration-200"
                  onClick={handleNavClick}
                  prefetch={false}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Auth and Theme Controls */}
            <div className="mt-auto pt-6 space-y-4 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Theme</span>
                <ThemeToggle />
              </div>
              
              <div className="space-y-2">
                <SignedOut>
                  <SignInButton>
                    <Button className="w-full bg-[#6c47ff] hover:bg-[#5a3bd8] text-white">
                      Sign In
                    </Button>
                  </SignInButton>
                  <SignUpButton>
                    <Button variant="outline" className="w-full">
                      Create Account
                    </Button>
                  </SignUpButton>
                </SignedOut>
                <SignedIn>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-accent">
                    <span className="text-sm font-medium">Account</span>
                    <UserButton />
                  </div>
                </SignedIn>
                
                <div className="pt-2 flex">
                  <ConnectButton  />
                </div>
              </div>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </NavigationMenu>
  )
});

NavMenu.displayName = 'NavMenu';
