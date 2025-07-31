"use client"

import Link from "next/link"
import { usePathname } from 'next/navigation'
import { Home, BarChart2, LineChart, Compass } from "lucide-react"
import { IconHome, IconHome2, IconHomeDollar, IconSmartHome } from "@tabler/icons-react"

const BottomTabs = () => {
  const pathname = usePathname()

  const navItems = [
    { name: 'Sentiment', href: '/News', icon: <BarChart2 className="h-6 w-6" /> },
    { name: 'Analysis', href: '/Research', icon: <LineChart className="h-6 w-6" /> },
    { name: 'Trade', href: '/Dashboard', icon: <IconSmartHome className="h-6 w-6" /> },
    { name: 'Signals', href: '/signals', icon: <Compass className="h-6 w-6" /> },
    { name: 'Explore', href: '/vault', icon: <Compass className="h-6 w-6" /> },
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
              className={`flex flex-col items-center justify-center flex-1 h-full ${
                isActive 
                  ? 'text-[#00ffc2]' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className="flex flex-col items-center">
                {item.icon}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default BottomTabs
