"use client"

import { useEffect, useState, useRef } from "react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { createChart as createLwChart, IChartApi, CandlestickSeries, createChart, PriceScaleMode, UTCTimestamp } from 'lightweight-charts'
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  MAINNET_TOKENS_BY_SYMBOL, 
  COINGECKO_IDS,
  Token 
} from "@/src/constants"
import { Button } from "@/components/ui/button"
import { CandlestickChart, LineChart } from "lucide-react"
import Image from "next/image"

interface TradingChartProps {
  buyTokenSymbol?: string
  sellTokenSymbol?: string
  delay?: number
  days?: number
  chartColor?: string
  price: number
}

interface ChartDataPoint {
  timestamp: number
  price: number
}

interface CandleData {
  time: UTCTimestamp;
  open: number
  high: number
  low: number
  close: number
}

interface TokenMarketData {
  currentPrice: number
  priceChange24h: number
  marketCap: number
  volume24h: number
}

export function PairIndex({ buyTokenSymbol, sellTokenSymbol, price, chartColor = "green", delay = 0  }: TradingChartProps) {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])
  const [candleData, setCandleData] = useState<CandleData[]>([])
  const [marketData, setMarketData] = useState<TokenMarketData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showBuyChart, setShowBuyChart] = useState(true)
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1D' | '7D' | '3M' | '1Y' | 'All'>('1D')
  const [chartType, setChartType] = useState<'line' | 'candle'>('line')
  const [chartInstance, setChartInstance] = useState<IChartApi | null>(null)
  const chartContainerRef = useRef<HTMLDivElement>(null)

  

  const currentTokenSymbol = showBuyChart ? buyTokenSymbol : sellTokenSymbol
  const tokenInfo: Token | undefined = currentTokenSymbol 
    ? MAINNET_TOKENS_BY_SYMBOL[currentTokenSymbol.toLowerCase()]
    : undefined
  const coingeckoId = tokenInfo ? COINGECKO_IDS[tokenInfo.symbol.toLowerCase()] : null

  useEffect(() => {
    const fetchData = async () => {
      if (!coingeckoId || !tokenInfo) {
        setError("Invalid token selection")
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)

        const apiKey = process.env.NEXT_PUBLIC_COINGECKO_API_KEY
        const headers: Record<string, string> = {}
        if (apiKey) headers["x-cg-demo-api-key"] = apiKey

        const daysMap = {
          '1D': 1,
          '7D': 7,
          '3M': 90,
          '1Y': 365,
          'All': 'max'
        }
        

        const [marketRes, chartRes] = await Promise.all([
          fetch(`https://api.coingecko.com/api/v3/coins/${coingeckoId}`, { headers }),
          chartType === 'line'
            ? fetch(`https://api.coingecko.com/api/v3/coins/${coingeckoId}/market_chart?vs_currency=usd&days=${daysMap[selectedTimeframe]}`, { headers })
            : fetch(`https://api.coingecko.com/api/v3/coins/${coingeckoId}/ohlc?vs_currency=usd&days=${daysMap[selectedTimeframe]}`, { headers })
        ])

        if (!marketRes.ok || !chartRes.ok) throw new Error('Failed to fetch data')

        const marketData = await marketRes.json()
        const chartData = await chartRes.json()

        if (chartType === 'line') {
          const transformedChart: ChartDataPoint[] = chartData.prices.map(
            ([timestamp, price]: [number, number]) => ({
              timestamp,
              price: Number(price.toFixed(4))
            })
          )
          setChartData(transformedChart)
        } else {
          const transformedCandles: CandleData[] = chartData.map((d: [number, number, number, number, number]) => ({
            time: Math.floor(d[0] / 1000) as UTCTimestamp,
            open: d[1],
            high: d[2],
            low: d[3],
            close: d[4]
          }));
          setCandleData(transformedCandles)
        }

        const transformedMarket: TokenMarketData = {
          currentPrice: marketData.market_data.current_price.usd,
          priceChange24h: marketData.market_data.price_change_percentage_24h,
          marketCap: marketData.market_data.market_cap.usd,
          volume24h: marketData.market_data.total_volume.usd
        }

        setMarketData(transformedMarket)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [coingeckoId, tokenInfo, price, selectedTimeframe, chartType])
useEffect(() => {
  if (chartType === 'candle' && chartContainerRef.current && candleData.length > 0) {
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      layout: {
        background: { color: '#18181b' },
        textColor: '#71717a'
      },
      grid: {
        vertLines: { color: '#27272a' },
        horzLines: { color: '#27272a' }
      },

    });

    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#16a34a',
      downColor: '#dc2626',
      borderVisible: false,
      wickUpColor: '#16a34a',
      wickDownColor: '#dc2626',
      
    });

    candleSeries.setData(candleData);
    setChartInstance(chart);

    return () => {
      chart.remove();
      setChartInstance(null);
    };
  }
}, [chartType, candleData]);

  useEffect(() => {
    const handleResize = () => {
      if (chartInstance && chartContainerRef.current) {
        chartInstance.resize(
          chartContainerRef.current.clientWidth,
          chartContainerRef.current.clientHeight
        )
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [chartInstance])

  const getPriceRange = () => {
    if (chartType === 'candle' && candleData.length > 0) {
      const prices = candleData.flatMap(d => [d.high, d.low])
      const minPrice = Math.min(...prices)
      const maxPrice = Math.max(...prices)
      const range = maxPrice - minPrice
      const padding = range * 0.1
      return { min: minPrice - padding, max: maxPrice + padding }
    }
    
    if (chartData.length === 0) return { min: 0, max: 0 }
    const prices = chartData.map((point) => point.price)
    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)
    const range = maxPrice - minPrice
    const padding = range * 0.1
    return { min: minPrice - padding, max: maxPrice + padding }
  }

  const { min, max } = getPriceRange()

  if (isLoading) {
    return (
      <Card className="p-6 px-2 h-[712px] border-0 bg-zinc-900 w-full flex">
        
        <CardHeader className="flex flex-row items-center justify-between mt-0 w-full">
          <div className="flex items-center gap-1 flex-row w-full">
            <Skeleton className="h-12 w-12 rounded-full" />
              <CardContent className="flex flex-col gap-1 w-full">
                <div className="flex flex-row items-center gap-2 w-full">
                  <Skeleton className="h-6 w-20 rounded-md" />
                  <Skeleton className="h-6 w-20 rounded-md" />
                </div>
                <div className="flex flex-row gap-2 items-center w-full">
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-20 rounded-md"/>
                  </div>
                    <Skeleton className="h-4 w-20 rounded-md"/>
                </div>
              </CardContent>
          </div>
            <Skeleton className="h-10 w-24 rounded-md"/>
        </CardHeader>

        <CardContent className="flex flex-row justify-between w-full">

          <div className="flex flex-row gap-2 w-full">
              <Skeleton className="h-8 w-20 rounded-md" />
              <Skeleton className="h-8 w-20 rounded-md" />
              <Skeleton className="h-8 w-20 rounded-md" />
              <Skeleton className="h-8 w-20 rounded-md" />
              <Skeleton className="h-8 w-20 rounded-md" />
          </div>

          <div className="flex flex-row gap-2">
              <Skeleton className="h-8 w-18 rounded-md" />
              <Skeleton className="h-8 w-18 rounded-md" />
          </div>

        </CardContent>

        <CardContent className="text-center text-muted-foreground h-full w-full justify-center items-center">
          <Skeleton className="rounded-md h-full justify-center items-center flex w-full">
            <LineChart width={100} height={100} className="justify-center items-center"/>
            {isLoading}
          </Skeleton>
        </CardContent>
      </Card>
    )
  }

  if (error || !tokenInfo) {
    return (
      <Card className="p-6 px-2 h-[712px] border-0 bg-zinc-900 w-full flex">
        
        <CardHeader className="flex flex-row items-center justify-between mt-0 w-full">
          <div className="flex items-center gap-1 flex-row w-full">
            <Skeleton className="h-12 w-12 rounded-full" />
              <CardContent className="flex flex-col gap-1 w-full">
                <div className="flex flex-row items-center gap-2 w-full">
                  <Skeleton className="h-6 w-20 rounded-md" />
                  <Skeleton className="h-6 w-20 rounded-md" />
                </div>
                <div className="flex flex-row gap-2 items-center w-full">
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-20 rounded-md"/>
                  </div>
                    <Skeleton className="h-4 w-20 rounded-md"/>
                </div>
              </CardContent>
          </div>
            <Skeleton className="h-10 w-24 rounded-md"/>
        </CardHeader>

        <CardContent className="flex flex-row justify-between w-full">

          <div className="flex flex-row gap-2 w-full">
              <Skeleton className="h-8 w-20 rounded-md" />
              <Skeleton className="h-8 w-20 rounded-md" />
              <Skeleton className="h-8 w-20 rounded-md" />
              <Skeleton className="h-8 w-20 rounded-md" />
              <Skeleton className="h-8 w-20 rounded-md" />
          </div>

          <div className="flex flex-row gap-2">
              <Skeleton className="h-8 w-18 rounded-md" />
              <Skeleton className="h-8 w-18 rounded-md" />
          </div>

        </CardContent>

        <CardContent className="text-center text-muted-foreground h-full w-full justify-center items-center">
          <Skeleton className="rounded-md h-full justify-center items-center flex w-full">
            <LineChart width={100} height={100} className="justify-center items-center"/>
            {error || "Select tokens to view chart"}
          </Skeleton>
        </CardContent>
      </Card>
    )
  }

  const otherTokenSymbol = showBuyChart ? sellTokenSymbol : buyTokenSymbol
  const otherTokenInfo: Token | undefined = otherTokenSymbol 
    ? MAINNET_TOKENS_BY_SYMBOL[otherTokenSymbol.toLowerCase()]
    : undefined

  return (
    <Card className="w-full flex flex-col justify-between border-none dark:bg-zinc-900 bg-white ">
      <CardHeader className="flex flex-row items-center justify-between mt-0">
        <div>
          <h1 className="text-sm font-semibold text-zinc-200">Pair Index</h1>
        </div>
        <div className="flex items-center gap-2 flex-row">

          <Image 
            src={tokenInfo.logoURL || "/placeholder-token.png"} 
            alt={tokenInfo.name}
            className="h-6 w-6 rounded-full bg-zinc-800"
            width={24}
            height={24}
            onError={(e) => {
              // Fallback to a placeholder if the image fails to load
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder-token.png';
            }}
          />

          <div className="flex flex-col gap-1">
            <div className="flex flex-row items-center gap-4 text-sm">
              <CardTitle>{tokenInfo.symbol.toUpperCase()}</CardTitle>
            </div>
          </div>

        </div>
      </CardHeader>

      <CardContent className="h-[150px] sm:h-[150px] w-full">
        {chartType === 'line' ? (
          <div className="w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.0} />
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={(ts) => new Date(ts).toLocaleDateString()}
                  tick={{ fill: "#888", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  hide={true}

                />
                <YAxis
                  domain={[min, max]}
                  tickFormatter={(value) => `$${value.toFixed(2)}`}
                  tick={{ fill: "#888", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  hide={true}
                  orientation="right"
                />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="#2563eb"
                  fill="#3b82f6"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
              <div ref={chartContainerRef} className="w-full h-full" />
        )}
      </CardContent>
    </Card>
  )
}