"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Info } from "lucide-react";

interface SlippageToleranceProps {
  value: number; // Current slippage value as percentage (e.g., 0.5 for 0.5%)
  onChange: (slippage: number) => void;
  className?: string;
}

export const SlippageTolerance: React.FC<SlippageToleranceProps> = ({
  value,
  onChange,
  className = "",
}) => {
  const [customValue, setCustomValue] = useState<string>("");
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Predefined slippage options
  const presetOptions = [0.1, 0.5, 1.0];

  useEffect(() => {
    // Check if current value is one of the presets
    const isPreset = presetOptions.includes(value);
    setIsCustom(!isPreset);
    if (!isPreset) {
      setCustomValue(value.toString());
    }
  }, [value]);

  const validateSlippage = (slippageValue: number): string | null => {
    if (slippageValue < 0) {
      return "Slippage cannot be negative";
    }
    if (slippageValue > 50) {
      return "Slippage cannot exceed 50%";
    }
    if (slippageValue > 5) {
      return "High slippage warning: Your transaction may be frontrun";
    }
    if (slippageValue < 0.05) {
      return "Very low slippage: Your transaction may fail";
    }
    return null;
  };

  const handlePresetClick = (preset: number) => {
    setIsCustom(false);
    setCustomValue("");
    setValidationError(null);
    onChange(preset);
  };

  const handleCustomValueChange = (inputValue: string) => {
    setCustomValue(inputValue);
    
    // Validate input format
    if (!/^\d*\.?\d*$/.test(inputValue)) {
      setValidationError("Invalid number format");
      return;
    }

    const numValue = parseFloat(inputValue);
    if (isNaN(numValue)) {
      setValidationError("Please enter a valid number");
      return;
    }

    const error = validateSlippage(numValue);
    setValidationError(error);
    
    // Only update parent if valid
    if (!error || error.includes("warning") || error.includes("may fail")) {
      onChange(numValue);
    }
  };

  const handleCustomToggle = () => {
    setIsCustom(true);
    setCustomValue(value.toString());
  };

  const getSlippageImpact = (slippageValue: number) => {
    if (slippageValue <= 0.1) return { level: "low", color: "text-green-600" };
    if (slippageValue <= 1) return { level: "medium", color: "text-yellow-600" };
    if (slippageValue <= 3) return { level: "high", color: "text-orange-600" };
    return { level: "very-high", color: "text-red-600" };
  };

  const impact = getSlippageImpact(value);

  return (
    <Card className={`w-full dark:bg-zinc-900 bg-zinc-100 border-none ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Info className="h-4 w-4" />
          Slippage Tolerance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Preset Options */}
        <div className="flex gap-2">
          {presetOptions.map((preset) => (
            <Button
              key={preset}
              variant={!isCustom && value === preset ? "default" : "outline"}
              size="sm"
              onClick={() => handlePresetClick(preset)}
              className="flex-1"
            >
              {preset}%
            </Button>
          ))}
          <Button
            variant={"default"}
            size="sm"
            onClick={handleCustomToggle}
            className="flex-1  bg-[#00FFC2]"
          >
            Custom
          </Button>
        </div>

        {/* Custom Input */}
        {isCustom && (
          <div className="space-y-2">
            <Label htmlFor="custom-slippage" className="text-xs">
              Custom Slippage (%)
            </Label>
            <div className="relative">
              <Input
                id="custom-slippage"
                type="text"
                value={customValue}
                onChange={(e) => handleCustomValueChange(e.target.value)}
                placeholder="Enter custom slippage"
                className={`pr-8 ${validationError && !validationError.includes("warning") ? "border-red-500" : ""}`}
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                %
              </span>
            </div>
            {validationError && (
              <div className={`flex items-center gap-1 text-xs ${
                validationError.includes("warning") || validationError.includes("may fail") 
                  ? "text-yellow-600" 
                  : "text-red-600"
              }`}>
                <AlertTriangle className="h-3 w-3" />
                {validationError}
              </div>
            )}
          </div>
        )}

        {/* Slippage Impact Display */}
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-400">Impact Level:</span>
          <span className={`font-medium ${impact.color} capitalize`}>
            {impact.level.replace("-", " ")}
          </span>
        </div>

        {/* Information */}
        <div className="text-xs text-gray-500 space-y-1">
          <p>
            Slippage tolerance is the maximum price movement you're willing to accept.
          </p>
          <p>
            Current setting: <span className="font-medium">{value}%</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SlippageTolerance;
