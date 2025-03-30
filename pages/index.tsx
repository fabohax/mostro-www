'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Header from '@/components/header';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const paymentMethods = [
  'Mercado Pago',
  'Lemon Cash',
  'Galicia',
  'Binance Pay',
  'Payoneer',
  'Revolut',
  'Wise'
]

const currencies = ['ARS', 'USD', 'EUR', 'BRL', 'CLP', 'MXN']

export default function Home() {
  const [alerts, setAlerts] = useState([
    { id: 1, type: 'success', message: 'Order placed successfully!' },
    { id: 2, type: 'error', message: 'Failed to connect to relay.' },
  ])

  const dismissAlert = (id: number) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  const [selectedTab, setSelectedTab] = useState('buy')
  const [priceType, setPriceType] = useState('market')
  const [currency, setCurrency] = useState('ARS')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [customPrice, setCustomPrice] = useState('')

  const handleOrder = () => {
    console.log({ selectedTab, priceType, currency, paymentMethod })
  }
  

  return (
    <div className="min-h-screen bg-[#101010] text-white p-0 font-mono space-y-6">
        <Header/>
      {/* Alerts */}
      <div className="space-y-2 hidden">
        {alerts.map((alert) => (
          <Alert
            key={alert.id}
            variant={alert.type === 'error' ? 'destructive' : 'default'}
            className="bg-neutral-900 border"
          >
            <AlertDescription className="flex justify-between items-center">
              <span>{alert.message}</span>
              <Button
                size="sm"
                variant="ghost"
                className="text-xs text-muted-foreground hover:text-white"
                onClick={() => dismissAlert(alert.id)}
              >
                ✕
              </Button>
            </AlertDescription>
          </Alert>
        ))}
      </div>

      {/* Buy/Sell Panel */}
      <Card className="bg-neutral-900 border border-neutral-700 max-w-md mx-auto shadow-lg my-8">
      <CardContent className="px-6 space-y-4 py-6">
        <Tabs defaultValue="buy" value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid grid-cols-2 bg-neutral-800 w-full">
            <TabsTrigger value="buy" className={selectedTab === 'buy' ? 'bg-white text-black' : 'text-white'}>
              BUY
            </TabsTrigger>
            <TabsTrigger value="sell" className={selectedTab === 'sell' ? 'bg-white text-black' : 'text-white'}>
              SELL
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-4 text-white text-center text-4xl tracking-widest py-6 border border-neutral-700 rounded-lg bg-neutral-800">
          <Input
            type="number"
            placeholder="100 000"
            className="col-span-3 bg-transparent border-none outline-none ring-0 focus:outline-none focus:ring-0 focus-visible:ring-0"
            />
          <div className="flex items-center justify-center text-sm">
            SAT
          </div>
        </div>

        <div className="flex justify-between items-center text-white text-sm border border-neutral-700 rounded-md px-4 py-2 bg-neutral-800">
          <Select value={priceType} onValueChange={setPriceType}>
            <SelectTrigger className="bg-transparent text-white px-0 border-none outline-none ring-0 focus:outline-none focus:ring-0 focus-visible:ring-0">
              <SelectValue placeholder="Price" />
            </SelectTrigger>
            <SelectContent className="bg-neutral-900 border-neutral-700 border-none outline-none ring-0 focus:outline-none focus:ring-0 focus-visible:ring-0">
              <SelectItem value="market" className="text-white focus:bg-neutral-800 focus:text-lime-400 hover:bg-neutral-800 ">MARKET PRICE</SelectItem>
              <SelectItem value="custom" className="text-white focus:bg-neutral-800 focus:text-lime-400 hover:bg-neutral-800">CUSTOM PRICE</SelectItem>
            </SelectContent>
          </Select>

          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger className="bg-transparent text-white px-0 border-none outline-none ring-0 focus:outline-none focus:ring-0 focus-visible:ring-0">
              <SelectValue placeholder="Currency" />
            </SelectTrigger>
            <SelectContent className="bg-neutral-900 border border-neutral-700 text-white border-none outline-none ring-0 focus:outline-none focus:ring-0 focus-visible:ring-0">
              {currencies.map((cur) => (
                <SelectItem
                  key={cur}
                  value={cur}
                  className="text-white focus:bg-neutral-800 focus:text-lime-400 hover:bg-neutral-800"
                >
                  {cur}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {priceType === 'custom' && (
          <Input
            type="number"
            placeholder="Enter custom price"
            value={customPrice}
            onChange={(e) => setCustomPrice(e.target.value)}
            className="w-full bg-neutral-800 border border-neutral-700 text-white px-4 py-2 rounded-md"
          />
        )}

        <Select value={paymentMethod} onValueChange={setPaymentMethod}>
          <SelectTrigger className="w-full bg-neutral-800 border border-neutral-700 text-white outline-none ring-0 focus:outline-none focus:ring-0 focus-visible:ring-0">
            <SelectValue placeholder="▼ PAYMENT METHOD" />
          </SelectTrigger>
          <SelectContent className="bg-neutral-900 border-neutral-700 border-none outline-none ring-0 focus:outline-none focus:ring-0 focus-visible:ring-0">
            {paymentMethods.map((method) => (
              <SelectItem key={method} value={method} className="text-white border-none outline-none ring-0 focus:outline-none focus:ring-0 focus-visible:ring-0">{method}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          onClick={handleOrder}
          className="w-full bg-lime-500 hover:bg-lime-600 text-black font-bold tracking-wide py-6 cursor-pointer"
        >
          ORDER
        </Button>
      </CardContent>
    </Card>
    </div>
  );
}
