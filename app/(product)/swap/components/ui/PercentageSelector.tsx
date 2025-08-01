import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PercentageSelectorProps {
  balance: string | undefined;
  decimals: number;
  onSelect: (amount: string) => void;
  className?: string;
}

export function PercentageSelector({
  balance,
  decimals,
  onSelect,
  className,
}: PercentageSelectorProps) {
  const percentages = [25, 50, 75, 100] as const;

  const calculateAmount = (percentage: number) => {
    if (!balance) return '0';
    try {
      const numericBalance = parseFloat(balance);
      if (isNaN(numericBalance)) return '0';
      
      const amount = (numericBalance * percentage) / 100;
      // Format to avoid floating point precision issues
      return amount.toFixed(decimals);
    } catch (error) {
      console.error('Error calculating amount:', error);
      return '0';
    }
  };

  return (
    <div className={cn("flex gap-2 w-full overflow-x-auto pb-2 hide-scrollbar ", className)}>
      {percentages.map((percentage) => (
        <Button
          key={percentage}
          type="button"
          variant="outline"
          size="sm"
          className={cn(
            "flex-none h-10 w-16 text-sm font-medium rounded-lg",
            "active:scale-95 transition-transform", // Touch feedback
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2", // Better focus
            "md:h-9 md:w-14 md:text-xs" // Desktop sizes
          )}
          onClick={() => onSelect(calculateAmount(percentage))}
        >
          {percentage}%
        </Button>
      ))}
    </div>
  );
}
