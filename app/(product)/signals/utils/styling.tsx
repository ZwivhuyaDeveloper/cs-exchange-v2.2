import { ArrowDown, ArrowUp } from 'lucide-react';

export const getDirectionClasses = (direction: string) => {
    switch (direction?.toLowerCase()) {
      case 'buy':
      case 'long':
        return {
          bg: 'bg-green-100 dark:bg-green-900/30',
          text: 'text-green-600 dark:text-green-400',
          border: 'border-green-200 dark:border-green-500/30',
          icon: <ArrowUp className="h-4 w-4 text-green-500" />,
        };
      case 'sell':
      case 'short':
        return {
          bg: 'bg-red-100 dark:bg-red-900/30',
          text: 'text-red-600 dark:text-red-400',
          border: 'border-red-200 dark:border-red-500/30',
          icon: <ArrowDown className="h-4 w-4 text-red-500" />,
        };
      default:
        return {
          bg: 'bg-gray-100 dark:bg-gray-800',
          text: 'text-gray-600 dark:text-gray-400',
          border: 'border-gray-200 dark:border-gray-700',
          icon: null,
        };
    }
  };
  
  export const getStatusClasses = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return {
            bg: 'bg-blue-100 dark:bg-blue-900/30',
            text: 'text-blue-600 dark:text-blue-400',
            border: 'border-blue-200 dark:border-blue-500/30',
        };
      case 'target_hit':
        return {
            bg: 'bg-green-100 dark:bg-green-900/30',
            text: 'text-green-600 dark:text-green-400',
            border: 'border-green-200 dark:border-green-500/30',
        };
      case 'stop_loss':
      case 'canceled':
      case 'expired':
        return {
            bg: 'bg-red-100 dark:bg-red-900/30',
            text: 'text-red-600 dark:text-red-400',
            border: 'border-red-200 dark:border-red-500/30',
        };
      case 'filled':
      case 'completed':
        return {
            bg: 'bg-purple-100 dark:bg-purple-900/30',
            text: 'text-purple-600 dark:text-purple-400',
            border: 'border-purple-200 dark:border-purple-500/30',
        };
      default:
        return {
            bg: 'bg-gray-100 dark:bg-gray-800',
            text: 'text-gray-600 dark:text-gray-400',
            border: 'border-gray-200 dark:border-gray-700',
        };
    }
  }

  export const getRiskColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'very_low':
        return 'text-teal-500';
      case 'low':
        return 'text-green-500';
      case 'medium':
        return 'text-yellow-500';
      case 'high':
        return 'text-orange-500';
      case 'very_high':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };
  
  export const formatRiskLevel = (level: string) => {
    if (!level) return 'N/A';
    return level
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
