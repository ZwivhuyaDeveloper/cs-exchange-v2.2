// Transaction timeout configuration and utilities for swap interface

export interface TimeoutConfig {
  priceRequest: number;
  quoteRequest: number;
  transactionConfirmation: number;
  approvalTransaction: number;
  swapTransaction: number;
}

// Reasonable timeout durations for different swap operations (in milliseconds)
export const SWAP_TIMEOUTS: TimeoutConfig = {
  priceRequest: 10000,        // 10 seconds for price API calls
  quoteRequest: 15000,        // 15 seconds for quote API calls
  transactionConfirmation: 300000, // 5 minutes for transaction confirmation
  approvalTransaction: 180000,     // 3 minutes for approval transactions
  swapTransaction: 300000,         // 5 minutes for swap transactions
};

export interface TimeoutError extends Error {
  name: 'TimeoutError';
  operation: string;
  duration: number;
  isRetryable: boolean;
}

export class SwapTimeoutError extends Error implements TimeoutError {
  name: 'TimeoutError' as const;
  operation: string;
  duration: number;
  isRetryable: boolean;

  constructor(operation: string, duration: number, isRetryable: boolean = true) {
    super(`Operation "${operation}" timed out after ${duration}ms`);
    this.name = 'TimeoutError';
    this.operation = operation;
    this.duration = duration;
    this.isRetryable = isRetryable;
  }
}

export interface TimeoutOptions {
  signal?: AbortSignal;
  onTimeout?: (operation: string, duration: number) => void;
  retryable?: boolean;
}

/**
 * Creates a timeout promise that rejects after the specified duration
 */
export function createTimeoutPromise(
  operation: string,
  duration: number,
  options: TimeoutOptions = {}
): Promise<never> {
  return new Promise((_, reject) => {
    const timeoutId = setTimeout(() => {
      options.onTimeout?.(operation, duration);
      reject(new SwapTimeoutError(operation, duration, options.retryable));
    }, duration);

    // Cancel timeout if abort signal is triggered
    options.signal?.addEventListener('abort', () => {
      clearTimeout(timeoutId);
    });
  });
}

/**
 * Wraps a promise with a timeout, racing between the original promise and timeout
 */
export async function withTimeout<T>(
  promise: Promise<T>,
  operation: string,
  duration: number,
  options: TimeoutOptions = {}
): Promise<T> {
  const timeoutPromise = createTimeoutPromise(operation, duration, options);
  
  try {
    return await Promise.race([promise, timeoutPromise]);
  } catch (error) {
    // If it's our timeout error, enhance it with context
    if (error instanceof SwapTimeoutError) {
      throw error;
    }
    // Re-throw other errors as-is
    throw error;
  }
}

/**
 * Creates a retry function with exponential backoff and timeout handling
 */
export function createRetryWithTimeout<T>(
  operation: () => Promise<T>,
  operationName: string,
  maxRetries: number = 3,
  baseDelay: number = 1000,
  timeoutDuration?: number
) {
  return async function retryOperation(
    signal?: AbortSignal,
    onRetry?: (attempt: number, error: Error) => void
  ): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const operationPromise = operation();
        
        if (timeoutDuration) {
          return await withTimeout(
            operationPromise,
            operationName,
            timeoutDuration,
            { signal, retryable: attempt < maxRetries }
          );
        }
        
        return await operationPromise;
      } catch (error) {
        lastError = error as Error;
        
        // Don't retry if operation was aborted
        if (signal?.aborted) {
          throw new Error(`Operation "${operationName}" was cancelled`);
        }
        
        // Don't retry non-retryable timeout errors
        if (error instanceof SwapTimeoutError && !error.isRetryable) {
          throw error;
        }
        
        // Don't retry on the last attempt
        if (attempt === maxRetries) {
          break;
        }
        
        // Call retry callback
        onRetry?.(attempt, error as Error);
        
        // Exponential backoff delay
        const delay = baseDelay * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError!;
  };
}

/**
 * Utility to check if an error is a timeout error
 */
export function isTimeoutError(error: unknown): error is SwapTimeoutError {
  return error instanceof SwapTimeoutError || 
         (error instanceof Error && error.name === 'TimeoutError');
}

/**
 * Formats timeout duration for user display
 */
export function formatTimeoutDuration(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  
  if (minutes > 0) {
    const remainingSeconds = seconds % 60;
    return remainingSeconds > 0 
      ? `${minutes}m ${remainingSeconds}s`
      : `${minutes}m`;
  }
  
  return `${seconds}s`;
}

/**
 * Gets user-friendly timeout messages for different operations
 */
export function getTimeoutMessage(operation: string, duration: number): {
  title: string;
  message: string;
  suggestion: string;
} {
  const formattedDuration = formatTimeoutDuration(duration);
  
  switch (operation) {
    case 'priceRequest':
      return {
        title: 'Price Request Timeout',
        message: `Unable to fetch price data within ${formattedDuration}`,
        suggestion: 'Check your internet connection and try again'
      };
    
    case 'quoteRequest':
      return {
        title: 'Quote Request Timeout',
        message: `Unable to fetch quote data within ${formattedDuration}`,
        suggestion: 'The network may be congested. Please try again'
      };
    
    case 'transactionConfirmation':
      return {
        title: 'Transaction Confirmation Timeout',
        message: `Transaction is taking longer than expected (${formattedDuration})`,
        suggestion: 'Your transaction may still be processing. Check your wallet or block explorer'
      };
    
    case 'approvalTransaction':
      return {
        title: 'Approval Transaction Timeout',
        message: `Token approval is taking longer than expected (${formattedDuration})`,
        suggestion: 'Check your wallet for the approval transaction status'
      };
    
    case 'swapTransaction':
      return {
        title: 'Swap Transaction Timeout',
        message: `Swap transaction is taking longer than expected (${formattedDuration})`,
        suggestion: 'Your swap may still be processing. Check your wallet or block explorer'
      };
    
    default:
      return {
        title: 'Operation Timeout',
        message: `Operation timed out after ${formattedDuration}`,
        suggestion: 'Please try again or contact support if the issue persists'
      };
  }
}
