import { Input } from "@/components/ui/input";
import { TokenPicker } from "./tokenPicker";
import { TokenUSDValue } from "./TokenUSDValue";
import { ChangeEvent, useState } from "react";
import { MAINNET_TOKENS_BY_SYMBOL } from "@/src/constants";


interface TokenInputSectionProps {
  label: "sell" | "buy"
  token: string;
  amount: string;
  chainId: number;
  onTokenChange: (token: string) => void
  onAmountChange: (amount: string) => void;
  disabled?: boolean;
}



export const TokenInputSection = ({
  label,
  token,
  amount,
  chainId,
  onTokenChange,
  onAmountChange,
  disabled = false
}: TokenInputSectionProps) => {

  const [fromToken, setFromToken] = useState("")
  const [toToken, setToToken] = useState("")
  const [tradeDirection, setTradeDirection] = useState("sell");
  const [sellAmount, setSellAmount] = useState("");


  
  const tokenInfo = token ? MAINNET_TOKENS_BY_SYMBOL[token.toLowerCase()] : null;
  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const sanitizeDecimalPlaces = (value: string, decimals: number): string => {
      const [integerPart, decimalPart] = value.split('.');
      if (!decimalPart) return value;
      return `${integerPart}.${decimalPart.slice(0, decimals)}`;
    };

    // Get the token's decimal places from constants
    const tokenDecimals = tokenInfo?.decimals || 18; // Default to 18 if not found
    
    // Sanitize the input value based on token decimals
    const sanitizedValue = sanitizeDecimalPlaces(e.target.value, tokenDecimals);
    
    // Pass the sanitized value to the parent component
    onAmountChange(sanitizedValue);
  };

  return (
    <section className="items-start justify-center w-full h-fit shadow=none">

      <div className="w-full flex flex-row items-center justify-between h-fit ">
        <Input
          id={`${label}-amount`}
          value={amount}
          className="h-11 sm:h-11 md:h-11 lg-h-11 sm:text-xl md:text-2xl lg:text-3xl bg-transparent shadow-none  border-transparent text-4xl font-semibold focus:outline-none active:outline-none active:bg-transparent focus:bg-transparent"
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

        <TokenUSDValue 
          amount={amount}
          tokenSymbol={token}
          chainId={chainId}
        />
      </div>
    </section>
  );
};
