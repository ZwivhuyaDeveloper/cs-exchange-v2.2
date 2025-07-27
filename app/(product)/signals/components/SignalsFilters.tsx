'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Filter, 
  X, 
  Search,
  TrendingUp,
  TrendingDown,
  Target,
  Clock,
  Shield,
  Star
} from 'lucide-react';

interface SignalsFiltersProps {
  searchParams: {
    page?: string;
    category?: string;
    token?: string;
    direction?: string;
    status?: string;
    analyst?: string;
    featured?: string;
  };
}

const DIRECTION_OPTIONS = [
  { value: 'buy', label: 'Buy', icon: TrendingUp },
  { value: 'sell', label: 'Sell', icon: TrendingDown },
  { value: 'long', label: 'Long', icon: TrendingUp },
  { value: 'short', label: 'Short', icon: TrendingDown },
];

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active', color: 'bg-green-100 text-green-800' },
  { value: 'filled', label: 'Filled', color: 'bg-blue-100 text-blue-800' },
  { value: 'target_hit', label: 'Target Hit', color: 'bg-emerald-100 text-emerald-800' },
  { value: 'stop_loss', label: 'Stop Loss', color: 'bg-red-100 text-red-800' },
  { value: 'completed', label: 'Completed', color: 'bg-gray-100 text-gray-800' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-orange-100 text-orange-800' },
  { value: 'expired', label: 'Expired', color: 'bg-yellow-100 text-yellow-800' },
];

const TIMEFRAME_OPTIONS = [
  { value: 'scalping', label: 'Scalping (Minutes)' },
  { value: 'short', label: 'Short-term (Hours)' },
  { value: 'medium', label: 'Medium-term (Days)' },
  { value: 'long', label: 'Long-term (Weeks)' },
  { value: 'swing', label: 'Swing (Weeks-Months)' },
];

const RISK_LEVEL_OPTIONS = [
  { value: 'very_low', label: 'Very Low', color: 'bg-blue-100 text-blue-800' },
  { value: 'low', label: 'Low', color: 'bg-green-100 text-green-800' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800' },
  { value: 'very_high', label: 'Very High', color: 'bg-red-100 text-red-800' },
];

export default function SignalsFilters({ searchParams }: SignalsFiltersProps) {
  const router = useRouter();
  const urlSearchParams = useSearchParams();
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState({
    token: searchParams.token || '',
    direction: searchParams.direction || '',
    status: searchParams.status || '',
    category: searchParams.category || '',
    analyst: searchParams.analyst || '',
    timeframe: '',
    riskLevel: '',
    featured: searchParams.featured || '',
  });

  // Count active filters
  const activeFiltersCount = Object.values(filters).filter(value => value && value !== '').length;

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Update URL with new filters
    const params = new URLSearchParams();
    
    // Copy existing search params if they exist
    if (urlSearchParams) {
      for (const [key, value] of urlSearchParams.entries()) {
        params.set(key, value);
      }
    }
    
    if (value && value !== 'all') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    
    // Reset to page 1 when filters change
    params.delete('page');
    
    router.push(`/signals?${params.toString()}`);
  };

  const clearAllFilters = () => {
    setFilters({
      token: '',
      direction: '',
      status: '',
      category: '',
      analyst: '',
      timeframe: '',
      riskLevel: '',
      featured: '',
    });
    
    router.push('/signals');
  };

  const clearFilter = (key: string) => {
    handleFilterChange(key, '');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center space-x-2">
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-red-600 hover:text-red-700"
              >
                Clear All
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Less' : 'More'} Filters
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Quick Filters - Always Visible */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="token-search">Token Symbol</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="token-search"
                placeholder="e.g., BTC, ETH"
                value={filters.token}
                onChange={(e) => handleFilterChange('token', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Direction</Label>
            <Select value={filters.direction} onValueChange={(value) => handleFilterChange('direction', value)}>
              <SelectTrigger>
                <SelectValue placeholder="All directions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All directions</SelectItem>
                {DIRECTION_OPTIONS.map((option) => {
                  const Icon = option.icon;
                  return (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center space-x-2">
                        <Icon className="h-4 w-4" />
                        <span>{option.label}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${option.color.split(' ')[0]}`} />
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center space-x-1">
              <Star className="h-4 w-4" />
              <span>Featured Only</span>
            </Label>
            <Select value={filters.featured} onValueChange={(value) => handleFilterChange('featured', value)}>
              <SelectTrigger>
                <SelectValue placeholder="All signals" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All signals</SelectItem>
                <SelectItem value="featured">Featured only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Advanced Filters - Expandable */}
        {isExpanded && (
          <div className="border-t pt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Timeframe</Label>
                <Select value={filters.timeframe} onValueChange={(value) => handleFilterChange('timeframe', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All timeframes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All timeframes</SelectItem>
                    {TIMEFRAME_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4" />
                          <span>{option.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Risk Level</Label>
                <Select value={filters.riskLevel} onValueChange={(value) => handleFilterChange('riskLevel', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All risk levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All risk levels</SelectItem>
                    {RISK_LEVEL_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center space-x-2">
                          <Shield className="h-4 w-4" />
                          <span>{option.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="analyst-search">Analyst</Label>
                <Input
                  id="analyst-search"
                  placeholder="Analyst name"
                  value={filters.analyst}
                  onChange={(e) => handleFilterChange('analyst', e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <div className="border-t pt-4">
            <div className="flex flex-wrap gap-2">
              {Object.entries(filters).map(([key, value]) => {
                if (!value) return null;
                
                let displayValue = value;
                let displayKey = key;
                
                // Format display values
                if (key === 'direction') {
                  const option = DIRECTION_OPTIONS.find(opt => opt.value === value);
                  displayValue = option?.label || value;
                  displayKey = 'Direction';
                } else if (key === 'status') {
                  const option = STATUS_OPTIONS.find(opt => opt.value === value);
                  displayValue = option?.label || value;
                  displayKey = 'Status';
                } else if (key === 'timeframe') {
                  const option = TIMEFRAME_OPTIONS.find(opt => opt.value === value);
                  displayValue = option?.label || value;
                  displayKey = 'Timeframe';
                } else if (key === 'riskLevel') {
                  const option = RISK_LEVEL_OPTIONS.find(opt => opt.value === value);
                  displayValue = option?.label || value;
                  displayKey = 'Risk Level';
                } else if (key === 'featured' && value === 'true') {
                  displayValue = 'Featured';
                  displayKey = '';
                } else {
                  displayKey = key.charAt(0).toUpperCase() + key.slice(1);
                }
                
                return (
                  <Badge
                    key={key}
                    variant="secondary"
                    className="flex items-center space-x-1 pr-1"
                  >
                    <span>
                      {displayKey && `${displayKey}: `}{displayValue}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => clearFilter(key)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
