import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SlippageTolerance } from '../SlippageTolerance';

describe('SlippageTolerance Component', () => {
  const mockOnChange = jest.fn();
  const defaultProps = {
    value: 0.5,
    onChange: mockOnChange,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with default props', () => {
    render(<SlippageTolerance {...defaultProps} />);
    
    expect(screen.getByText('Slippage Tolerance')).toBeInTheDocument();
    expect(screen.getByText('Current setting: 0.5%')).toBeInTheDocument();
  });

  it('displays preset options correctly', () => {
    render(<SlippageTolerance {...defaultProps} />);
    
    expect(screen.getByText('0.1%')).toBeInTheDocument();
    expect(screen.getByText('0.5%')).toBeInTheDocument();
    expect(screen.getByText('1%')).toBeInTheDocument();
    expect(screen.getByText('Custom')).toBeInTheDocument();
  });

  it('highlights the current preset value', () => {
    render(<SlippageTolerance {...defaultProps} />);
    
    const activeButton = screen.getByRole('button', { name: '0.5%' });
    expect(activeButton).toHaveClass('bg-primary'); // Assuming default variant has this class
  });

  it('calls onChange when preset is clicked', async () => {
    const user = userEvent.setup();
    render(<SlippageTolerance {...defaultProps} />);
    
    const preset1Button = screen.getByRole('button', { name: '1%' });
    await user.click(preset1Button);
    
    expect(mockOnChange).toHaveBeenCalledWith(1.0);
  });

  it('shows custom input when Custom button is clicked', async () => {
    const user = userEvent.setup();
    render(<SlippageTolerance {...defaultProps} />);
    
    const customButton = screen.getByRole('button', { name: 'Custom' });
    await user.click(customButton);
    
    expect(screen.getByLabelText('Custom Slippage (%)')).toBeInTheDocument();
  });

  it('validates custom input correctly', async () => {
    const user = userEvent.setup();
    render(<SlippageTolerance {...defaultProps} />);
    
    // Click custom button
    const customButton = screen.getByRole('button', { name: 'Custom' });
    await user.click(customButton);
    
    const input = screen.getByLabelText('Custom Slippage (%)');
    
    // Test negative value
    await user.clear(input);
    await user.type(input, '-1');
    expect(screen.getByText('Slippage cannot be negative')).toBeInTheDocument();
    
    // Test very high value
    await user.clear(input);
    await user.type(input, '60');
    expect(screen.getByText('Slippage cannot exceed 50%')).toBeInTheDocument();
    
    // Test high value warning
    await user.clear(input);
    await user.type(input, '10');
    expect(screen.getByText(/High slippage warning/)).toBeInTheDocument();
    
    // Test very low value warning
    await user.clear(input);
    await user.type(input, '0.01');
    expect(screen.getByText(/Very low slippage/)).toBeInTheDocument();
  });

  it('calls onChange with valid custom values', async () => {
    const user = userEvent.setup();
    render(<SlippageTolerance {...defaultProps} />);
    
    // Click custom button
    const customButton = screen.getByRole('button', { name: 'Custom' });
    await user.click(customButton);
    
    const input = screen.getByLabelText('Custom Slippage (%)');
    
    // Enter valid custom value
    await user.clear(input);
    await user.type(input, '2.5');
    
    expect(mockOnChange).toHaveBeenCalledWith(2.5);
  });

  it('displays correct impact level for different slippage values', () => {
    // Test low impact
    const { rerender } = render(<SlippageTolerance {...defaultProps} value={0.1} />);
    expect(screen.getByText('low')).toBeInTheDocument();
    
    // Test medium impact
    rerender(<SlippageTolerance {...defaultProps} value={0.5} />);
    expect(screen.getByText('medium')).toBeInTheDocument();
    
    // Test high impact
    rerender(<SlippageTolerance {...defaultProps} value={2.0} />);
    expect(screen.getByText('high')).toBeInTheDocument();
    
    // Test very high impact
    rerender(<SlippageTolerance {...defaultProps} value={5.0} />);
    expect(screen.getByText('very high')).toBeInTheDocument();
  });

  it('handles invalid input formats', async () => {
    const user = userEvent.setup();
    render(<SlippageTolerance {...defaultProps} />);
    
    // Click custom button
    const customButton = screen.getByRole('button', { name: 'Custom' });
    await user.click(customButton);
    
    const input = screen.getByLabelText('Custom Slippage (%)');
    
    // Test invalid characters
    await user.clear(input);
    await user.type(input, 'abc');
    expect(screen.getByText('Invalid number format')).toBeInTheDocument();
    
    // Test empty input
    await user.clear(input);
    await user.type(input, '');
    expect(screen.getByText('Please enter a valid number')).toBeInTheDocument();
  });

  it('switches back to preset when preset is selected after custom', async () => {
    const user = userEvent.setup();
    render(<SlippageTolerance {...defaultProps} />);
    
    // Click custom button
    const customButton = screen.getByRole('button', { name: 'Custom' });
    await user.click(customButton);
    
    // Verify custom input is shown
    expect(screen.getByLabelText('Custom Slippage (%)')).toBeInTheDocument();
    
    // Click preset button
    const preset1Button = screen.getByRole('button', { name: '1%' });
    await user.click(preset1Button);
    
    // Verify custom input is hidden
    expect(screen.queryByLabelText('Custom Slippage (%)')).not.toBeInTheDocument();
    expect(mockOnChange).toHaveBeenCalledWith(1.0);
  });

  it('applies custom className', () => {
    const { container } = render(
      <SlippageTolerance {...defaultProps} className="test-class" />
    );
    
    expect(container.firstChild).toHaveClass('test-class');
  });
});
