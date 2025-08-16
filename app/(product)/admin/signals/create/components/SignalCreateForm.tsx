'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Plus, 
  X, 
  Search,
  TrendingUp,
  TrendingDown,
  Target,
  Shield,
  Clock,
  BarChart3,
  Save,
  Eye
} from 'lucide-react';
import { toast } from 'sonner';

interface Token {
  _id: string;
  symbol: string;
  name: string;
  logoURL?: string;
}

interface SignalFormData {
  name: string;
  tokenId: string;
  categoryId: string;
  direction: 'buy' | 'sell' | 'long' | 'short';
  signalType: string;
  entryPrice: string;
  targetPrices: string[];
  stopLoss: string;
  timeframe: string;
  riskLevel: string;
  confidence: string;
  accessLevel: string;
  priority: string;
  featured: boolean;
  notes: string;
}

interface SignalCreateFormProps {
  userId: string;
}

const DIRECTION_OPTIONS = [
  { value: 'buy', label: 'Buy', icon: TrendingUp, color: 'text-green-600' },
  { value: 'sell', label: 'Sell', icon: TrendingDown, color: 'text-red-600' },
  { value: 'long', label: 'Long', icon: TrendingUp, color: 'text-green-600' },
  { value: 'short', label: 'Short', icon: TrendingDown, color: 'text-red-600' },
];

const SIGNAL_TYPES = [
  'Breakout', 'Breakdown', 'Support Bounce', 'Resistance Rejection',
  'Trend Continuation', 'Trend Reversal', 'Divergence', 'News Catalyst',
  'Fundamental', 'Other'
];

const TIMEFRAMES = [
  { value: 'scalping', label: 'Scalping (Minutes)' },
  { value: 'short', label: 'Short-term (Hours)' },
  { value: 'medium', label: 'Medium-term (Days)' },
  { value: 'long', label: 'Long-term (Weeks)' },
  { value: 'swing', label: 'Swing (Weeks-Months)' },
];

const RISK_LEVELS = [
  { value: 'very_low', label: 'Very Low' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'very_high', label: 'Very High' },
];

const ACCESS_LEVELS = [
  { value: 'public', label: 'Public' },
  { value: 'premium', label: 'Premium' },
  { value: 'pro', label: 'Pro' },
  { value: 'analyst', label: 'Analyst' },
  { value: 'admin', label: 'Admin' },
];

