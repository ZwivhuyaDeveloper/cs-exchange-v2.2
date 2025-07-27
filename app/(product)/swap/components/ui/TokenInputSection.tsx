import { Input } from "@/components/ui/input";
import { TokenUSDValue } from "./TokenUSDValue";
import { ChangeEvent, useState, useEffect } from "react";
import { AlertCircle, CheckCircle } from "lucide-react";

interface TokenInputSectionProps {
  label: "sell" | "buy"
  token: string;
  amount: string;
  chainId: number;
  onTokenChange: (token: string) => void
  onAmountChange: (amount: string) => void;
  disabled?: boolean;
  tokens?: any[]; // Accept dynamic tokens
  tokenMap?: Record<string, any>; // Accept dynamic token map
  excludedToken?: string; // Add excludedToken prop
  maxAmount?: string; // Maximum allowed amount
  balance?: string; // User's token balance
  validationError?: string | null;
  isValidAmount?: boolean;
}

export const TokenInputSection = ({
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
  const [validationError, setValidationError] = useState<string | null>(externalValidationError || null);
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
    // If external validation is provided, use it instead of internal validation
    if (externalValidationError !== undefined || externalIsValidAmount !== undefined) {
      return {
        isValid: externalIsValidAmount ?? true,
        error: externalValidationError || null
      };
    }

    // Fall back to internal validation when external validation is not provided
    if (!value || value === "0" || value === "0.") {
      return { isValid: true, error: null };
    }

    // Check for invalid characters
    if (!/^\d*\.?\d*$/.test(value)) {
      return { isValid: false, error: "Invalid characters in amount" };
    }

    // Check for multiple decimal points
    if ((value.match(/\./g) || []).length > 1) {
      return { isValid: false, error: "Invalid decimal format" };
    }

    const numValue = parseFloat(value);
    
    // Check for negative values
    if (numValue < 0) {
      return { isValid: false, error: "Amount cannot be negative" };
    }

    // Check for zero values
    if (numValue === 0) {
      return { isValid: false, error: "Amount must be greater than 0" };
    }

    // Check against balance if provided
    if (balance && parseFloat(balance) > 0) {
      if (numValue > parseFloat(balance)) {
        return { isValid: false, error: `Insufficient ${token.toUpperCase()} balance` };
      }
    }

    // Check against max amount if provided
    if (maxAmount && parseFloat(maxAmount) > 0) {
      if (numValue > parseFloat(maxAmount)) {
        return { isValid: false, error: `Amount exceeds maximum limit` };
      }
    }

    // Check for very small amounts (dust)
    const minAmount = 1 / Math.pow(10, tokenDecimals - 2); // Allow 2 decimals less than token decimals
    if (numValue < minAmount) {
      return { isValid: false, error: `Amount too small (min: ${minAmount})` };
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

  // Format number with commas for better readability
  const formatDisplayAmount = (value: string): string => {
    if (!value || value === "0" || value.includes('.')) return value;
    const num = parseFloat(value);
    if (isNaN(num)) return value;
    return num.toLocaleString('en-US', { maximumFractionDigits: tokenDecimals });
  };

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;
    
    // Remove commas for processing
    inputValue = inputValue.replace(/,/g, '');
    
    // Sanitize decimal places
    const sanitizedValue = sanitizeDecimalPlaces(inputValue, tokenDecimals);
    
    // Validate the amount
    const validation = validateAmount(sanitizedValue);
    setValidationError(validation.error);
    setIsValid(validation.isValid);
    
    // Update formatted amount for display
    setFormattedAmount(sanitizedValue);
    
    // Pass the sanitized value to parent component
    onAmountChange(sanitizedValue);
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

  return (
    <section className="items-start justify-center w-full h-fit shadow=none">
      <div className="w-full flex flex-col gap-1">
        <div className="w-full flex flex-row items-center justify-between h-fit">
          <div className="flex-1">
            <Input
              id={`${label}-amount`}
              value={formattedAmount}
              className={`h-11 sm:h-11 md:h-11 lg-h-11 w-full sm:text-xl md:text-2xl lg:text-3xl bg-transparent shadow-none border-transparent text-4xl font-semibold focus:outline-none active:outline-none active:bg-transparent focus:bg-transparent transition-colors ${
                !isValid && validationError ? 'text-red-500' : ''
              }`}
              type="string"
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
        
        {/* Balance Display */}
        {balance && label === "sell" && (
          <div className="flex items-center justify-between px-1">
            <span className="text-xs text-gray-500">
              Balance: {parseFloat(balance).toLocaleString()} {token.toUpperCase()}
            </span>
            {balance && parseFloat(balance) > 0 && (
              <button
                type="button"
                onClick={() => {
                  const maxUsableBalance = (parseFloat(balance) * 0.99).toString(); // Leave 1% for gas
                  setFormattedAmount(maxUsableBalance);
                  onAmountChange(maxUsableBalance);
                }}
                className="text-xs text-blue-500 hover:text-blue-700 font-medium transition-colors"
              >
                MAX
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
