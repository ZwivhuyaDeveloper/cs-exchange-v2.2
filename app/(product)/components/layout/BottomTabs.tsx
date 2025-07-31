"use client"

import Link from "next/link"
import { usePathname } from 'next/navigation'
import { Home, BarChart2, LineChart, Compass } from "lucide-react"

const BottomTabs = () => {
  const pathname = usePathname()

  const navItems = [
    { name: 'Trade', href: '/Dashboard', icon: <Home className="h-5 w-5" /> },
    { name: 'Sentiment', href: '/News', icon: <BarChart2 className="h-5 w-5" /> },
    { name: 'Analysis', href: '/Research', icon: <LineChart className="h-5 w-5" /> },
    { name: 'Explore', href: '/vault', icon: <Compass className="h-5 w-5" /> },
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
                  ? 'text-[#6c47ff]' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className="flex flex-col items-center">
                {item.icon}
                <span className="text-xs mt-1">{item.name}</span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default BottomTabs
