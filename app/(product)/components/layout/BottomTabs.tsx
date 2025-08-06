"use client"

import Link from "next/link"
import { usePathname } from 'next/navigation'
import { Compass, Newspaper, Settings2 } from "lucide-react"
import { IconNews, IconSmartHome } from "@tabler/icons-react"
import { Newsreader } from "next/font/google"
import { FaHackerNewsSquare, FaRegNewspaper } from "react-icons/fa"

const BottomTabs = () => {
  const pathname = usePathname()

  const navItems = [
    { name: 'Sentiment', href: '/News', icon: <Newspaper className="h-6 w-6" /> },
    { name: 'Analysis', href: '/Research', icon: <IconNews className="h-6 w-6" /> },
    { name: 'Trade', href: '/Dashboard', icon: <IconSmartHome className="h-6 w-6" /> },
    { name: 'Signals', href: '/signals', icon: <Compass className="h-6 w-6" /> },
    { name: 'Settings', href: '/settings', icon: <Settings2 className="h-6 w-6" /> },
  ]

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-gray-200 dark:border-gray-700 z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
                         (item.href !== '/' && pathname?.startsWith(item.href))
          
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex flex-col items-center justify-between flex-1  h-12 ${
                isActive 
                  ? 'dark:text-[#00ffc2] text-[#0E76FD] ' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className="flex flex-col items-center">
                {item.icon}
              </div>
              <div className="flex flex-col items-center text-xs">
                {item.name}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default BottomTabs
