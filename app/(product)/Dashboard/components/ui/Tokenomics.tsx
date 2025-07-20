"use client"

import { Pie, PieChart } from "recharts"

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
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
const chartData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 90, fill: "var(--color-other)" },
]

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "green",
  },
  safari: {
    label: "Safari",
    color: "blue",
  },
  firefox: {
    label: "Firefox",
    color: "red",
  },
  edge: {
    label: "Edge",
    color: "yellow",
  },
  other: {
    label: "Other",
    color: "purple",
  },
} satisfies ChartConfig

export function Tokenomics() {
  return (
    <Card className="flex flex-col bg-transparent p-0 m-0 w-full h-fit border-0">
      <CardHeader className="items-center p-0 m-0 w-full h-full bg-transparent">
        <CardTitle className="text-sm">Pie Chart - Legend</CardTitle>
        <CardDescription className="text-xs">January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className=" w-h-full w-full bg-transparent"
        >
          <PieChart className="w-full h-full">
            <Pie data={chartData} dataKey="visitors" />
            <ChartLegend
              content={<ChartLegendContent nameKey="browser" />}
              className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
