'use client';

import { useUser, UserButton } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Icons } from '@/components/ui/icons';
import { ProfileForm } from './components/ProfileForm';
import { SecurityForm } from './components/SecurityForm';
import { SubscriptionCard } from './components/SubscriptionCard';
import { BillingHistory } from './components/BillingHistory';

interface UserMetadata {
  subscriptionTier?: string;
  subscriptionStatus?: string;
  canAccessSignals?: boolean;
  canAccessResearch?: boolean;
}

export default function AccountPage() {
  const { isLoaded, user } = useUser();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || !isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Icons.checkCircle2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    router.push('/sign-in');
    return null;
  }

  // Get user metadata with type safety
  const userMetadata = (user.unsafeMetadata || {}) as UserMetadata;
  const { subscriptionTier = 'Free', subscriptionStatus = 'inactive' } = userMetadata;

  return (
    <div className="container max-w-6xl py-8 space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {/* Left sidebar */}
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                    <UserButton 
                      appearance={{
                        elements: {
                          userButtonAvatarBox: 'h-full w-full',
                        },
                      }}
                    />
                  </div>
                  {userMetadata.subscriptionTier && (
                    <Badge className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                      {userMetadata.subscriptionTier}
                    </Badge>
                  )}
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-medium">
                    {user.firstName} {user.lastName}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {user.primaryEmailAddress?.emailAddress}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-sm font-medium">Account Status</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Email Verified</span>
                  {user.emailAddresses[0]?.verification?.status === 'verified' ? (
                    <Icons.checkCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <Button variant="link" size="sm" className="h-4 p-0">
                      Verify
                    </Button>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">2FA Enabled</span>
                  <Button variant="link" size="sm" className="h-4 p-0">
                    {user.twoFactorEnabled ? 'Manage' : 'Enable'}
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Member Since</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(user.createdAt || 0).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main content */}
        <div className="md:col-span-3">
          <Tabs defaultValue="profile" className="space-y-4" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="subscription">Subscription</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your personal information and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ProfileForm user={user} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>
                    Manage your password and security preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SecurityForm />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="subscription" className="space-y-4">
              <SubscriptionCard userMetadata={userMetadata} />
            </TabsContent>

            <TabsContent value="billing" className="space-y-4">
              <BillingHistory />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

