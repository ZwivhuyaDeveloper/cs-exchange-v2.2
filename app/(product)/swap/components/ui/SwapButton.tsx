// components/SwapButton.tsx
"use client";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion"; // Import Framer Motion

type SwapButtonProps = {
  sellToken: string;
  buyToken: string;
  sellAmount: string;
  buyAmount: string;
  chainId: number;
  setSellToken: (token: string) => void;
  setBuyToken: (token: string) => void;
  setSellAmount: (amount: string) => void;
  setBuyAmount: (amount: string) => void;
  tokenMap: {
    [key: string]: {
      decimals: number;
      address: string;
      logo: string;
      symbol: string;
    };
  };
};

// Create a motion-wrapped version of the icon
const MotionArrow = motion(ArrowUpDown);

export const SwapButton = ({
  sellToken,
  buyToken,
  sellAmount,
  buyAmount,
  chainId,
  setSellToken,
  setBuyToken,
  setSellAmount,
  setBuyAmount,
  tokenMap
}: SwapButtonProps) => {
  const [isRotated, setIsRotated] = useState(false);

  const sanitizeDecimalPlaces = (value: string, decimals: number): string => {
    const [integerPart, decimalPart] = value.split('.');
    if (!decimalPart) return value;
    return `${integerPart}.${decimalPart.slice(0, decimals)}`;
  };

  const handleSwapTokens = () => {
    const newSellToken = buyToken;
    const newBuyToken = sellToken;
    const newSellDecimals = tokenMap?.[newSellToken]?.decimals || 18;
    const newBuyDecimals = tokenMap?.[newBuyToken]?.decimals || 18;
    const sanitizedSell = sanitizeDecimalPlaces(buyAmount, newSellDecimals);
    const sanitizedBuy = sanitizeDecimalPlaces(sellAmount, newBuyDecimals);
    setSellToken(newSellToken);
    setBuyToken(newBuyToken);
    setSellAmount(sanitizedSell);
    setBuyAmount(sanitizedBuy);
    setIsRotated(!isRotated);
  };

  return (
    <div className="relative mt-4 mb-2">
      <Button
        variant="outline"
        size="icon"
        className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 top-1/2 rounded-full  w-15 h-15 shadow-lg bg-[#0E76FD] dark:bg-[#00FFC2] dark:hover:bg-[#00FFC2]/80 hover:bg-[#0E76FD]/90 items-center justify-center flex hover:border-[#0E76FD]/80 hover:shadow-[#0E76FD]"
        onClick={handleSwapTokens}
      >
        <MotionArrow
          className="h-10 w-10 text-white font-bold dark:text-black hover:text-[#00FFC2]"
          animate={{ rotate: isRotated ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        />
      </Button>
    </div>
  );
};