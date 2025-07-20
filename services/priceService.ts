import { formatUnits, parseUnits } from 'ethers';
import { fetchPrice } from './0xService';
import { getTokenBySymbol } from '@/services/tokenService';

interface PriceParams {
  chainId: number;
  sellToken: string;
  buyToken: string;
  sellAmount?: string;
  buyAmount?: string;
  taker?: string;
}

export const getSwapPrice = async ({
  chainId,
  sellToken,
  buyToken,
  sellAmount,
  buyAmount,
  taker
}: PriceParams): Promise<any> => {
  try {
    // Get token details
    const sellTokenDetails = await getTokenBySymbol(chainId, sellToken);
    const buyTokenDetails = await getTokenBySymbol(chainId, buyToken);
    
    if (!sellTokenDetails || !buyTokenDetails) {
      throw new Error('Token details not found');
    }
    
    // Prepare parameters for 0x API
    const params = {
      chainId: chainId === 1 ? 1 : 137, // Map to 0x chain IDs
      sellToken: sellTokenDetails.address,
      buyToken: buyTokenDetails.address,
      sellAmount: sellAmount 
        ? parseUnits(sellAmount, sellTokenDetails.decimals).toString()
        : undefined,
      buyAmount: buyAmount 
        ? parseUnits(buyAmount, buyTokenDetails.decimals).toString()
        : undefined,
      taker,
      slippagePercentage: 0.5, // 0.5% slippage
      feeRecipient: process.env.FEE_RECIPIENT,
      buyTokenPercentageFee: 0.01 // 1% fee
    };
    
    return fetchPrice(params);
  } catch (error) {
    console.error('Error in getSwapPrice:', error);
    throw error;
  }
};

export const calculateEffectivePrice = (
  sellAmount: string,
  buyAmount: string,
  sellTokenDecimals: number,
  buyTokenDecimals: number
): string => {
  const sellValue = parseFloat(formatUnits(sellAmount, sellTokenDecimals));
  const buyValue = parseFloat(formatUnits(buyAmount, buyTokenDecimals));
  
  if (sellValue <= 0 || buyValue <= 0) return '0';
  
  return (sellValue / buyValue).toFixed(6);
};

export const calculatePriceImpact = (
  marketPrice: number,
  executionPrice: number
): string => {
  if (marketPrice <= 0 || executionPrice <= 0) return '0.00';
  
  const impact = ((executionPrice - marketPrice) / marketPrice) * 100;
  return impact.toFixed(2);
};