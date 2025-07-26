import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PriceView from '../price';
import { useAccount, useChainId, useBalance } from 'wagmi';

// Mock the child components
jest.mock('../PriceViewUI', () => {
  return function MockPriceViewUI(props: any) {
    return (
      <div data-testid="price-view-ui">
        <div>Loading: {props.loading.toString()}</div>
        <div>API Error: {props.apiError || 'none'}</div>
        <div>Validation Error: {props.validationError || 'none'}</div>
        <div>Valid Amount: {props.isValidAmount.toString()}</div>
        <div>Slippage: {props.slippageTolerance}%</div>
        <button 
          onClick={() => props.setSellAmount('1.0')}
          data-testid="set-sell-amount"
        >
          Set Sell Amount
        </button>
        <button 
          onClick={() => props.setSlippageTolerance(1.0)}
          data-testid="set-slippage"
        >
          Set Slippage
        </button>
        {props.ApproveOrReviewButton}
      </div>
    );
  };
});

// Mock fetch for API calls
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('PriceView Integration Tests', () => {
  const mockSetPrice = jest.fn();
  const mockSetFinalize = jest.fn();
  const mockSetFromToken = jest.fn();
  const mockSetToToken = jest.fn();
  const mockSetCurrentChartToken = jest.fn();

  const defaultProps = {
    taker: '0x1234567890123456789012345678901234567890' as `0x${string}`,
    price: null,
    setPrice: mockSetPrice,
    setFinalize: mockSetFinalize,
    chainId: 1,
    fromToken: 'eth',
    setFromToken: mockSetFromToken,
    toToken: 'usdc',
    setToToken: mockSetToToken,
    setCurrentChartToken: mockSetCurrentChartToken,
    value: undefined,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockClear();
    
    // Mock successful API response
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        buyAmount: '1000000', // 1 USDC (6 decimals)
        price: '1000',
        tokenMetadata: {
          buyToken: { buyTaxBps: '0', sellTaxBps: '0' },
          sellToken: { buyTaxBps: '0', sellTaxBps: '0' },
        },
      }),
    });
  });

  it('integrates validation with price fetching', async () => {
    const user = userEvent.setup();
    render(<PriceView {...defaultProps} />);

    // Initially should show no validation error
    expect(screen.getByText('Validation Error: none')).toBeInTheDocument();
    expect(screen.getByText('Valid Amount: true')).toBeInTheDocument();

    // Trigger amount change
    const setSellAmountButton = screen.getByTestId('set-sell-amount');
    await user.click(setSellAmountButton);

    // Should trigger API call with debouncing
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
    }, { timeout: 1000 });

    // Check API call parameters
    const fetchCall = mockFetch.mock.calls[0];
    const apiUrl = fetchCall[0];
    expect(apiUrl).toContain('/api/price');
    expect(apiUrl).toContain('slippagePercentage=0.5'); // Default slippage
  });

  it('includes slippage tolerance in API calls', async () => {
    const user = userEvent.setup();
    render(<PriceView {...defaultProps} />);

    // Change slippage tolerance
    const setSlippageButton = screen.getByTestId('set-slippage');
    await user.click(setSlippageButton);

    // Trigger amount change to make API call
    const setSellAmountButton = screen.getByTestId('set-sell-amount');
    await user.click(setSellAmountButton);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
    });

    // Check that new slippage is included
    const fetchCall = mockFetch.mock.calls[0];
    const apiUrl = fetchCall[0];
    expect(apiUrl).toContain('slippagePercentage=1'); // Updated slippage
  });

  it('handles API errors gracefully', async () => {
    const user = userEvent.setup();
    
    // Mock API error
    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({ error: 'Server error' }),
    });

    render(<PriceView {...defaultProps} />);

    // Trigger API call
    const setSellAmountButton = screen.getByTestId('set-sell-amount');
    await user.click(setSellAmountButton);

    await waitFor(() => {
      expect(screen.getByText(/API Error.*Network or server error/)).toBeInTheDocument();
    });
  });

  it('handles validation errors from API', async () => {
    const user = userEvent.setup();
    
    // Mock validation error response
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        validationErrors: ['Insufficient liquidity', 'Token not supported'],
      }),
    });

    render(<PriceView {...defaultProps} />);

    // Trigger API call
    const setSellAmountButton = screen.getByTestId('set-sell-amount');
    await user.click(setSellAmountButton);

    await waitFor(() => {
      expect(screen.getByText(/API Error.*Validation error/)).toBeInTheDocument();
    });
  });

  it('debounces API calls correctly', async () => {
    const user = userEvent.setup();
    render(<PriceView {...defaultProps} />);

    // Trigger multiple rapid changes
    const setSellAmountButton = screen.getByTestId('set-sell-amount');
    await user.click(setSellAmountButton);
    await user.click(setSellAmountButton);
    await user.click(setSellAmountButton);

    // Wait for debounce period
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(1);
    }, { timeout: 1000 });
  });

  it('cancels previous requests when new ones are made', async () => {
    const user = userEvent.setup();
    
    // Mock slow API response
    let resolveFirst: (value: any) => void;
    const firstPromise = new Promise(resolve => {
      resolveFirst = resolve;
    });
    
    mockFetch
      .mockReturnValueOnce(firstPromise)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ buyAmount: '2000000' }),
      });

    render(<PriceView {...defaultProps} />);

    // Make first request
    const setSellAmountButton = screen.getByTestId('set-sell-amount');
    await user.click(setSellAmountButton);

    // Make second request before first completes
    await user.click(setSellAmountButton);

    // Resolve first request (should be ignored due to cancellation)
    resolveFirst!({
      ok: true,
      json: async () => ({ buyAmount: '1000000' }),
    });

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });
  });

  it('integrates with balance validation', async () => {
    const user = userEvent.setup();
    
    // Mock insufficient balance
    (useBalance as jest.Mock).mockReturnValue({
      data: {
        value: BigInt('500000000000000000'), // 0.5 ETH
        decimals: 18,
        formatted: '0.5',
        symbol: 'ETH',
      },
    });

    render(<PriceView {...defaultProps} />);

    // Trigger amount change that exceeds balance
    const setSellAmountButton = screen.getByTestId('set-sell-amount');
    await user.click(setSellAmountButton);

    await waitFor(() => {
      expect(screen.getByText('Valid Amount: false')).toBeInTheDocument();
    });
  });

  it('loads and uses token metadata correctly', async () => {
    const user = userEvent.setup();
    
    // Mock token metadata API
    const tokenMetadataFetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ([
        {
          symbol: 'eth',
          decimals: 18,
          address: '0x0000000000000000000000000000000000000000',
        },
        {
          symbol: 'usdc',
          decimals: 6,
          address: '0xa0b86a33e6c6b5b23d3cd24b8f8c2c8e8f8e8f8e',
        },
      ]),
    });

    mockFetch.mockImplementation((url: string) => {
      if (url.includes('/api/token-metadata')) {
        return tokenMetadataFetch();
      }
      return Promise.resolve({
        ok: true,
        json: async () => ({ buyAmount: '1000000' }),
      });
    });

    render(<PriceView {...defaultProps} />);

    await waitFor(() => {
      expect(tokenMetadataFetch).toHaveBeenCalled();
    });

    // Verify token metadata is used in price calls
    const setSellAmountButton = screen.getByTestId('set-sell-amount');
    await user.click(setSellAmountButton);

    await waitFor(() => {
      const priceCalls = mockFetch.mock.calls.filter(call => 
        call[0].includes('/api/price')
      );
      expect(priceCalls.length).toBeGreaterThan(0);
    });
  });

  it('handles network errors gracefully', async () => {
    const user = userEvent.setup();
    
    // Mock network error
    mockFetch.mockRejectedValue(new Error('Network error'));

    render(<PriceView {...defaultProps} />);

    // Trigger API call
    const setSellAmountButton = screen.getByTestId('set-sell-amount');
    await user.click(setSellAmountButton);

    await waitFor(() => {
      expect(screen.getByText(/API Error.*Network or server error/)).toBeInTheDocument();
    });
  });

  it('updates buy amount when price data is received', async () => {
    const user = userEvent.setup();
    render(<PriceView {...defaultProps} />);

    // Trigger API call
    const setSellAmountButton = screen.getByTestId('set-sell-amount');
    await user.click(setSellAmountButton);

    await waitFor(() => {
      expect(mockSetPrice).toHaveBeenCalledWith(
        expect.objectContaining({
          buyAmount: '1000000',
          price: '1000',
        })
      );
    });
  });
});
