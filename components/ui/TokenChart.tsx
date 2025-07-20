"use client"

import { useEffect, useState } from "react"
import { ArrowUp, ArrowDown } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Skeleton } from "./ui/skeleton"
import { MarketInfo } from "./MarketInfo"
import Image from "next/image"

interface CoinDetails {
  id: string
  name: string
  symbol: string
  current_price: number
  price_change_percentage_24h: number
  image: string
  market_cap: number
  total_volume: number
}

interface ChartPoint {
  time: string
  price: number
}

interface TokenChartProps {
  tokenId: string
  chainIconUrl?: string
  tokenIconUrl?: string
  days?: number
  currency?: string
  chartColor?: string
  delay?: number
}

export function TokenChart({
  tokenId,
  tokenIconUrl,
  chainIconUrl,
  days = 1,
  currency = "usd",
  chartColor = "green",
  delay = 0,
}: TokenChartProps) {
  const [coinData, setCoinData] = useState<CoinDetails | null>(null)
  const [chartData, setChartData] = useState<ChartPoint[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const chartConfig: ChartConfig = {
    price: {
      label: `Price (${currency.toUpperCase()})`,
      color: chartColor,
    },
  }

  useEffect(() => {
    const controller = new AbortController()
    const signal = controller.signal

    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const apiKey = process.env.NEXT_PUBLIC_COINGECKO_API_KEY
        if (!apiKey) {
          throw new Error("CoinGecko API key is missing")
        }

        const detailsResponse = await fetch(
          `https://api.coingecko.com/api/v3/coins/${tokenId}`,
          {
            signal,
            headers: {
              "x-cg-demo-api-key": apiKey,
            },
          }
        )
        if (!detailsResponse.ok) throw new Error("Failed to fetch coin details")
        const detailsData = await detailsResponse.json()
        const coinDetails: CoinDetails = {
          id: detailsData.id,
          name: detailsData.name,
          symbol: detailsData.symbol,
          current_price: detailsData.market_data.current_price[currency],
          price_change_percentage_24h:
            detailsData.market_data.price_change_percentage_24h,
          image: detailsData.image.small,
          market_cap: detailsData.market_data.market_cap[currency],
          total_volume: detailsData.market_data.total_volume[currency],
        }

        const chartResponse = await fetch(
          `https://api.coingecko.com/api/v3/coins/${tokenId}/market_chart?vs_currency=${currency}&days=${days}`,
          {
            signal,
            headers: {
              "x-cg-demo-api-key": apiKey,
            },
          }
        )
        if (!chartResponse.ok) throw new Error("Failed to fetch market chart")
        const chartDataRaw = await chartResponse.json()
        const chartPoints = chartDataRaw.prices.map(
          ([timestamp, price]: [number, number]) => ({
            time: new Date(timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            price,
          })
        )

        setCoinData(coinDetails)
        setChartData(chartPoints)
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return
        if (err instanceof Error) {
          setError(err.message || "An error occurred")
        } else {
          setError("An unknown error occurred")
        }
      } finally {
        setIsLoading(false)
      }
    }

    const timer = setTimeout(() => {
      fetchData()
    }, delay)

    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [tokenId, days, currency, delay])

  const formatLargeNumber = (num: number): string => {
    if (num >= 1e12) {
      return (num / 1e12).toFixed(2) + "T"
    } else if (num >= 1e9) {
      return (num / 1e9).toFixed(2) + "B"
    } else if (num >= 1e6) {
      return (num / 1e6).toFixed(2) + "M"
    } else if (num >= 1e3) {
      return (num / 1e3).toFixed(2) + "K"
    } else {
      return num.toFixed(2)
    }
  }

  const getPriceRange = () => {
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
      <Skeleton className="dark:bg-gray-950 bg-white dark:text-white text-black h-full w-full rounded-4xl p-10  ">
        <CardHeader className="flex flex-col gap-3">
          <Skeleton className="h-4 w-1/2 bg-zinc-300" />
          <Skeleton className="h-4 w-1/4 bg-zinc-300" />
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Skeleton className="h-4 w-full bg-zinc-300" />
          <Skeleton className="h-4 w-full bg-zinc-300" />
          <Skeleton className="h-4 w-full bg-zinc-300" />
        </CardContent>
      </Skeleton>
    )
  }

  if (error || !coinData) {
    return (
      <Skeleton className="dark:bg-gray-950 bg-white dark:text-white text-black w-full h-full p-10">
          <CardHeader className="flex flex-col gap-3">
            <Skeleton className="h-4 w-1/2 bg-zinc-300" />
            <Skeleton className="h-4 w-1/4 bg-zinc-300" />
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
          <Skeleton className="h-4 w-full bg-zinc-300" />
          <Skeleton className="h-4 w-full bg-zinc-300" />
          <Skeleton className="h-4 w-full bg-zinc-300" />
          </CardContent>
      </Skeleton>
    )
  }

  return (
    <Card className="dark:bg-gray-950 bg-white shadow-2xl shadow-gray-300 dark:shadow-gray-950 dark:text-white text-black rounded-4xl border-none">
      <CardHeader>
      <div className="flex justify-between items-center">
    <div className="flex items-center gap-2">
      {/* Updated icon pair */}
      <div className="relative">
        <Image
          src={tokenIconUrl || coinData.image}
          alt={coinData.name}
          className="w-8 h-8 rounded-full"
          width={8}
          height={8}
        />
        {chainIconUrl && (
          <Image
            src={chainIconUrl}
            alt="Chain"
            width={4}
            height={4}
            className="w-4 h-4 rounded-full border border-gray-600 absolute -bottom-1 -right-1 bg-white"
          />
        )}
      </div>
      <CardTitle className="text-[15px] font-bold">
        {coinData.name} ({coinData.symbol.toUpperCase()})
      </CardTitle>
    </div>
          <div
            className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-full text-sm",
              coinData.price_change_percentage_24h >= 0
                ? "bg-green-500"
                : "bg-red-500",
              "text-white"
            )}
          >
            {coinData.price_change_percentage_24h >= 0 ? (
              <ArrowUp className="h-3 w-3 font-medium" strokeWidth={3} />
            ) : (
              <ArrowDown className="h-3 w-3" strokeWidth={3} />
            )}
            <span>
              {Math.abs(coinData.price_change_percentage_24h).toFixed(2)}%
            </span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="text-1xl font-semibold">
            {coinData.current_price.toFixed(2)} {currency.toUpperCase()}
          </div>
          <div className="flex gap-1 flex-col">
              <MarketInfo 
                marketCap={coinData.market_cap} 
                volume={coinData.total_volume} 
                currency={currency} />
          </div>
        </div>
        <CardDescription className="text-gray-400 font-medium">
          24 Hour Price Chart
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-full w-full">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColor} stopOpacity={0.8} />
                <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="" vertical={false} />
            <XAxis
              dataKey="time"
              tick={{ fill: "#888", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[min, max]}
              tickFormatter={(value) =>
                `${value.toFixed(2)} ${currency.toUpperCase()}`
              }
              tick={{ fill: "#888", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              hide={true}
            />
            <ChartTooltip
              content={<ChartTooltipContent indicator="line" className="bg-green-500" />}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke={chartColor}
              fill="url(#priceGradient)"
              dot={false}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}