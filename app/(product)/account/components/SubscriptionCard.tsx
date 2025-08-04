'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/ui/icons';
import { Separator } from '@/components/ui/separator';

interface SubscriptionCardProps {
  userMetadata: {
    subscriptionTier?: string;
    subscriptionStatus?: string;
    subscriptionEndDate?: string;
  };
}

export function SubscriptionCard({ userMetadata }: SubscriptionCardProps) {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  
  // Default values if no subscription data exists
  const subscriptionTier = userMetadata?.subscriptionTier || 'Free';
  const subscriptionStatus = userMetadata?.subscriptionStatus || 'inactive';
  const subscriptionEndDate = userMetadata?.subscriptionEndDate || null;
  
  const isActive = subscriptionStatus === 'active';
  const isCancelled = subscriptionStatus === 'cancelled';
  
  const handleUpgrade = async () => {
    try {
      setIsLoading(true);
      // In a real app, this would redirect to a checkout page
      // For now, we'll just show a toast
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.info('Redirecting to checkout...');
    } catch (error) {
      console.error('Error upgrading subscription:', error);
      toast.error('Failed to start upgrade process. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCancel = async () => {
    try {
      setIsLoading(true);
      // In a real app, this would call an API to cancel the subscription
      // For now, we'll just show a toast
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Subscription cancelled successfully.');
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      toast.error('Failed to cancel subscription. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleReactivate = async () => {
    try {
      setIsLoading(true);
      // In a real app, this would call an API to reactivate the subscription
      // For now, we'll just show a toast
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Subscription reactivated successfully!');
    } catch (error) {
      console.error('Error reactivating subscription:', error);
      toast.error('Failed to reactivate subscription. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl">
              {subscriptionTier} Plan
            </CardTitle>
            <CardDescription>
              {isActive 
                ? 'Your current subscription is active.' 
                : isCancelled 
                  ? 'Your subscription has been cancelled.'
                  : 'You are currently on the free plan.'}
            </CardDescription>
          </div>
          <Badge 
            variant={isActive ? 'default' : isCancelled ? 'destructive' : 'outline'}
            className="text-sm"
          >
            {isActive ? 'Active' : isCancelled ? 'Cancelled' : 'Inactive'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Subscription Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Subscription Details</h3>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <p className="text-muted-foreground">Status</p>
                <p className="font-medium">
                  {isActive 
                    ? 'Active' 
                    : isCancelled 
                      ? 'Cancelled' 
                      : 'Inactive'}
                </p>
              </div>
              
              <div className="space-y-1">
                <p className="text-muted-foreground">Plan</p>
                <p className="font-medium">{subscriptionTier}</p>
              </div>
              
              {subscriptionEndDate && (
                <div className="space-y-1">
                  <p className="text-muted-foreground">
                    {isCancelled ? 'Ends on' : 'Renews on'}
                  </p>
                  <p className="font-medium">
                    {format(new Date(subscriptionEndDate), 'MMM d, yyyy')}
                  </p>
                </div>
              )}
              
              <div className="space-y-1">
                <p className="text-muted-foreground">Payment Method</p>
                <p className="font-medium flex items-center">
                  <Icons.creditCard className="h-4 w-4 mr-2" />
                  {isActive ? '•••• 4242' : 'None'}
                </p>
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Plan Features */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Plan Features</h3>
            
            <div className="grid gap-4 md:grid-cols-2">
              {[
                {
                  name: 'Premium Research',
                  included: isActive,
                  description: 'Access to all premium research reports and analysis.'
                },
                {
                  name: 'Trading Signals',
                  included: isActive,
                  description: 'Real-time trading signals and alerts.'
                },
                {
                  name: 'Portfolio Tracking',
                  included: true,
                  description: 'Track all your investments in one place.'
                },
                {
                  name: 'Priority Support',
                  included: isActive,
                  description: '24/7 priority customer support.'
                },
                {
                  name: 'Advanced Analytics',
                  included: isActive && subscriptionTier === 'Pro',
                  description: 'Advanced portfolio analytics and insights.'
                },
                {
                  name: 'API Access',
                  included: isActive && subscriptionTier === 'Pro',
                  description: 'Full access to our trading API.'
                },
              ].map((feature, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`mt-0.5 flex-shrink-0 ${feature.included ? 'text-green-500' : 'text-gray-300 dark:text-gray-600'}`}>
                    {feature.included ? (
                      <Icons.checkCircle2 className="h-5 w-5" />
                    ) : (
                      <Icons.xCircle className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <p className={`font-medium ${!feature.included ? 'text-muted-foreground' : ''}`}>
                      {feature.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="bg-muted/50 border-t flex flex-col sm:flex-row gap-4 sm:justify-between">
        <div className="text-sm text-muted-foreground">
          {isActive ? (
            <p>Your subscription will automatically renew on {subscriptionEndDate ? format(new Date(subscriptionEndDate), 'MMM d, yyyy') : 'the next billing date'}.</p>
          ) : isCancelled ? (
            <p>Your subscription will end on {subscriptionEndDate ? format(new Date(subscriptionEndDate), 'MMM d, yyyy') : 'the end of the current billing period'}.</p>
          ) : (
            <p>Upgrade to a paid plan to unlock all features.</p>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {isActive ? (
            <Button 
              variant="outline" 
              onClick={handleCancel}
              disabled={isLoading}
            >
              {isLoading ? (
                <Icons.spinner className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Icons.xCircle className="h-4 w-4 mr-2" />
              )}
              Cancel Subscription
            </Button>
          ) : isCancelled ? (
            <Button 
              onClick={handleReactivate}
              disabled={isLoading}
            >
              {isLoading ? (
                <Icons.spinner className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Icons.rotateCw className="h-4 w-4 mr-2" />
              )}
              Reactivate Subscription
            </Button>
          ) : (
            <Button 
              onClick={handleUpgrade}
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              {isLoading ? (
                <Icons.spinner className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Icons.zap className="h-4 w-4 mr-2" />
              )}
              Upgrade Plan
            </Button>
          )}
          
          {isActive && (
            <Button variant="outline" disabled={isLoading}>
              <Icons.creditCard className="h-4 w-4 mr-2" />
              Update Payment Method
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
