import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, Cell } from "recharts";
import { styleText } from "util";

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

const TokenomicsBubbleChart = () => {
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
        <div className="backdrop-blur-xl bg-black/40 border border-white/10 rounded-lg p-3 shadow-lg">
          <p className="font-medium text-sm">{data.name}</p>
          <div className="space-y-1 mt-1">
            <p className="text-xs flex items-center justify-between">
              <span className="text-muted-foreground">Market Cap:</span>
              <span className="font-mono">{formatCurrency(data.marketCap)}</span>
            </p>
            <p className="text-xs flex items-center justify-between">
              <span className="text-muted-foreground">24h Volume:</span>
              <span className="font-mono">{formatCurrency(data.volume24h)}</span>
            </p>
            <p className="text-xs flex items-center justify-between">
              <span className="text-muted-foreground">Market Share:</span>
              <span className="font-mono">{data.marketShare}%</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="mt-6 overflow-hidden backdrop-blur-sm bg-black/5 border-white/10">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium tracking-tight">Tokenomics Map</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart
              margin={{ top: 20, right: 30, bottom: 30, left: 30 }}
            >
              <XAxis 
                type="number" 
                dataKey="marketCap" 
                name="Market Cap" 
                tickFormatter={formatCurrency}
                domain={['auto', 'auto']}
                tick={{ fill: '#8E9196', fontSize: 4 }}
                stroke="#403E43"
                axisLine={{ stroke: '#403E43', strokeWidth: 1 }}
                tickLine={{ stroke: '#403E43' }}
                label={{ 
                  value: 'Market Cap', 
                  position: 'insideBottom', 
                  offset: -15,
                  fill: '#8E9196',
                  fontSize:4,
                }}
              />
              <YAxis 
                type="number" 
                dataKey="volume24h" 
                name="24h Volume" 
                tickFormatter={formatCurrency}
                domain={['auto', 'auto']}
                tick={{ fill: '#8E9196', fontSize: 6 }}
                stroke="#403E43"
                axisLine={{ stroke: '#403E43', strokeWidth: 1 }}
                tickLine={{ stroke: '#403E43' }}
                label={{ 
                  value: '24h Volume', 
                  angle: -90, 
                  position: 'insideLeft',
                  fill: '#8E9196',
                  fontSize: 6,
                }}
              />
              <ZAxis 
                type="number" 
                dataKey="marketShare" 
                range={[80, 1200]} 
                name="Market Share"
              />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }} 
                content={formatTooltipContent} 
                wrapperStyle={{ outline: 'none' }}
              />
              <Scatter name="Tokenomics" data={tokenomicsData}>
                {tokenomicsData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color} 
                    stroke="rgba(255,255,255,0.3)" 
                    strokeWidth={1}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex flex-wrap gap-2 sm:gap-3 mt-2 justify-center">
          {tokenomicsData.map((token, index) => (
            <div key={index} className="flex items-center gap-1.5 bg-black/10 backdrop-blur-sm px-2 py-1 rounded-full">
              <div 
                className="h-2.5 w-2.5 rounded-full ring-1 ring-white/10" 
                style={{ backgroundColor: token.color }}
              ></div>
              <span className="text-[10px] sm:text-xs">{token.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TokenomicsBubbleChart;