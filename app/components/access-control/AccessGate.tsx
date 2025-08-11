'use client';

import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock, Crown, Star, Shield, LogIn } from 'lucide-react';
import Link from 'next/link';
import { AccessControlResult, ContentAccess, UserAccess } from '@/app/lib/access-control';

interface AccessGateProps {
  children: ReactNode;
  userAccess: UserAccess;
  contentAccess: ContentAccess;
  accessResult: AccessControlResult;
  title?: string;
  description?: string;
  showPreview?: boolean;
  className?: string;
}

const ACCESS_LEVEL_CONFIG = {
  public: {
    icon: null,
    label: 'Public',
    color: 'bg-green-100 text-green-800',
  },
  premium: {
    icon: Crown,
    label: 'Premium',
    color: 'bg-yellow-100 text-yellow-800',
  },
  pro: {
    icon: Star,
    label: 'Pro',
    color: 'bg-purple-100 text-purple-800',
  },
  analyst: {
    icon: Shield,
    label: 'Analyst',
    color: 'bg-blue-100 text-blue-800',
  },
  admin: {
    icon: Shield,
    label: 'Admin',
    color: 'bg-red-100 text-red-800',
  },
};

export default function AccessGate({
  children,
  userAccess,
  contentAccess,
  accessResult,
  title,
  description,
  showPreview = false,
  className = '',
}: AccessGateProps) {
  // If user has access, render content normally
  if (accessResult.hasAccess) {
    return <div className={className}>{children}</div>;
  }

  // Get access level configuration
  const config = ACCESS_LEVEL_CONFIG[contentAccess.accessLevel];
  const Icon = config.icon;

  return (
    <div className={`relative ${className}`}>
      {/* Preview content with overlay */}
      {showPreview && (
        <div className="relative">
          <div className="blur-sm pointer-events-none">
            {children}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent" />
        </div>
      )}

      {/* Access control overlay */}
      <div className={`${showPreview ? 'absolute inset-0' : ''} flex items-center justify-center p-6`}>
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              {accessResult.loginRequired ? (
                <LogIn className="h-12 w-12 text-gray-400" />
              ) : (
                <Lock className="h-12 w-12 text-gray-400" />
              )}
            </div>
            
            <CardTitle className="flex items-center justify-center gap-2">
              {Icon && <Icon className="h-5 w-5" />}
              {title || `${config.label} Content`}
            </CardTitle>
            
            {contentAccess.accessLevel !== 'public' && (
              <Badge className={config.color}>
                {config.label} Required
              </Badge>
            )}
          </CardHeader>
          
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              {description || accessResult.reason}
            </p>

            {/* Action buttons */}
            <div className="flex flex-col gap-2">
              {accessResult.loginRequired && (
                <Button asChild>
                  <Link href="/sign-in">
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In to Continue
                  </Link>
                </Button>
              )}

              {accessResult.upgradeRequired && (
                <Button asChild>
                  <Link href="/pricing">
                    <Crown className="h-4 w-4 mr-2" />
                    Upgrade to {config.label}
                  </Link>
                </Button>
              )}

              {!accessResult.loginRequired && !accessResult.upgradeRequired && (
                <Button variant="outline" asChild>
                  <Link href="/contact">
                    Contact Support
                  </Link>
                </Button>
              )}
            </div>

            {/* Current access level */}
            {userAccess.userId && (
              <div className="pt-4 border-t">
                <p className="text-sm text-gray-500">
                  Current Access: <span className="font-medium capitalize">{userAccess.role}</span>
                  {userAccess.subscription && (
                    <span className="ml-2">({userAccess.subscription.tier})</span>
                  )}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
