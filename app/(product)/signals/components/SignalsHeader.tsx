'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  TrendingUp, 
  Users, 
  Target, 
  Crown,
  Bell,
  Settings,
  BarChart3,
  Zap,
  Shield
} from 'lucide-react';
import Link from 'next/link';

interface SignalsStats {
  totalSignals: number;
  activeSignals: number;
  totalAnalysts: number;
  avgSuccessRate: number;
  featuredSignals: number;
}

export default function SignalsHeader() {
  const { user, isLoaded } = useUser();
  const [stats, setStats] = useState<SignalsStats | null>(null);
  const [userSubscription, setUserSubscription] = useState<string>('Free');

  useEffect(() => {
    // Fetch signals statistics
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/signals/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Failed to fetch signals stats:', error);
      }
    };

    // Fetch user subscription info
    const fetchUserSubscription = async () => {
      if (user) {
        try {
          const response = await fetch('/api/user/subscription');
          if (response.ok) {
            const data = await response.json();
            setUserSubscription(data.tier || 'Free');
          }
        } catch (error) {
          console.error('Failed to fetch user subscription:', error);
        }
      }
    };

    if (isLoaded) {
      fetchStats();
      fetchUserSubscription();
    }
  }, [user, isLoaded]);

  const getSubscriptionColor = (subscription: string) => {
    switch (subscription) {
      case 'Premium':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Pro':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Analyst':
        return 'bg-gold-100 text-gold-800 border-gold-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSubscriptionIcon = (subscription: string) => {
    switch (subscription) {
      case 'Premium':
        return <Zap className="h-4 w-4" />;
      case 'Pro':
        return <BarChart3 className="h-4 w-4" />;
      case 'Analyst':
        return <Crown className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Trading Signals</h1>
          <p className="text-gray-600 mt-1">
            Discover actionable trading insights from verified analysts and the community
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {user && (
            <Badge className={`${getSubscriptionColor(userSubscription)} flex items-center space-x-1`}>
              {getSubscriptionIcon(userSubscription)}
              <span>{userSubscription}</span>
            </Badge>
          )}
          
          <Button variant="outline" size="sm" asChild>
            <Link href="/signals/notifications">
              <Bell className="h-4 w-4 mr-2" />
              Alerts
            </Link>
          </Button>

          {user && ['admin', 'analyst'].includes(user.publicMetadata?.role as string) && (
            <Button size="sm" asChild>
              <Link href="/admin/signals">
                <Settings className="h-4 w-4 mr-2" />
                Manage
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stats.totalSignals}</div>
              <div className="text-sm text-gray-600">Total Signals</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stats.activeSignals}</div>
              <div className="text-sm text-gray-600">Active Signals</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stats.totalAnalysts}</div>
              <div className="text-sm text-gray-600">Verified Analysts</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <BarChart3 className="h-6 w-6 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stats.avgSuccessRate}%</div>
              <div className="text-sm text-gray-600">Avg Success Rate</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Crown className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stats.featuredSignals}</div>
              <div className="text-sm text-gray-600">Featured</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Subscription Upgrade Banner */}
      {userSubscription === 'Free' && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Unlock Premium Signals
                </h3>
                <p className="text-gray-600">
                  Get access to exclusive signals, advanced analytics, and real-time alerts from top analysts.
                </p>
              </div>
              <div className="flex space-x-3">
                <Button variant="outline" asChild>
                  <Link href="/pricing">
                    View Plans
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/upgrade">
                    <Crown className="h-4 w-4 mr-2" />
                    Upgrade Now
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Navigation */}
      <div className="flex flex-wrap gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/signals?featured=true">
            <Crown className="h-4 w-4 mr-2" />
            Featured
          </Link>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/signals?status=active">
            <TrendingUp className="h-4 w-4 mr-2" />
            Active
          </Link>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/signals?direction=buy">
            <Target className="h-4 w-4 mr-2" />
            Buy Signals
          </Link>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/analysts">
            <Users className="h-4 w-4 mr-2" />
            Top Analysts
          </Link>
        </Button>
      </div>
    </div>
  );
}
