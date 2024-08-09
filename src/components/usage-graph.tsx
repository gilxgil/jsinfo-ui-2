"use client";

import React, { useState, useMemo, useEffect } from "react";
import useSWR from 'swr';
import { format, addDays, isBefore, startOfDay } from "date-fns";
import { CalendarIcon } from "@radix-ui/react-icons";
import { DateRange } from "react-day-picker";
import {
  Area, Line, ComposedChart, CartesianGrid, XAxis, YAxis, Tooltip, Brush,
  Legend, ResponsiveContainer, AreaChart
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import CustomCombobox from "./custom-combobox";
import { cn } from "@/lib/utils";
import UsageGraphSkeleton from "./usage-graph-skeleton";

const fetcher = (url: string | URL | Request) => fetch(url).then((res) => res.json());

export function UsageGraph() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addDays(new Date(), -90),
    to: new Date(),
  });
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [tempDateRange, setTempDateRange] = useState<DateRange | undefined>(dateRange);

  const { data, error, isValidating } = useSWR(() => {
    if (dateRange?.from && dateRange?.to) {
      const fromDate = format(dateRange.from, "yyyy-MM-dd'Z'");
      const toDate = format(dateRange.to, "yyyy-MM-dd'Z'");
      return `https://jsinfo.lavanet.xyz/indexCharts?f=${fromDate}&t=${toDate}`;
    }
    return null;
  }, fetcher, {
    refreshInterval: 5 * 60 * 1000,
    revalidateOnFocus: false,
    keepPreviousData: true
  });

  const [availableChains, setAvailableChains] = useState<string[]>([]);
  const [selectedChains, setSelectedChains] = useState<string[]>([]);

  const { chartData, chartConfig } = useMemo(() => {
    if (!data || !data.data) {
      return { chartData: [], chartConfig: {} };
    }

    const sortedData = [...data.data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    const allChains = new Set<string>()
    sortedData.forEach((day) => {
      if (Array.isArray(day.data)) {
        day.data.forEach((chain: { chainId: string; }) => {
          if (chain.chainId && chain.chainId !== "All Chains") {
            allChains.add(chain.chainId)
          }
        })
      }
    })

    setAvailableChains(Array.from(allChains));

    const chartData = sortedData.map((day) => {
      const dayData: { [key: string]: any } = {
        date: day.date,
        qos: day.qos,
        totalRelays: 0,
      }
      if (Array.isArray(day.data)) {
        day.data.forEach((chain: { chainId: string; relaySum: number; }) => {
          if (chain.chainId && chain.chainId !== "All Chains") {
            dayData[chain.chainId] = chain.relaySum || 0
            dayData.totalRelays += chain.relaySum || 0
          }
        })
      }
      return dayData
    })

    const chartConfig: { [key: string]: { label: string; color: string } } = {
      qos: {
        label: "QoS Score",
        color: "hsl(var(--primary))",
      },
    }
    const colors = [
      "hsl(var(--chart-1))",
      "hsl(var(--chart-2))",
      "hsl(var(--chart-3))",
      "hsl(var(--chart-4))",
      "hsl(var(--chart-5))",
    ];

    Array.from(allChains).forEach((chain, index) => {
      chartConfig[chain] = {
        label: chain,
        color: colors[index % colors.length],
      }
    })


    return { chartData, chartConfig }
  }, [data, selectedChains]);

  useEffect(() => {
    if (availableChains.length > 0 && selectedChains.length === 0) {
      setSelectedChains(availableChains.slice(0, 10));
    }
  }, [availableChains, selectedChains]);

  useEffect(() => {
    Object.entries(chartConfig).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--${key}-color`, value.color);
    });
  }, [chartConfig]);

  const handleSelectionChange = (newSelection: React.SetStateAction<string[]>) => {
    setSelectedChains(newSelection);
  };


  const handleDateRangeSelect = (range: DateRange | undefined) => {
    setTempDateRange(range);
  };

  const handleCalendarClose = () => {
    setDateRange(tempDateRange);
    setIsCalendarOpen(false);
  };

  const handleCalendarCancel = () => {
    setTempDateRange(dateRange);
    setIsCalendarOpen(false);
  };

  const disabledDays = { after: new Date() };

  const getQoSColor = (score: number) => {
    if (score >= 0.99) return '#00ff00'; // Green for very good scores
    if (score >= 0.97) return '#ffff00'; // Yellow for okay scores
    return '#ff0000'; // Red for bad scores
  };

  const CustomTooltip = ({ active, payload, label }: { active: boolean, payload: any[], label: string }) => {
    if (active && payload && payload.length) {
      const qosScore = payload.find(p => p.dataKey === 'qos')?.value;
      return (
        <Card className="p-2">
          <CardHeader className="p-2">
            <CardTitle className="text-sm">{new Date(label).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <p className="font-semibold text-sm">
              <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ backgroundColor: getQoSColor(qosScore) }}></span>
              QoS Score: {qosScore?.toFixed(4)}
            </p>
            {selectedChains.map((chain) => (
              <p key={chain} className="text-sm">
                <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ backgroundColor: chartConfig[chain]?.color }}></span>
                {chain}: <span className="font-mono">{payload.find(p => p.dataKey === chain)?.value?.toLocaleString().padStart(10)}</span>
              </p>
            ))}
            <p className="font-semibold text-sm mt-2">
              Total Relays: <span className="font-mono">{payload.find(p => p.dataKey === selectedChains[0])?.payload?.totalRelays?.toLocaleString().padStart(10)}</span>
            </p>

          </CardContent>
        </Card>
      )
    }
    return null
  }

  const renderLegend = (props: any) => {
    const { payload } = props;
    return (
      <div className="flex flex-wrap justify-center gap-4 text-sm">
        {payload.map((entry: { color: any; value: any }, index: any) => (
          <div key={`item-${index}`} className="flex items-center">
            <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }}></span>
            <span>{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  if (error) return <div>Failed to load data</div>;
  if (!data) return <UsageGraphSkeleton />;

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center gap-2 space-y-0 pb-4 sm:pb-2">
        <div className="space-y-1">
          <CardTitle>QoS Score and Selected Chains</CardTitle>
          <CardDescription>
            Showing QoS score and relay counts for selected chains
          </CardDescription>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:ml-auto">
          <CustomCombobox
            availableChains={availableChains || []}
            selectedChains={selectedChains || []}
            onSelectionChange={handleSelectionChange}
          />
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-[300px] justify-start text-left font-normal",
                  !dateRange && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} -{" "}
                      {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={tempDateRange?.from}
                selected={tempDateRange}
                onSelect={handleDateRangeSelect}
                numberOfMonths={2}
                disabled={disabledDays}
                toDate={new Date()}
              />
              <div className="flex justify-end gap-2 p-3">
                <Button
                  variant="outline"
                  onClick={handleCalendarCancel}
                >
                  Cancel
                </Button>
                <Button onClick={handleCalendarClose}>
                  Apply
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full">
          {error ? (
            <div>Error loading data</div>
          ) : chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <defs>
                  <linearGradient id="qosGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00ff00" stopOpacity={0.8} />
                    <stop offset="50%" stopColor="#ffff00" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#ff0000" stopOpacity={0.8} />
                  </linearGradient>
                  {Object.entries(chartConfig).map(([key, value]) => (
                    <linearGradient key={key} id={`fill${key}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={`var(--${key}-color)`} stopOpacity={0.8} />
                      <stop offset="95%" stopColor={`var(--${key}-color)`} stopOpacity={0.1} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={(value) => {
                    const date = new Date(value)
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  className="text-muted-foreground text-xs"
                />
                <YAxis yAxisId="left" orientation="left" tick={true} className="text-muted-foreground text-xs" />
                <YAxis yAxisId="right" orientation="right" tick={true} domain={[0, 1]} className="text-muted-foreground text-xs" />
                <Tooltip content={<CustomTooltip active={false} payload={[]} label={""} />} />
                <Legend content={renderLegend} />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="qos"
                  stroke="url(#qosGradient)"
                  strokeWidth={2}
                  dot={false}
                />
                {selectedChains.map((chain) => (
                  <Area
                    key={chain}
                    yAxisId="left"
                    type="monotone"
                    dataKey={chain}
                    stroke={`var(--${chain}-color)`}
                    fill={`url(#fill${chain})`}
                    stackId="1"
                  />
                ))}
                <Brush
                  dataKey="date"
                  height={30}
                  stroke="hsl(var(--muted-foreground) / 0.3)"
                  tickFormatter={(value) => {
                    const date = new Date(value)
                    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
                  }}
                  fill="hsl(var(--background))"
                  travellerWidth={10}
                >
                  <AreaChart>
                    <Area
                      type="monotone"
                      dataKey="totalRelays"
                      stroke="hsl(var(--muted-foreground))"
                      fill="hsl(var(--muted))"
                      fillOpacity={0.4}
                    />
                  </AreaChart>
                </Brush>
              </ComposedChart>
            </ResponsiveContainer>
          ) : (
            <div>No data available for the selected date range</div>
          )}
        </div>
        {isValidating && (
          <div className="text-center mt-2 text-sm text-muted-foreground">
            Updating data...
          </div>
        )}
      </CardContent>
    </Card>
  );
}
