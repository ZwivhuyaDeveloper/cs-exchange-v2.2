'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Star, Zap, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { UserAccess } from '@/app/lib/access-control';

interface SubscriptionBannerProps {
  userAccess: UserAccess;
  section: 'research' | 'analysis' | 'signals';
  className?: string;
}

const SECTION_BENEFITS = {
  research: {
    title: 'Premium Research',
    description: 'Access exclusive market research and in-depth analysis',
    benefits: ['Exclusive research reports', 'Early access to insights', 'Advanced market data'],
    icon: Star,
  },
  analysis: {
    title: 'Pro Analysis',
    description: 'Get detailed technical and fundamental analysis',
    benefits: ['Technical analysis tools', 'Price predictions', 'Risk assessments'],
    icon: Zap,
  },
  signals: {
    title: 'Trading Signals',
    description: 'Receive actionable trading signals from expert analysts',
    benefits: ['Real-time signals', 'Performance tracking', 'Expert insights'],
    icon: Crown,
  },
};

export default function SubscriptionBanner({ userAccess, section, className = '' }: SubscriptionBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  // Don't show banner if user already has premium access or is admin/analyst
  if (userAccess.canAccess.premiumContent || userAccess.role === 'admin' || userAccess.role === 'analyst' || dismissed) {
    return null;
  }

  const config = SECTION_BENEFITS[section];
  const Icon = config.icon;

  return (
    <Card className={`border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50 ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Icon className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{config.title}</h3>
                <p className="text-sm text-gray-600">{config.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {config.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                  <span className="text-sm text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <Button asChild size="sm">
                <Link href="/pricing">
                  <Crown className="h-4 w-4 mr-2" />
                  Upgrade Now
                </Link>
              </Button>
              
              <Badge variant="outline" className="text-yellow-700 border-yellow-300">
                Starting at $9.99/month
              </Badge>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDismissed(true)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
