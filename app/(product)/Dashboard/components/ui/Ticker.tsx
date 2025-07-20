"use client"

import { useEffect, useState, useCallback } from 'react'
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { motion } from 'framer-motion'
import Image from 'next/image'

interface CoinData {
  id: string
  symbol: string
  name: string
  current_price: number
  price_change_percentage_24h: number
  image: string
}

// Configuration constants
const API_REFRESH_INTERVAL = 30000 // 30 seconds
const MAX_RETRY_ATTEMPTS = 3
const RETRY_DELAY = 2000 // 2 seconds
const API_RATE_LIMIT_WAIT = 60000 // 1 minute

export function Ticker() {
  const [coins, setCoins] = useState<CoinData[]>([])
  const [isMounted, setIsMounted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [isRateLimited, setIsRateLimited] = useState(false)

  const fetchCoins = useCallback(async () => {
    if (isRateLimited) return;
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false',
        {
          headers: {
            'Accept': 'application/json',
            ...(process.env.COINGECKO_API_KEY && { 'x-cg-demo-api-key': process.env.COINGECKO_API_KEY })
          }
        }
      )

      if (!response.ok) {
        if (response.status === 429) {
          setIsRateLimited(true)
          setError('Rate limit exceeded. Please wait...')
          setTimeout(() => setIsRateLimited(false), API_RATE_LIMIT_WAIT)
          return
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: CoinData[] = await response.json()
      
      if (!Array.isArray(data) || !data.every(coin => coin.id && coin.symbol)) {
        throw new Error('Invalid data format received from API')
      }

      setCoins(data)
      setError(null)
      setRetryCount(0)
      if (!isMounted) setIsMounted(true)
      
    } catch (error) {
      console.error('Error fetching coins:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      setError(`Failed to fetch coin data: ${errorMessage}`)

      if (retryCount < MAX_RETRY_ATTEMPTS) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1)
          fetchCoins()
        }, RETRY_DELAY * (retryCount + 1))
      }
    }
  }, [isMounted, retryCount, isRateLimited])

  useEffect(() => {
    fetchCoins()
    const interval = setInterval(fetchCoins, API_REFRESH_INTERVAL)

    return () => {
      clearInterval(interval)
    }
  }, [fetchCoins])

  if (!isMounted && !error) {
    return (
      <div className="flex h-10 sm:h-12 w-full items-center justify-center bg-muted/30">
        <span className="text-white/80 text-sm sm:text-base">Loading cryptocurrency data...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-10 sm:h-12 w-full items-center justify-center bg-muted/30">
        <span className="text-red-500 text-xs sm:text-sm">
          {error}
          {retryCount < MAX_RETRY_ATTEMPTS && ` (Retrying ${retryCount + 1}/${MAX_RETRY_ATTEMPTS}...)`}
        </span>
      </div>
    )
  }

  return (
    <div className="flex h-10 sm:h-12 w-full overflow-hidden border-transparent  bg-transparent shadow-sm justify-center items-center">
      <motion.div 
        className="flex-none items-center flex w-fit"
        animate={{
          translateX: ['0%', '-50%'],
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}>
        {[...coins, ...coins].map((coin, idx) => (
          <div 
            key={`${coin.id}-${idx}`} 
            className="flex-none gap-4 sm:gap-6 md:gap-8 pr-8 sm:pr-10 md:pr-14 flex w-fit"
          >
            <div className="flex items-center gap-1 sm:gap-2 w-fit">
              <Image 
                src={coin.image} 
                alt={coin.name}
                className="rounded-full object-contain w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 aspect-auto"
                width={4}
                height={4}
              />
              <span className="font-semibold text-black dark:text-white uppercase text-xs sm:text-sm">
                {coin.symbol}
              </span>
              <span className="text-xs sm:text-sm font-medium text-black dark:text-white">
                ${coin.current_price.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: window.innerWidth < 640 ? 2 : 4
                })}
              </span>
              <Badge
                variant="outline"
                className={cn(
                  'text-[10px] xs:text-xs',
                  coin.price_change_percentage_24h >= 0
                    ? 'text-green-500'
                    : 'text-red-500'
                )}
              >
                {coin.price_change_percentage_24h.toFixed(2)}%
              </Badge>
            </div>
            <div className="h-4 sm:h-6 w-px bg-border"/>
          </div>
        ))}
      </motion.div>
    </div>
  )
}