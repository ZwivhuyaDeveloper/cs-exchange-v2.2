import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, Cell } from "recharts";

type TokenomicsData = {
  name: string;
  marketCap: number;
  volume24h: number;
  marketShare: number;
  color: string;
};

const tokenomicsData: TokenomicsData[] = [
  { name: "Bitcoin", marketCap: 1258000000000, volume24h: 42500000000, marketShare: 48.5, color: "#F7931A" },
  { name: "Ethereum", marketCap: 415600000000, volume24h: 18900000000, marketShare: 16.1, color: "#627EEA" },
  { name: "Solana", marketCap: 62800000000, volume24h: 3450000000, marketShare: 2.4, color: "#00FFA3" },
  { name: "Cardano", marketCap: 16000000000, volume24h: 724000000, marketShare: 0.6, color: "#0033AD" },
  { name: "Polkadot", marketCap: 8950000000, volume24h: 432000000, marketShare: 0.4, color: "#E6007A" },
  { name: "XRP", marketCap: 35200000000, volume24h: 1890000000, marketShare: 1.3, color: "#23292F" },
  { name: "Dogecoin", marketCap: 17500000000, volume24h: 980000000, marketShare: 0.7, color: "#C2A633" },
  { name: "USDT", marketCap: 95700000000, volume24h: 72300000000, marketShare: 3.7, color: "#26A17B" },
  { name: "USDC", marketCap: 29800000000, volume24h: 8700000000, marketShare: 1.2, color: "#2775CA" },
  { name: "BNB", marketCap: 65700000000, volume24h: 3200000000, marketShare: 2.5, color: "#F0B90B" },
];

const BubbleChart = () => {
  const formatCurrency = (value: number) => {
    if (value >= 1e12) {
      return `$${(value / 1e12).toFixed(2)}T`;
    }
    if (value >= 1e9) {
      return `$${(value / 1e9).toFixed(2)}B`;
    }
    if (value >= 1e6) {
      return `$${(value / 1e6).toFixed(2)}M`;
    }
    return `$${value.toFixed(2)}`;
  };

  const formatTooltipContent = (props: any) => {
    const { payload } = props;
    if (payload && payload.length > 0) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border border-border p-2 rounded-md shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm">Market Cap: {formatCurrency(data.marketCap)}</p>
          <p className="text-sm">24h Volume: {formatCurrency(data.volume24h)}</p>
          <p className="text-sm">Market Share: {data.marketShare}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="p-2 bg-transparent border-0 m-0">
      <CardHeader>
        <CardTitle className="text-sm">Tokenomics Bubble Map</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            >
              <XAxis 
                type="number" 
                dataKey="marketCap" 
                name="Market Cap" 
                tickFormatter={formatCurrency}
                domain={['auto', 'auto']}
                label={{ value: 'Market Cap', position: 'bottom', offset: 0, }}
                stroke="#6B7280"
              />
              <YAxis 
                type="number" 
                dataKey="volume24h" 
                name="24h Volume" 
                tickFormatter={formatCurrency}
                domain={['auto', 'auto']}
                label={{ value: '24h Volume', angle: -90, position: 'left' }}
                stroke="#6B7280"
              />
              <ZAxis 
                type="number" 
                dataKey="marketShare" 
                range={[100, 1500]} 
                name="Market Share"
              />
              <Tooltip content={formatTooltipContent} />
              <Scatter name="Tokenomics" data={tokenomicsData}>
                {tokenomicsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap gap-3 mt-4 justify-center">
          {tokenomicsData.map((token, index) => (
            <div key={index} className="flex items-center gap-1">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: token.color }}></div>
              <span className="text-xs">{token.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default BubbleChart;
