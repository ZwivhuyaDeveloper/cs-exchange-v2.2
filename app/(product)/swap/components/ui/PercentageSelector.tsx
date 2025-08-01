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
    <div className={cn("flex gap-1 ", className)}>
      {percentages.map((percentage) => (
        <Button
          key={percentage}
          type="button"
          variant="outline"
          size="sm"
          className="flex-1 h-8 text-xs font-medium w-fit rounded-md"
          onClick={() => onSelect(calculateAmount(percentage))}
        >
          {percentage}%
        </Button>
      ))}
    </div>
  );
}
