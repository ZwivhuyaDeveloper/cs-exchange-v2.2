import { Input } from "@/components/ui/input";
import { TokenUSDValue } from "./TokenUSDValue";
import { ChangeEvent, useState, useEffect, useCallback } from "react";
import { AlertCircle, CheckCircle } from "lucide-react";
import { ErrorBoundary } from "./ErrorBoundary";

interface TokenInputSectionProps {
  label: "sell" | "buy";
  token: string;
  amount: string;
  chainId: number;
  onTokenChange: (token: string) => void;
  onAmountChange: (amount: string) => void;
  disabled?: boolean;
  tokens?: any[];
  tokenMap?: Record<string, any>;
  excludedToken?: string;
  maxAmount?: string;
  balance?: string;
  validationError?: string | null;
  isValidAmount?: boolean;
}

// Core TokenInputSection component without error boundary for internal use
const TokenInputSectionCore = ({
  label,
  token,
  amount,
  chainId,
  onAmountChange,
  disabled = false,
  tokens,
  tokenMap,
  excludedToken,
  maxAmount,
  balance,
  validationError: externalValidationError,
  isValidAmount: externalIsValidAmount,
}: TokenInputSectionProps) => {
  const [validationError, setValidationError] = useState<string | null>(
    externalValidationError || null
  );
  const [isValid, setIsValid] = useState<boolean>(externalIsValidAmount ?? true);
  const [formattedAmount, setFormattedAmount] = useState<string>(amount);

  // Sync external validation state with internal state
  useEffect(() => {
    if (externalValidationError !== undefined) {
      setValidationError(externalValidationError);
    }
    if (externalIsValidAmount !== undefined) {
      setIsValid(externalIsValidAmount);
    }
  }, [externalValidationError, externalIsValidAmount]);

  const tokenInfo = tokenMap && token ? tokenMap[token.toLowerCase()] : null;
  const tokenDecimals = tokenInfo?.decimals || 18;

  // Enhanced validation function
  const validateAmount = (value: string): { isValid: boolean; error: string | null } => {
    // If external validation is provided, use it
    if (externalValidationError !== undefined || externalIsValidAmount !== undefined) {
      return {
        isValid: externalIsValidAmount ?? true,
        error: externalValidationError || null,
      };
    }

    // If empty or just a decimal point, consider it valid but don't process further
    if (!value || value === ".") {
      return { isValid: true, error: null };
    }

    // Check for invalid characters (only numbers and one decimal point allowed)
    if (!/^\d*\.?\d*$/.test(value)) {
      return {
        isValid: false,
        error: "Please enter a valid number",
      };
    }

    // Check for multiple decimal points
    if ((value.match(/\./g) || []).length > 1) {
      return {
        isValid: false,
        error: "Only one decimal point is allowed",
      };
    }

    // If just a single zero, that's fine
    if (value === "0" || value === "0.") {
      return { isValid: true, error: null };
    }

    // Try to parse the number
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      return {
        isValid: false,
        error: "Please enter a valid number",
      };
    }

    // Check for negative values (should be caught by regex but just in case)
    if (numValue < 0) {
      return {
        isValid: false,
        error: "Amount cannot be negative",
      };
    }

    // Check for zero values after decimal (e.g., "0.000")
    if (numValue === 0) {
      return {
        isValid: false,
        error: "Amount must be greater than 0",
      };
    }

    // Check against balance if provided
    if (balance && parseFloat(balance) > 0) {
      if (numValue > parseFloat(balance)) {
        return {
          isValid: false,
          error: `Insufficient ${token.toUpperCase()} balance`,
        };
      }
    }

    // Check against max amount if provided
    if (maxAmount && parseFloat(maxAmount) > 0) {
      if (numValue > parseFloat(maxAmount)) {
        return {
          isValid: false,
          error: `Amount exceeds maximum limit`,
        };
      }
    }

    // Check for very small amounts (dust)
    const minAmount = 1 / Math.pow(10, tokenDecimals - 2);
    if (numValue < minAmount) {
      return {
        isValid: false,
        error: `Amount too small (min: ${minAmount.toFixed(tokenDecimals)} ${token.toUpperCase()})`,
      };
    }

    return { isValid: true, error: null };
  };

  // Enhanced decimal sanitization
  const sanitizeDecimalPlaces = (value: string, decimals: number): string => {
    if (!value) return value;
    
    // Remove leading zeros except for "0."
    value = value.replace(/^0+(?=\d)/, '');
    
    const [integerPart, decimalPart] = value.split('.');
    if (!decimalPart) return value;
    
    // Limit decimal places
    const limitedDecimals = decimalPart.slice(0, decimals);
    return `${integerPart}.${limitedDecimals}`;
  };

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;
    
    // Allow empty input or single decimal point
    if (inputValue === '' || inputValue === '.') {
      setFormattedAmount(inputValue);
      onAmountChange(inputValue);
      setValidationError(null);
      setIsValid(false); // Not valid for submission but valid for display
      return;
    }
    
    // Remove any commas for processing
    inputValue = inputValue.replace(/,/g, '');
    
    // Check if the input is a valid number format
    if (!/^\d*\.?\d*$/.test(inputValue)) {
      // If not a valid number format, don't update the value but show error
      setValidationError('Please enter a valid number');
      setIsValid(false);
      return;
    }
    
    // Sanitize decimal places
    const sanitizedValue = sanitizeDecimalPlaces(inputValue, tokenDecimals);
    
    // Validate the amount
    const validation = validateAmount(sanitizedValue);
    setValidationError(validation.error);
    setIsValid(validation.isValid);
    
    // Update formatted amount for display
    setFormattedAmount(sanitizedValue);
    
    // Only pass valid numeric values to parent
    if (validation.isValid || sanitizedValue === '' || sanitizedValue === '.') {
      onAmountChange(sanitizedValue);
    }
  };

  // Update formatted amount when amount prop changes
  useEffect(() => {
    setFormattedAmount(amount);
    if (amount) {
      const validation = validateAmount(amount);
      setValidationError(validation.error);
      setIsValid(validation.isValid);
    }
  }, [amount, balance, maxAmount]);

  // Format number with commas for better readability
  const formatDisplayAmount = useCallback((value: string): string => {
    if (!value || value === '.' || value === '0.') return value;
    if (value === '0') return value;
    
    // Don't format if it's not a valid number yet (e.g., partial input like "0.")
    if (!/^\d*\.?\d*$/.test(value)) return value;
    
    // For numbers with decimal points, format the integer part
    if (value.includes('.')) {
      const [intPart, decimalPart] = value.split('.');
      const num = parseInt(intPart, 10);
      if (isNaN(num)) return value;
      const formattedInt = num.toLocaleString('en-US');
      return `${formattedInt}.${decimalPart || ''}`;
    }
    
    // For whole numbers
    const num = parseInt(value, 10);
    return isNaN(num) ? value : num.toLocaleString('en-US');
  }, []);

  // Memoize the formatted amount to prevent unnecessary re-renders
  const displayAmount = formatDisplayAmount(formattedAmount);

  return (
    <section className="items-start justify-center w-full h-fit shadow=none" data-testid="token-input-section">
      <div className="w-full flex flex-col gap-1">
        <div className="w-full flex flex-row items-center justify-between h-fit">
          <div className="flex-1">
            <Input
              id={`${label}-amount`}
              value={displayAmount}
              className={`h-11 sm:h-11 md:h-11 lg-h-11 w-full text-3xl md:text-2xl lg:text-3xl bg-transparent shadow-none border-transparent font-semibold focus:outline-none active:outline-none active:bg-transparent focus:bg-transparent transition-colors ${
                !isValid && validationError ? 'text-red-500' : ''
              }`}
              onKeyPress={(e) => {
                // Only allow numbers and decimal point
                if (!/[0-9.]/.test(e.key)) {
                  e.preventDefault();
                }
                // Only allow one decimal point
                if (e.key === '.' && e.currentTarget.value.includes('.')) {
                  e.preventDefault();
                }
              }}
              type="text"
              inputMode="decimal"
              placeholder="0.0"
              onChange={handleAmountChange}
              disabled={disabled}
              style={{ 
                width: "100%",
                backgroundColor: "transparent",
              }}
              readOnly={label === "buy"}
            />
          </div>

          <div className="flex items-center gap-2">
            <TokenUSDValue 
              amount={formattedAmount}
              tokenSymbol={token}
              chainId={chainId}
            />
            
            {/* Validation Icon */}
            {formattedAmount && (
              <div className="flex-shrink-0">
                {isValid ? (
                  <CheckCircle className="h-3 w-3 text-green-500" />
                ) : (
                  <AlertCircle className="h-3 w-3 text-red-500" />
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Validation Error Message */}
        {validationError && !isValid && (
          <div className="flex items-center gap-1 px-1">
            <AlertCircle className="h-3 w-3 text-red-500 flex-shrink-0" />
            <span className="text-xs text-red-500 font-medium">{validationError}</span>
          </div>
        )}
      </div>
    </section>
  );
};

// Export the component wrapped with ErrorBoundary
const TokenInputSection = (props: TokenInputSectionProps) => (
  <ErrorBoundary
    fallback={
      <div className="p-2 bg-red-50 dark:bg-red-900/10 rounded-md border border-red-200 dark:border-red-800">
        <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>Input error. Please try again.</span>
        </div>
      </div>
    }
  >
    <TokenInputSectionCore {...props} />
  </ErrorBoundary>
);

export { TokenInputSection };
