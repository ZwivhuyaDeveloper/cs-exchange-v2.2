'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Search, 
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  TrendingUp,
  TrendingDown,
  Target,
  Users,
  BarChart3,
  AlertTriangle
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

interface SignalStats {
  totalSignals: number;
  activeSignals: number;
  completedSignals: number;
  avgPerformance: number;
}

interface Signal {
  _id: string;
  name: string;
  slug: { current: string };
  token: {
    symbol: string;
    name: string;
    logoURL?: string;
  };
  analyst: {
    displayName: string;
    avatar?: { asset: { url: string } };
    isVerified: boolean;
  };
  direction: 'buy' | 'sell' | 'long' | 'short';
  entryPrice: number;
  status: string;
  accessLevel: string;
  priority: string;
  featured: boolean;
  publishedAt: string;
  lastUpdated: string;
  performance?: {
    pnlPercentage: number;
    daysActive: number;
  };
}

interface SignalsManagementDashboardProps {
  userId: string;
}

export default function SignalsManagementDashboard({ userId }: SignalsManagementDashboardProps) {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [stats, setStats] = useState<SignalStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchSignals();
    fetchStats();
  }, []);

  const fetchSignals = async () => {
    try {
      const response = await fetch('/api/admin/signals');
      if (response.ok) {
        const data = await response.json();
        setSignals(data.signals);
      }
    } catch (error) {
      console.error('Failed to fetch signals:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/signals/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleDeleteSignal = async (signalId: string) => {
    if (!confirm('Are you sure you want to delete this signal?')) return;

    try {
      const response = await fetch(`/api/admin/signals/${signalId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSignals(signals.filter(signal => signal._id !== signalId));
      }
    } catch (error) {
      console.error('Failed to delete signal:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'filled':
        return 'bg-blue-100 text-blue-800';
      case 'target_hit':
        return 'bg-emerald-100 text-emerald-800';
      case 'stop_loss':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDirectionIcon = (direction: string) => {
    return direction === 'buy' || direction === 'long' 
      ? <TrendingUp className="h-4 w-4 text-green-500" />
      : <TrendingDown className="h-4 w-4 text-red-500" />;
  };

  const filteredSignals = signals.filter(signal => {
    const matchesSearch = signal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         signal.token.symbol.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || signal.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Signals</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalSignals}</p>
                </div>
                <Target className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Signals</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeSignals}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.completedSignals}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Performance</p>
                  <p className={`text-2xl font-bold ${
                    stats.avgPerformance >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stats.avgPerformance.toFixed(1)}%
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Actions Bar */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <CardTitle>Signal Management</CardTitle>
            <div className="flex items-center space-x-3">
              <Button asChild>
                <Link href="/admin/signals/create">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Signal
                </Link>
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search signals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <select
             title='hey'
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="filled">Filled</option>
              <option value="target_hit">Target Hit</option>
              <option value="stop_loss">Stop Loss</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Signals Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Signal</TableHead>
                  <TableHead>Token</TableHead>
                  <TableHead>Analyst</TableHead>
                  <TableHead>Direction</TableHead>
                  <TableHead>Entry Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSignals.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                      No signals found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSignals.map((signal) => (
                    <TableRow key={signal._id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {signal.featured && (
                            <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                          )}
                          <div>
                            <p className="font-medium">{signal.name}</p>
                            <Badge variant="outline" className="text-xs">
                              {signal.accessLevel}
                            </Badge>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {signal.token.logoURL && (
                            <div className="relative w-6 h-6">
                              <Image
                                src={signal.token.logoURL}
                                alt={signal.token.symbol}
                                width={24}
                                height={24}
                                className="rounded-full object-cover"
                                unoptimized={true}
                              />
                            </div>
                          )}
                          <div>
                            <p className="font-medium">{signal.token.symbol}</p>
                            <p className="text-sm text-gray-500">{signal.token.name}</p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={signal.analyst.avatar?.asset?.url} />
                            <AvatarFallback className="text-xs">
                              {signal.analyst.displayName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{signal.analyst.displayName}</span>
                          {signal.analyst.isVerified && (
                            <Badge variant="secondary" className="text-xs">✓</Badge>
                          )}
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center space-x-1">
                          {getDirectionIcon(signal.direction)}
                          <span className="capitalize">{signal.direction}</span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <span className="font-mono">${signal.entryPrice.toLocaleString()}</span>
                      </TableCell>

                      <TableCell>
                        <Badge className={getStatusColor(signal.status)}>
                          {signal.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        {signal.performance ? (
                          <div className="text-sm">
                            <span className={`font-medium ${
                              signal.performance.pnlPercentage >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {signal.performance.pnlPercentage.toFixed(1)}%
                            </span>
                            <p className="text-gray-500 text-xs">
                              {signal.performance.daysActive}d active
                            </p>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>

                      <TableCell>
                        <span className="text-sm text-gray-500">
                          {formatDistanceToNow(new Date(signal.lastUpdated), { addSuffix: true })}
                        </span>
                      </TableCell>

                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/signals/${signal.slug.current}`}>
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/signals/edit/${signal._id}`}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteSignal(signal._id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
