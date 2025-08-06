"use client"

import { UserProfile } from "@clerk/nextjs"
import { dark } from "@clerk/themes"
import { useTheme } from "next-themes"
import { Card } from "@/components/ui/card"


export default function SettingsPage() {
  const { theme } = useTheme()

  return (
    <div className="container mx-auto p-4 pb-20 md:pb-4">
      <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
      <div className="mx-auto w-full h-full">
        <UserProfile 
          appearance={{
            baseTheme: theme === 'dark' ? dark : undefined,
            elements: {
              rootBox: 'w-full h-full',
              card: 'shadow-none w-full h-full',
              navbar: 'hidden h-full',
              scrollBox: 'rounded-lg h-full',
              pageScrollBox: 'p-0 md:p-6 h-full',
              headerTitle: 'text-2xl font-bold',
              headerSubtitle: 'text-muted-foreground',
              profileSectionTitleText: 'font-semibold',
              formButtonPrimary: 'bg-primary hover:bg-primary/90',
              formFieldInput: 'border-input',
              footerActionLink: 'text-primary hover:text-primary/80',
            },
          }}
          path="/settings"
          routing="path"
        />
      </div>
    </div>
  )
}
