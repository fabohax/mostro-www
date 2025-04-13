'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/header';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMostroOrder, MostroOrderStatus, MostroOrderPreview, MostroRelayResponse} from '@/hooks/useMostroOrder'
import { toast } from 'sonner';
import currenciesData from '@/data/currencies.json';
import paymentMethodsData from '@/data/payment_methods.json';
import CurrentOrders from '@/components/currentOrders'

export default function Home() {
  const router = useRouter();
  const [eventId, setEventId] = useState<string | null>(null);

  const [selectedTab, setSelectedTab] = useState('buy');
  const [priceType, setPriceType] = useState('market');
  const [currency, setCurrency] = useState('ARS');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [customPrice, setCustomPrice] = useState('');
  const [amount, setAmount] = useState('');

  const { sendOrder, status, latestOrder, relayResponse } = useMostroOrder()

  useEffect(() => {
    const npub = localStorage.getItem('nostr-npub');
    if (!npub) {
      router.push('/auth');
    }
  }, [router]);

  const handleOrder = async () => {
    const npub = localStorage.getItem('nostr-npub');
    const privkey = localStorage.getItem('nostr-privkey');

    if (!npub || !privkey) {
      toast.error('You must be logged in to place an order');
      return;
    }

    const order = {
      type: selectedTab,
      amount: parseInt(amount || '0'),
      fiat_code: currency,
      payment_method: paymentMethod,
      premium: priceType === 'custom' ? parseFloat(customPrice || '0') : 0
    };

    console.log('Sending order:', order);

    try {
      const newEventId = await sendOrder(order);

      if (typeof newEventId !== 'string' || !newEventId) {
        toast.error('Failed to get event ID');
        return;
      }

      setEventId(newEventId);
      toast.success('Order sent to relay', {
        description: 'Your order was successfully published',
        className: 'bg-black border border-lime-400 text-white'
      });

      localStorage.setItem('currentOrder', JSON.stringify(order));

      setTimeout(() => {
        router.push(`/order/${newEventId}`);
      }, 1000);

    } catch (error) {
      console.error('Order error:', error);
      toast.error('Failed to send order');
    }
  };

  return (
    <div className="h-full bg-[#101010] text-white p-0 font-mono space-y-6 py-20">
      <Header />

      <Card className="bg-neutral-900 border border-neutral-700 max-w-md mx-auto shadow-lg my-8">
        <CardContent className="px-6 space-y-4 py-6">
          <Tabs defaultValue="buy" value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid grid-cols-2 bg-neutral-800 w-full">
              <TabsTrigger value="buy" className={selectedTab === 'buy' ? 'bg-[#fff] text-foreground cursor-pointer' : 'text-white cursor-pointer select-none'}>
                BUY
              </TabsTrigger>
              <TabsTrigger value="sell" className={selectedTab === 'sell' ? 'bg-white text-foreground cursor-pointer' : 'text-white cursor-pointer select-none'}>
                SELL
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="grid grid-cols-4 text-white text-center tracking-widest py-6 border border-neutral-700 rounded-lg bg-neutral-800">
            <Input
              type="number"
              placeholder="100 000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-4xl col-span-3 bg-transparent border-none outline-none ring-0 focus:outline-none focus:ring-0 focus-visible:ring-0"
              />
            <div className="flex items-center justify-center text-xl">
              SAT
            </div>
          </div>

          <div className="flex justify-between items-center text-white text-sm border border-neutral-700 rounded-md px-4 py-2 bg-neutral-800">
            <Select value={priceType} onValueChange={setPriceType}>
              <SelectTrigger className="bg-transparent text-white px-0 border-none outline-none ring-0 focus:outline-none focus:ring-0 focus-visible:ring-0">
                <SelectValue placeholder="Price" />
              </SelectTrigger>
              <SelectContent className="bg-neutral-900 border-neutral-700 text-white">
                <SelectItem value="market">MARKET PRICE</SelectItem>
                <SelectItem value="custom">CUSTOM PRICE</SelectItem>
              </SelectContent>
            </Select>

            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger className="bg-transparent text-white px-0 border-none outline-none ring-0 focus:outline-none focus:ring-0 focus-visible:ring-0">
                <SelectValue placeholder="Currency" />
              </SelectTrigger>
              <SelectContent className="bg-neutral-900 border border-neutral-700 text-white">
                {currenciesData.map((cur) => (
                  <SelectItem key={cur} value={cur}>{cur}</SelectItem>
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
            <SelectTrigger className="w-full bg-neutral-800 border border-neutral-700 text-white">
              <SelectValue placeholder="▼ PAYMENT METHOD" />
            </SelectTrigger>
            <SelectContent className="bg-neutral-900 border-neutral-700 text-white">
              {paymentMethodsData.map((method) => (
                <SelectItem key={method} value={method}>{method}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            onClick={handleOrder}
            className="w-full bg-lime-500 hover:bg-lime-600 text-black font-bold tracking-wide py-6 cursor-pointer"
          >
            ORDER
          </Button>

          {eventId && (
            <div className="text-xs text-center break-all text-gray-400">
              ID: <a href={`/order/${eventId}`} className="underline text-lime-400">{eventId}</a>
            </div>
          )}

          <MostroOrderStatus status={status} />
          <MostroOrderPreview order={latestOrder} />
          <MostroRelayResponse response={relayResponse} />
        </CardContent>
        <div>
          <CurrentOrders />
        </div>
      </Card>
    </div>
  );
}
