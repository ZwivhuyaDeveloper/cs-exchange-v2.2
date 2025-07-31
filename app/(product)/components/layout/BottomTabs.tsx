"use client"

import Link from "next/link"
import { usePathname } from 'next/navigation'
import { Compass, Newspaper, PaperclipIcon, Settings2 } from "lucide-react"
import { IconSmartHome } from "@tabler/icons-react"

const BottomTabs = () => {
  const pathname = usePathname()

  const navItems = [
    { name: 'Sentiment', href: '/News', icon: <Newspaper className="h-6 w-6" /> },
    { name: 'Analysis', href: '/Research', icon: <PaperclipIcon className="h-6 w-6" /> },
    { name: 'Trade', href: '/Dashboard', icon: <div className="bg-black dark:bg-[#00ffc2] rounded-full p-2 fixed bottom-5"><IconSmartHome className="h-10 w-10" /></div> },
    { name: 'Signals', href: '/signals', icon: <Compass className="h-6 w-6" /> },
    { name: 'Explore', href: '/vault', icon: <Settings2 className="h-6 w-6" /> },
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
                  ? 'text-background ' 
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
