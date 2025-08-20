export function formatDollar(value: number, decimals: number = 2): string {
    if (value === 0) return '$0.00';
    if (!value) return 'N/A';
    
    if (value < 0.01 && value > 0) {
      return `$${value.toExponential(2)}`;
    }
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: value < 1 ? 6 : 2,
    }).format(value);
  }
  
  export function formatPercent(value: number, decimals: number = 2): string {
    if (value === 0) return '0%';
    if (!value) return 'N/A';
    
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 0,
      maximumFractionDigits: decimals,
    }).format(value / 100);
  }