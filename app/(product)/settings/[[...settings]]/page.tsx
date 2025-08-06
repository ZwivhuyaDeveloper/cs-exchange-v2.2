"use client"

import { UserProfile, SignOutButton, useUser, useClerk } from "@clerk/nextjs"
import { dark } from "@clerk/themes"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const { theme } = useTheme()
  const { user } = useUser()
  const { signOut } = useClerk()
  const router = useRouter()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleSignOut = () => {
    signOut(() => router.push('/'))
  }

  const handleDeleteAccount = async () => {
    try {
      await user?.delete()
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('Error deleting account:', error)
    }
  }

  return (
    <div className="container mx-auto p-4 pb-20 md:pb-4">
      <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
      <div className="mx-auto w-full h-full space-y-6">
        <UserProfile 
          appearance={{
            baseTheme: theme === 'dark' ? dark : undefined,
            elements: {
              rootBox: 'w-full',
              card: 'shadow-none w-full',
              navbar: 'hidden',
              scrollBox: 'rounded-lg',
              pageScrollBox: 'p-0 md:p-6',
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
        
        <div className="mt-8 space-y-4 border-t pt-6 dark:border-zinc-800">
          <div className="flex flex-col space-y-4">
            <h3 className="text-lg font-semibold">Account Actions</h3>
            <div className="flex flex-col space-y-3">
              <Button 
                variant="outline" 
                onClick={handleSignOut}
                className="w-full"
              >
                Sign Out
              </Button>
              
              <Button 
                variant="destructive" 
                onClick={() => {
                  if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                    handleDeleteAccount()
                  }
                }}
                className="w-full"
              >
                Delete Account
              </Button>
            </div>
          </div>
        </div>
      </div>


    </div>
  )
}
