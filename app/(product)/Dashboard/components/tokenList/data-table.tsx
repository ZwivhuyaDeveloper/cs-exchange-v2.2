"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ChevronDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { MAINNET_TOKENS, COINGECKO_IDS } from "@/src/constants"
import { Token } from "@/src/constants"
import { useEffect, useState } from "react"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"

interface TokenWithMarketData extends Token {
  price?: number
  priceChange1h?: number
  marketCap?: number
}

const API_DELAY = 1500
const MAX_RETRIES = 3

export const columns: ColumnDef<TokenWithMarketData>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "logoURI",
    header: "",
    cell: ({ row }) => (
      <Avatar className="h-6 w-6">
        <AvatarImage src={row.getValue("logoURI")} />
      </Avatar>
    ),
  },
  {
    accessorKey: "symbol",
    header: "Symbol",
    cell: ({ row }) => (
      <div className="uppercase font-medium">
        {row.getValue("symbol")}
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const price = row.getValue("price")
      if (price === undefined) {
        return <Skeleton className="h-4 w-[80px]" />
      }
      return (
        <div className="font-medium">
          ${Number(price).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 4
          })}
        </div>
      )
    },
  },
  {
    accessorKey: "priceChange1h",
    header: "1h Change",
    cell: ({ row }) => {
      const change = row.getValue("priceChange1h")
      if (change === undefined) {
        return <Skeleton className="h-4 w-[60px]" />
      }
      return (
        <div className={`font-medium ${
          Number(change) >= 0 ? 'text-green-500' : 'text-red-500'
        }`}>
          {Number(change).toFixed(2)}%
        </div>
      )
    },
  },
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => (
      <div className="text-xs font-mono">
        {(row.getValue("address") as string).slice(0, 6)}...{(row.getValue("address") as string).slice(-4)}
      </div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const token = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(token.address)}
            >
              Copy token address
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View token details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export function DataTable() {
  const [data, setData] = useState<TokenWithMarketData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const fetchWithRetry = React.useCallback(async (url: string, retries = MAX_RETRIES): Promise<any> => {
    try {
      const response = await fetch(url);
      
      // Handle rate limits with exponential backoff
      if (response.status === 429) {
        if (retries > 0) {
          const delay = Math.pow(2, MAX_RETRIES - retries) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
          return fetchWithRetry(url, retries - 1);
        }
        throw new Error("Rate limit exceeded");
      }
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      return response.json();
    } catch (error) {
      if (retries > 0) {
        const delay = Math.pow(2, MAX_RETRIES - retries) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        return fetchWithRetry(url, retries - 1);
      }
      throw error;
    }
  }, []); // Empty dependency array makes it stable

  const fetchMarketData = React.useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const tokensWithData: TokenWithMarketData[] = []
      
      for (const token of MAINNET_TOKENS) {
        try {
          const coingeckoId = COINGECKO_IDS[token.symbol.toLowerCase()]
          if (!coingeckoId) {
            tokensWithData.push({ ...token })
            continue
          }

          const data = await fetchWithRetry(
            `https://api.coingecko.com/api/v3/coins/${coingeckoId}`
          )
          
          tokensWithData.push({
            ...token,
            price: data.market_data?.current_price?.usd,
            priceChange1h: data.market_data?.price_change_percentage_1h_in_currency?.usd,
            marketCap: data.market_data?.market_cap?.usd
          })
          
          // Add delay between requests to avoid rate limits
          await new Promise(resolve => setTimeout(resolve, API_DELAY))
        } catch (error) {
          console.error(`Failed to fetch data for ${token.symbol}:`, error)
          tokensWithData.push({ ...token })
        }
      }
      
      // Sort by market cap descending
      const sortedTokens = tokensWithData.sort((a, b) => 
        (b.marketCap || 0) - (a.marketCap || 0)
      )
      setData(sortedTokens)
    } catch (error) {
      console.error("Failed to load market data:", error)
      setError("Failed to load market data. Please try again later.")
      // Set data with tokens without market data
      setData(MAINNET_TOKENS.map(token => ({ ...token })))
    } finally {
      setIsLoading(false)
    }
  }, [fetchWithRetry])

  useEffect(() => {
    fetchMarketData()
  }, [fetchMarketData])

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full">
      <div className="flex items-center py-4 gap-4 px-5">
        {error && (
          <div className="flex-1 bg-red-100 p-3 rounded-lg flex items-center justify-between">
            <span className="text-red-700">{error}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchMarketData}
              className="text-red-700 hover:bg-red-200"
            >
              Retry
            </Button>
          </div>
        )}
        
        <Input
          placeholder="Search for token, addresses & symbols"
          value={(table.getColumn("symbol")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("symbol")?.setFilterValue(event.target.value)
          }
          className="max-w-sm rounded-md"
          disabled={isLoading}
        />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto" disabled={isLoading}>
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table.getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) =>
                    column.toggleVisibility(!!value)
                  }
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-none border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array(5).fill(0).map((_, i) => (
                <TableRow key={`skeleton-${i}`}>
                  {columns.map((column, colIndex) => (
                    <TableCell key={`row-${i}-col-${colIndex}`}>
                      <Skeleton className="h-4 w-[80%]" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow key="no-results">
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No tokens found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4 px-5">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}