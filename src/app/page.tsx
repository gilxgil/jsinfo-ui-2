"use client";

import React, { useState, useMemo, useEffect } from "react";
import useSWR from 'swr';
import Link from "next/link"
import {
  Activity,
  ArrowUpRight,
  CreditCard,
  DollarSign,
  Menu,
  Package2,
  Search,
  Users,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { UsageGraph } from "@/components/usage-graph"
import { Toggle } from "@/components/ui/toggle"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import ProvidersTable from "@/components/providers-table"
import ChainsTable from "@/components/chains-table";

export default function Home() {
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [currency, setCurrency] = useState('USD');

  useEffect(() => {
    const timer = setInterval(() => {
      setLastUpdate(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const toggleCurrency = () => {
    setCurrency(prev => prev === 'USD' ? 'LAVA' : 'USD');
  };

  const formatLastUpdate = (date: any) => {
    const diff = Math.floor((new Date() - date) / 60000);
    return `Last update ${diff} minute${diff !== 1 ? 's' : ''} ago`;
  };

  return (
    <div className="flex min-h-screen mx-auto max-w-screen-2xl flex-col">

      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link
            href="#"
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
          >
            <Package2 className="h-6 w-6" />
            <span className="sr-only">Acme Inc</span>
          </Link>
          <Link
            href="#"
            className="text-foreground transition-colors hover:text-foreground"
          >
            Dashboard
          </Link>
          <Link
            href="#"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Pools
          </Link>
          <Link
            href="#"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Providers
          </Link>
          <Link
            href="#"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Chains
          </Link>
          <Link
            href="#"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Consumers
          </Link>
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="grid gap-6 text-lg font-medium">
              <Link
                href="#"
                className="flex items-center gap-2 text-lg font-semibold"
              >
                <Package2 className="h-6 w-6" />
                <span className="sr-only">Acme Inc</span>
              </Link>
              <Link href="#" className="hover:text-foreground">
                Dashboard
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                Orders
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                Products
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                Customers
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                Analytics
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <Badge variant="outline">Last update 5 minutes ago</Badge>

          <form className="ml-auto flex-1 sm:flex-initial">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
              />
            </div>
          </form>


          <Toggle variant="outline" aria-label="Toggle italic">
            <DollarSign className="h-4 w-4" />
          </Toggle>

        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex justify-between items-center">
          <Badge variant="outline">{formatLastUpdate(lastUpdate)}</Badge>
          <Toggle variant="outline" aria-label="Toggle currency" pressed={currency === 'LAVA'} onPressedChange={toggleCurrency}>
            {currency === 'USD' ? <DollarSign className="h-4 w-4" /> : 'LAVA'}
          </Toggle>
        </div>

        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <Card x-chunk="dashboard-01-chunk-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Relays
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45,231,000</div>
              <p className="text-xs text-muted-foreground">
                +20.1% from last month
              </p>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Providers
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+2350</div>
              <p className="text-xs text-muted-foreground">
                +180.1% from last month
              </p>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Chains</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">30</div>
              <p className="text-xs text-muted-foreground">
                +19% from last month
              </p>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-3">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Rewards</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$573</div>
              <p className="text-xs text-muted-foreground">
                +20% since last hour
              </p>
            </CardContent>
          </Card>
        </div>

        <UsageGraph />


        <div className="grid gap-4 md:gap-8">
          <Card
            className="xl:col-span-2" x-chunk="dashboard-01-chunk-4"
          >
            <CardHeader className="flex flex-row items-center">
              <div className="grid gap-2">
                <CardTitle>Incentive Pools</CardTitle>
                <CardDescription>
                  Recent transactions from your store.
                </CardDescription>
              </div>
              <Button asChild size="sm" className="ml-auto gap-1">
                <Link href="#">
                  View All
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>

            <CardContent>
              <Carousel>
                <CarouselContent>
                  <CarouselItem className="basis-1/4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardDescription>August 2024</CardDescription>
                        <CardTitle className="text-4xl">$1,329</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-xs text-muted-foreground">25 participating providers</div>
                      </CardContent>
                      <CardFooter>
                        <Progress value={50} aria-label="25 participating providers" />
                      </CardFooter>
                    </Card>
                  </CarouselItem>

                  <CarouselItem className="basis-1/4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardDescription>August 2024</CardDescription>
                        <CardTitle className="text-4xl">$1,329</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-xs text-muted-foreground">25 participating providers</div>
                      </CardContent>
                      <CardFooter>
                        <Progress value={50} aria-label="25 participating providers" />
                      </CardFooter>
                    </Card>
                  </CarouselItem>


                  <CarouselItem className="basis-1/4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardDescription>August 2024</CardDescription>
                        <CardTitle className="text-4xl">$1,329</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-xs text-muted-foreground">25 participating providers</div>
                      </CardContent>
                      <CardFooter>
                        <Progress value={50} aria-label="25 participating providers" />
                      </CardFooter>
                    </Card>
                  </CarouselItem>

                  <CarouselItem className="basis-1/4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardDescription>August 2024</CardDescription>
                        <CardTitle className="text-4xl">$1,329</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-xs text-muted-foreground">25 participating providers</div>
                      </CardContent>
                      <CardFooter>
                        <Progress value={50} aria-label="25 participating providers" />
                      </CardFooter>
                    </Card>
                  </CarouselItem>

                  <CarouselItem className="basis-1/4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardDescription>August 2024</CardDescription>
                        <CardTitle className="text-4xl">$1,329</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-xs text-muted-foreground">25 participating providers</div>
                      </CardContent>
                      <CardFooter>
                        <Progress value={50} aria-label="25 participating providers" />
                      </CardFooter>
                    </Card>
                  </CarouselItem>


                </CarouselContent>

                <CarouselPrevious />
                <CarouselNext />
              </Carousel>

            </CardContent>
          </Card>
        </div>


        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-4">
          <Card className="xl:col-span-2">
            <CardHeader className="flex flex-row items-center">
              <div className="grid gap-2">
                <CardTitle>Providers</CardTitle>
                <CardDescription>
                  Recent provider statistics.
                </CardDescription>
              </div>
              <Button asChild size="sm" className="ml-auto gap-1">
                <Link href="#">
                  View All
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <ProvidersTable />
            </CardContent>
          </Card>

          <Card
            className="xl:col-span-2" x-chunk="dashboard-01-chunk-4"
          >
            <CardHeader className="flex flex-row items-center">
              <div className="grid gap-2">
                <CardTitle>Chains</CardTitle>
                <CardDescription>
                  Recent transactions from your store.
                </CardDescription>
              </div>
              <Button asChild size="sm" className="ml-auto gap-1">
                <Link href="#">
                  View All
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <ChainsTable />
            </CardContent>
          </Card>
        </div>
      </main>
      <footer className="flex items-center justify-center h-16 border-t bg-background px-4 md:px-6">
        <span className="text-sm text-muted-foreground">
          © 2023 Acme Inc. All rights reserved.
        </span>
        <span className="ml-auto text-sm text-muted-foreground">
          Made with ❤️ by Magma Devs
        </span>
      </footer>
    </div>
  )
}
