import React from 'react';
import { render, screen } from '@testing-library/react';
import MarketStats from './MarketStats';

// Mock the InfoCard component
jest.mock('./InfoCard', () => {
  return function MockInfoCard() {
    return <div data-testid="info-card">Info Card</div>;
  };
});

// Mock the componentData
jest.mock('./componentData', () => ({
  getMarketStatsInfo: () => ({ title: 'Test Info', description: 'Test Description' })
}));

describe('MarketStats', () => {
  const mockMarketData = {
    volume24h: 1000000,
    volume24hChange: 5.5,
    marketCap: 50000000,
    marketCapChange: -2.1,
    fdv: 75000000,
    fdvChange: 1.8,
    circulatingSupply: 1000000,
    circulatingSupplyChange: 0.5,
    price: 50.0,
    priceChange: 3.2
  };

  it('renders loading state when isLoading is true', () => {
    render(
      <MarketStats
        tokenSymbol="ETH"
        chainId={1}
        isLoading={true}
        error={undefined}
        marketData={undefined}
      />
    );

    expect(screen.getByText('Loading dashboard data...')).toBeInTheDocument();
  });

  it('renders error state when error is provided', () => {
    render(
      <MarketStats
        tokenSymbol="ETH"
        chainId={1}
        isLoading={false}
        error="Failed to fetch data"
        marketData={undefined}
      />
    );

    expect(screen.getByText('Error loading market data')).toBeInTheDocument();
    expect(screen.getByText('Failed to fetch data')).toBeInTheDocument();
  });

  it('renders no data state when marketData is undefined', () => {
    render(
      <MarketStats
        tokenSymbol="ETH"
        chainId={1}
        isLoading={false}
        error={undefined}
        marketData={undefined}
      />
    );

    expect(screen.getByText('No market data available')).toBeInTheDocument();
    expect(screen.getByText('Unable to load market data for ETH')).toBeInTheDocument();
  });

  it('renders market data when provided', () => {
    render(
      <MarketStats
        tokenSymbol="ETH"
        chainId={1}
        isLoading={false}
        error={undefined}
        marketData={mockMarketData}
      />
    );

    expect(screen.getByText('Market stats for ETH')).toBeInTheDocument();
    expect(screen.getByText('Volume (24h)')).toBeInTheDocument();
    expect(screen.getByText('Market Cap')).toBeInTheDocument();
    expect(screen.getByText('FDV')).toBeInTheDocument();
    expect(screen.getByText('Circulating Supply')).toBeInTheDocument();
  });

  it('displays correct values and changes', () => {
    render(
      <MarketStats
        tokenSymbol="ETH"
        chainId={1}
        isLoading={false}
        error={undefined}
        marketData={mockMarketData}
      />
    );

    // Check for positive change (green)
    expect(screen.getByText('5.5%')).toBeInTheDocument();
    expect(screen.getByText('1.8%')).toBeInTheDocument();
    expect(screen.getByText('0.5%')).toBeInTheDocument();
    expect(screen.getByText('3.2%')).toBeInTheDocument();

    // Check for negative change (red)
    expect(screen.getByText('-2.1%')).toBeInTheDocument();
  });
});
