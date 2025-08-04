"use client"

import Link from "next/link"
import { usePathname } from 'next/navigation'
import { Compass, Newspaper, Settings2, Home, User, LogIn } from "lucide-react"
import { IconNews, IconSmartHome } from "@tabler/icons-react"
import { SignedIn, SignedOut, useAuth } from '@clerk/nextjs'
import { cn } from '@/lib/utils'

const BottomTabs = () => {
  const pathname = usePathname()
  const { isLoaded, userId } = useAuth()

  // Navigation items for authenticated users
  const authNavItems = [
    { name: 'News', href: '/News', icon: <Newspaper className="h-5 w-5" /> },
    { name: 'Research', href: '/research', icon: <IconNews className="h-5 w-5" /> },
    { name: 'Trade', href: '/Dashboard', icon: <IconSmartHome className="h-5 w-5" /> },
    { name: 'Signals', href: '/signals', icon: <Compass className="h-5 w-5" /> },
    { name: 'Account', href: '/account', icon: <User className="h-5 w-5" /> },
  ]

  // Navigation items for unauthenticated users
  const publicNavItems = [
    { name: 'Home', href: '/', icon: <Home className="h-5 w-5" /> },
    { name: 'Features', href: '/#features', icon: <Compass className="h-5 w-5" /> },
    { name: 'Pricing', href: '/pricing', icon: <Newspaper className="h-5 w-5" /> },
    { name: 'About', href: '/about', icon: <Settings2 className="h-5 w-5" /> },
    { name: 'Sign In', href: '/sign-in', icon: <LogIn className="h-5 w-5" /> },
  ]

  // Use appropriate nav items based on auth state
  const navItems = userId ? authNavItems : publicNavItems

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
                         (item.href !== '/' && pathname?.startsWith(item.href))
          
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-between flex-1 h-12 transition-colors',
                isActive 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-muted-foreground hover:text-foreground',
                'group relative'
              )}
            >
              <div className={cn(
                'flex flex-col items-center transition-transform',
                isActive ? 'scale-110' : 'group-hover:scale-105'
              )}>
                {item.icon}
              </div>
              <div className={cn(
                'text-xs font-medium transition-all',
                isActive ? 'scale-100 opacity-100' : 'scale-90 opacity-80 group-hover:scale-100 group-hover:opacity-100'
              )}>
                {item.name}
              </div>
              {isActive && (
                <div className="absolute top-0 w-1 h-1 bg-blue-600 dark:bg-blue-400 rounded-full" />
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default BottomTabs