export default function SignalCreateForm({ userId }: SignalCreateFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [tokenSearch, setTokenSearch] = useState('');
  
  const [formData, setFormData] = useState<SignalFormData>({
    name: '',
    tokenId: '',
    categoryId: '',
    direction: 'buy',
    signalType: '',
    entryPrice: '',
    targetPrices: [''],
    stopLoss: '',
    timeframe: 'medium',
    riskLevel: 'medium',
    confidence: '',
    accessLevel: 'public',
    priority: 'medium',
    featured: false,
    notes: '',
  });

  useEffect(() => {
    fetchTokens();
  }, []);

  const fetchTokens = async () => {
    try {
      const response = await fetch('/api/tokens');
      if (response.ok) {
        const data = await response.json();
        setTokens(data.tokens || []);
      }
    } catch (error) {
      console.error('Failed to fetch tokens:', error);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addTargetPrice = () => {
    setFormData(prev => ({
      ...prev,
      targetPrices: [...prev.targetPrices, '']
    }));
  };

  const removeTargetPrice = (index: number) => {
    setFormData(prev => ({
      ...prev,
      targetPrices: prev.targetPrices.filter((_, i) => i !== index)
    }));
  };

  const updateTargetPrice = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      targetPrices: prev.targetPrices.map((price, i) => i === index ? value : price)
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      toast.error('Signal name is required');
      return false;
    }
    if (!formData.tokenId) {
      toast.error('Please select a token');
      return false;
    }
    if (!formData.entryPrice || parseFloat(formData.entryPrice) <= 0) {
      toast.error('Valid entry price is required');
      return false;
    }
    if (formData.targetPrices.filter(p => p.trim()).length === 0) {
      toast.error('At least one target price is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent, isDraft: boolean = false) => {
    e.preventDefault();
    
    if (!isDraft && !validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/admin/signals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          isDraft,
          analystId: userId,
        }),
      });

      if (response.ok) {
        toast.success(`Signal ${isDraft ? 'saved as draft' : 'created'} successfully!`);
        router.push('/admin/signals');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to create signal');
      }
    } catch (error) {
      console.error('Error creating signal:', error);
      toast.error('Failed to create signal');
    } finally {
      setLoading(false);
    }
  };

  const filteredTokens = tokens.filter(token =>
    token.symbol.toLowerCase().includes(tokenSearch.toLowerCase()) ||
    token.name.toLowerCase().includes(tokenSearch.toLowerCase())
  );

  const selectedToken = tokens.find(token => token._id === formData.tokenId);

  return (
    <form className="space-y-8">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Basic Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Signal Name *</Label>
            <Input
              id="name"
              placeholder="e.g., BTC Breakout Above $45K"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="token">Token *</Label>
            <div className="space-y-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search tokens..."
                  value={tokenSearch}
                  onChange={(e) => setTokenSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {tokenSearch && (
                <div className="border rounded-md max-h-48 overflow-y-auto">
                  {filteredTokens.slice(0, 10).map((token) => (
                    <div
                      key={token._id}
                      className="flex items-center space-x-3 p-3 hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        handleInputChange('tokenId', token._id);
                        setTokenSearch('');
                      }}
                    >
                      {token.logoURL && (
                        <div className="relative w-6 h-6">
                          <Image
                            src={token.logoURL}
                            alt={token.symbol}
                            width={24}
                            height={24}
                            className="rounded-full object-cover"
                            unoptimized={true}
                          />
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{token.symbol}</p>
                        <p className="text-sm text-gray-500">{token.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedToken && (
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-md">
                  {selectedToken.logoURL && (
                    <div className="relative w-6 h-6">
                      <Image
                        src={selectedToken.logoURL}
                        alt={selectedToken.symbol}
                        width={24}
                        height={24}
                        className="rounded-full object-cover"
                        unoptimized={true}
                      />
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{selectedToken.symbol}</p>
                    <p className="text-sm text-gray-500">{selectedToken.name}</p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleInputChange('tokenId', '')}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Direction *</Label>
              <Select value={formData.direction} onValueChange={(value) => handleInputChange('direction', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DIRECTION_OPTIONS.map((option) => {
                    const Icon = option.icon;
                    return (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center space-x-2">
                          <Icon className={`h-4 w-4 ${option.color}`} />
                          <span>{option.label}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Signal Type</Label>
              <Select value={formData.signalType} onValueChange={(value) => handleInputChange('signalType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select signal type" />
                </SelectTrigger>
                <SelectContent>
                  {SIGNAL_TYPES.map((type) => (
                    <SelectItem key={type} value={type.toLowerCase().replace(' ', '_')}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Price Levels */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Price Levels</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="entryPrice">Entry Price (USD) *</Label>
              <Input
                id="entryPrice"
                type="number"
                step="0.00000001"
                placeholder="0.00"
                value={formData.entryPrice}
                onChange={(e) => handleInputChange('entryPrice', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stopLoss">Stop Loss (USD)</Label>
              <Input
                id="stopLoss"
                type="number"
                step="0.00000001"
                placeholder="0.00"
                value={formData.stopLoss}
                onChange={(e) => handleInputChange('stopLoss', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Target Prices (USD) *</Label>
              <Button type="button" variant="outline" size="sm" onClick={addTargetPrice}>
                <Plus className="h-4 w-4 mr-2" />
                Add Target
              </Button>
            </div>
            <div className="space-y-2">
              {formData.targetPrices.map((price, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    type="number"
                    step="0.00000001"
                    placeholder={`Target ${index + 1}`}
                    value={price}
                    onChange={(e) => updateTargetPrice(index, e.target.value)}
                  />
                  {formData.targetPrices.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTargetPrice(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Signal Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Signal Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label>Timeframe</Label>
              <Select value={formData.timeframe} onValueChange={(value) => handleInputChange('timeframe', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIMEFRAMES.map((timeframe) => (
                    <SelectItem key={timeframe.value} value={timeframe.value}>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>{timeframe.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Risk Level</Label>
              <Select value={formData.riskLevel} onValueChange={(value) => handleInputChange('riskLevel', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RISK_LEVELS.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      <div className="flex items-center space-x-2">
                        <Shield className="h-4 w-4" />
                        <span>{level.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confidence">Confidence (1-10)</Label>
              <Input
                id="confidence"
                type="number"
                min="1"
                max="10"
                step="0.1"
                placeholder="e.g., 8.5"
                value={formData.confidence}
                onChange={(e) => handleInputChange('confidence', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Access Level</Label>
              <Select value={formData.accessLevel} onValueChange={(value) => handleInputChange('accessLevel', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ACCESS_LEVELS.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="featured"
              checked={formData.featured}
              onCheckedChange={(checked) => handleInputChange('featured', checked)}
            />
            <Label htmlFor="featured">Featured Signal</Label>
          </div>
        </CardContent>
      </Card>

      {/* Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Analysis & Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="notes">Technical Analysis</Label>
            <Textarea
              id="notes"
              placeholder="Provide detailed technical and fundamental analysis for this signal..."
              rows={6}
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex items-center justify-between pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/admin/signals')}
        >
          Cancel
        </Button>

        <div className="flex items-center space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={(e) => handleSubmit(e, true)}
            disabled={loading}
          >
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>

          <Button
            type="submit"
            onClick={(e) => handleSubmit(e, false)}
            disabled={loading}
          >
            <Eye className="h-4 w-4 mr-2" />
            Publish Signal
          </Button>
        </div>
      </div>
    </form>
  );
}
