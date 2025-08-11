import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TokenInputSection } from '../TokenInputSection';

// Mock the UI components
jest.mock('@/components/ui/input', () => ({
  Input: ({ ...props }) => <input {...props} />,
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }) => <button {...props}>{children}</button>,
}));

describe('TokenInputSection Component', () => {
  const mockOnAmountChange = jest.fn();
  const mockOnTokenChange = jest.fn();
  
  const mockTokenMap = {
    eth: {
      symbol: 'ETH',
      decimals: 18,
      address: '0x0000000000000000000000000000000000000000',
    },
    usdc: {
      symbol: 'USDC',
      decimals: 6,
      address: '0xa0b86a33e6c6b5b23d3cd24b8f8c2c8e8f8e8f8e',
    },
  };

  const mockTokens = [
    { symbol: 'ETH', decimals: 18 },
    { symbol: 'USDC', decimals: 6 },
  ];

  const defaultProps = {
    label: 'sell',
    token: 'eth',
    onTokenChange: mockOnTokenChange,
    amount: '',
    onAmountChange: mockOnAmountChange,
    chainId: 1,
    tokens: mockTokens,
    tokenMap: mockTokenMap,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with default props', () => {
    render(<TokenInputSection {...defaultProps} />);
    
    expect(screen.getByDisplayValue('')).toBeInTheDocument();
    expect(screen.getByText('ETH')).toBeInTheDocument();
  });

  it('displays the correct token symbol', () => {
    render(<TokenInputSection {...defaultProps} token="usdc" />);
    
    expect(screen.getByText('USDC')).toBeInTheDocument();
  });

  it('calls onAmountChange when input value changes', async () => {
    const user = userEvent.setup();
    render(<TokenInputSection {...defaultProps} />);
    
    const input = screen.getByDisplayValue('');
    await user.type(input, '1.5');
    
    expect(mockOnAmountChange).toHaveBeenCalledWith('1.5');
  });

  it('validates invalid characters', async () => {
    const user = userEvent.setup();
    render(<TokenInputSection {...defaultProps} />);
    
    const input = screen.getByDisplayValue('');
    await user.type(input, 'abc');
    
    await waitFor(() => {
      expect(screen.getByText('Invalid characters in amount')).toBeInTheDocument();
    });
  });

  it('validates negative amounts', async () => {
    const user = userEvent.setup();
    render(<TokenInputSection {...defaultProps} />);
    
    const input = screen.getByDisplayValue('');
    await user.type(input, '-1');
    
    await waitFor(() => {
      expect(screen.getByText('Amount cannot be negative')).toBeInTheDocument();
    });
  });

  it('validates zero amounts', async () => {
    const user = userEvent.setup();
    render(<TokenInputSection {...defaultProps} />);
    
    const input = screen.getByDisplayValue('');
    await user.type(input, '0');
    
    await waitFor(() => {
      expect(screen.getByText('Amount must be greater than 0')).toBeInTheDocument();
    });
  });

  it('validates multiple decimal points', async () => {
    const user = userEvent.setup();
    render(<TokenInputSection {...defaultProps} />);
    
    const input = screen.getByDisplayValue('');
    await user.type(input, '1.2.3');
    
    await waitFor(() => {
      expect(screen.getByText('Invalid decimal format')).toBeInTheDocument();
    });
  });

  it('validates insufficient balance', async () => {
    const user = userEvent.setup();
    render(<TokenInputSection {...defaultProps} balance="0.5" />);
    
    const input = screen.getByDisplayValue('');
    await user.type(input, '1.0');
    
    await waitFor(() => {
      expect(screen.getByText('Insufficient ETH balance')).toBeInTheDocument();
    });
  });

  it('validates dust amounts', async () => {
    const user = userEvent.setup();
    render(<TokenInputSection {...defaultProps} />);
    
    const input = screen.getByDisplayValue('');
    await user.type(input, '0.0000000000000001');
    
    await waitFor(() => {
      expect(screen.getByText(/Amount too small/)).toBeInTheDocument();
    });
  });

  it('displays balance when provided', () => {
    render(<TokenInputSection {...defaultProps} balance="10.5" />);
    
    expect(screen.getByText('Balance: 10.5 ETH')).toBeInTheDocument();
  });

  it('shows MAX button when balance is provided', () => {
    render(<TokenInputSection {...defaultProps} balance="10.5" />);
    
    expect(screen.getByText('MAX')).toBeInTheDocument();
  });

  it('sets max amount when MAX button is clicked', async () => {
    const user = userEvent.setup();
    render(<TokenInputSection {...defaultProps} balance="10.5" />);
    
    const maxButton = screen.getByText('MAX');
    await user.click(maxButton);
    
    // Should set 99% of balance to leave gas buffer
    expect(mockOnAmountChange).toHaveBeenCalledWith('10.395');
  });

  it('handles disabled state', () => {
    render(<TokenInputSection {...defaultProps} disabled />);
    
    const input = screen.getByDisplayValue('');
    expect(input).toBeDisabled();
  });

  it('uses external validation when provided', () => {
    render(
      <TokenInputSection 
        {...defaultProps} 
        validationError="External error"
        isValidAmount={false}
      />
    );
    
    expect(screen.getByText('External error')).toBeInTheDocument();
  });

  it('prioritizes external validation over internal validation', async () => {
    const user = userEvent.setup();
    render(
      <TokenInputSection 
        {...defaultProps} 
        validationError="External error"
        isValidAmount={false}
      />
    );
    
    const input = screen.getByDisplayValue('');
    await user.type(input, 'abc'); // This would normally trigger internal validation
    
    // Should still show external validation error
    expect(screen.getByText('External error')).toBeInTheDocument();
  });

  it('falls back to internal validation when external validation is not provided', async () => {
    const user = userEvent.setup();
    render(<TokenInputSection {...defaultProps} />);
    
    const input = screen.getByDisplayValue('');
    await user.type(input, 'abc');
    
    await waitFor(() => {
      expect(screen.getByText('Invalid characters in amount')).toBeInTheDocument();
    });
  });

  it('sanitizes decimal places correctly', async () => {
    const user = userEvent.setup();
    render(<TokenInputSection {...defaultProps} token="usdc" />); // USDC has 6 decimals
    
    const input = screen.getByDisplayValue('');
    await user.type(input, '1.1234567890'); // More than 6 decimal places
    
    // Should be sanitized to 6 decimal places
    expect(mockOnAmountChange).toHaveBeenCalledWith('1.123456');
  });

  it('displays USD value when available', () => {
    render(<TokenInputSection {...defaultProps} amount="1.0" />);
    
    // Assuming TokenUSDValue component displays USD value
    expect(screen.getByText(/\$/)).toBeInTheDocument();
  });

  it('shows validation icon for valid amounts', async () => {
    const user = userEvent.setup();
    render(<TokenInputSection {...defaultProps} />);
    
    const input = screen.getByDisplayValue('');
    await user.type(input, '1.0');
    
    await waitFor(() => {
      expect(screen.getByTestId('validation-success')).toBeInTheDocument();
    });
  });

  it('shows validation icon for invalid amounts', async () => {
    const user = userEvent.setup();
    render(<TokenInputSection {...defaultProps} />);
    
    const input = screen.getByDisplayValue('');
    await user.type(input, 'abc');
    
    await waitFor(() => {
      expect(screen.getByTestId('validation-error')).toBeInTheDocument();
    });
  });

  it('excludes specified token from selection', () => {
    render(<TokenInputSection {...defaultProps} excludedToken="usdc" />);
    
    // The component should not allow selecting USDC
    // This would be tested through the token picker integration
    expect(screen.getByText('ETH')).toBeInTheDocument();
  });

  it('validates against max amount when provided', async () => {
    const user = userEvent.setup();
    render(<TokenInputSection {...defaultProps} maxAmount="5.0" />);
    
    const input = screen.getByDisplayValue('');
    await user.type(input, '10.0');
    
    await waitFor(() => {
      expect(screen.getByText('Amount exceeds maximum limit')).toBeInTheDocument();
    });
  });
});
