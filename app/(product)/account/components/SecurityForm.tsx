'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useUser, useClerk } from '@clerk/nextjs';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';


import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Icons } from '@/components/ui/icons';
import { Separator } from '@/components/ui/separator';


// Define form schema for password change
const passwordFormSchema = z.object({
  currentPassword: z.string().min(8, {
    message: 'Current password is required',
  }),
  newPassword: z.string().min(8, {
    message: 'Password must be at least 8 characters long',
  }),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof passwordFormSchema>;

export function SecurityForm() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [is2FAEnabled, setIs2FAEnabled] = useState(user?.twoFactorEnabled || false);
  const [isLoading, setIsLoading] = useState({
    password: false,
    twoFactor: false,
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const handlePasswordChange = async (data: PasswordFormValues) => {
    try {
      setIsLoading(prev => ({ ...prev, password: true }));
      
      // This is a placeholder. In a real app, you would call your API to change the password
      // The actual implementation depends on your authentication flow
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Sign out the user after password change
      await signOut();
      
      toast.success('Password changed successfully. Please sign in again.');
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('Failed to change password. Please try again.');
    } finally {
      setIsLoading(prev => ({ ...prev, password: false }));
    }
  };

  const toggle2FA = async () => {
    try {
      setIsLoading(prev => ({ ...prev, twoFactor: true }));
      
      // This is a placeholder. In a real app, you would enable/disable 2FA
      // The actual implementation depends on your authentication flow
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIs2FAEnabled(!is2FAEnabled);
      toast.success(
        is2FAEnabled 
          ? 'Two-factor authentication has been disabled.' 
          : 'Two-factor authentication has been enabled.'
      );
    } catch (error) {
      console.error('Error toggling 2FA:', error);
      toast.error('Failed to update two-factor authentication settings.');
    } finally {
      setIsLoading(prev => ({ ...prev, twoFactor: false }));
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Change Password</h3>
        
        {!showPasswordForm ? (
          <Button 
            variant="outline" 
            onClick={() => setShowPasswordForm(true)}
          >
            Change Password
          </Button>
        ) : (
          <Form {...form}>
            <form 
              onSubmit={form.handleSubmit(handlePasswordChange)} 
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="Enter your current password" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="Enter new password" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="Confirm new password" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex gap-2 pt-2">
                <Button 
                  type="submit" 
                  disabled={isLoading.password}
                >
                  {isLoading.password && (
                    <Icons.checkCircle2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Update Password
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowPasswordForm(false)}
                  disabled={isLoading.password}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        )}
      </div>
      
      <Separator className="my-6" />
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
        
        <Alert className={is2FAEnabled ? "border-green-500" : ""}>
          <div className="flex items-center justify-between">
            <div>
              <AlertTitle className="flex items-center">
                {is2FAEnabled ? (
                  <Icons.checkCircle2 className="h-5 w-5 text-green-500 mr-2" />
                ) : (
                  <Icons.checkCircle2 className="h-5 w-5 text-yellow-500 mr-2" />
                )}
                {is2FAEnabled ? '2FA is enabled' : '2FA is not enabled'}
              </AlertTitle>
              <AlertDescription className="mt-1">
                {is2FAEnabled
                  ? 'Two-factor authentication is currently enabled for your account.'
                  : 'Add an extra layer of security by enabling two-factor authentication.'}
              </AlertDescription>
            </div>
            <Button 
              variant="outline" 
              onClick={toggle2FA}
              disabled={isLoading.twoFactor}
            >
              {isLoading.twoFactor ? (
                <Icons.checkCircle2 className="h-4 w-4 animate-spin mr-2" />
              ) : is2FAEnabled ? (
                <Icons.checkCircle2 className="h-4 w-4 mr-2" />
              ) : (
                <Icons.checkCircle2 className="h-4 w-4 mr-2" />
              )}
              {is2FAEnabled ? 'Disable' : 'Enable'} 2FA
            </Button>
          </div>
        </Alert>
        
        {!is2FAEnabled && (
          <div className="text-sm text-muted-foreground mt-2">
            <p>When enabled, you'll be prompted for a verification code during sign-in.</p>
            <p className="mt-1">
              Note: You'll need an authenticator app like Google Authenticator or Authy.
            </p>
          </div>
        )}
      </div>
      
      <Separator className="my-6" />
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-destructive">Danger Zone</h3>
        
        <Alert variant="destructive">
          <div className="flex items-center justify-between">
            <div>
              <AlertTitle>Delete Account</AlertTitle>
              <AlertDescription>
                Permanently delete your account and all associated data.
              </AlertDescription>
            </div>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => {
                // Implement account deletion logic
                toast.error('Account deletion is currently disabled in this demo.');
              }}
            >
              Delete Account
            </Button>
          </div>
        </Alert>
      </div>
    </div>
  );
}
