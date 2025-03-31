'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface MostroOrderEvent {
  id: string;
  kind: number;
  content: string;
  tags: string[][];
  created_at: number;
  pubkey: string;
  sig: string;
}

export default function CurrentOrders() {
  const [orders, setOrders] = useState<MostroOrderEvent[]>([]);
  const [relayStatus, setRelayStatus] = useState<'connecting' | 'connected' | 'error'>('connecting')
  const [loading] = useState(true);

  useEffect(() => {
    const RELAY = process.env.NEXT_PUBLIC_RELAY_URL 
    if (!RELAY) {
      console.error('Relay URL is not defined')
      setRelayStatus('error')
      return
    }
    const socket = new WebSocket(RELAY);

    socket.onopen = () => {
      console.log('[Relay] Connected ✅');

      const filter = {
        kinds: [38383], // Kind used by Mostro to publish new orders
        limit: 20
      };

      const req = ['REQ', 'mostro-orders', filter];
      socket.send(JSON.stringify(req));
      console.log('[Relay] Request sent:', req);
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data[0] === 'EVENT' && data[2]?.kind === 23195) {
          console.log('[Relay] Mostro Order:', data[2]);
          setOrders((prev) => [...prev, data[2]]);
        } else {
          console.log('[Relay] Skipped:', data);
        }
      } catch (error) {
        console.error('[Relay] Error parsing:', error);
      }
    };

    socket.onerror = (err) => {
      console.error('[Relay] Connection error ❌', err);
    };

    socket.onclose = () => {
      console.log('[Relay] Connection closed ❎');
    };

    return () => socket.close();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto text-white space-y-4">
      <h2 className="text-xl font-bold mb-4">Live Mostro Orders</h2>

      {loading && <Skeleton className="h-24 w-full bg-neutral-800" />}

      {orders.map(order => {
        let parsed;
        try {
          parsed = JSON.parse(order.content);
        } catch {
          console.warn('Invalid order content:', order);
          return null;
        }

        return (
          <Card key={order.id} className="bg-neutral-900 border border-neutral-700">
            <CardContent className="p-4 space-y-1">
              <p><strong>Type:</strong> {parsed.type}</p>
              <p><strong>Amount:</strong> {parsed.amount}</p>
              <p><strong>Fiat:</strong> {parsed.fiat_code}</p>
              <p><strong>Method:</strong> {parsed.payment_method}</p>
              <p className="mt-2">
                <a
                  href={`/order/${order.id}`}
                  className="text-lime-400 underline text-sm"
                >
                  View Order
                </a>
              </p>
            </CardContent>
            <div className="bg-neutral-900 border border-neutral-700 p-4 rounded text-sm mt-8">
              <p className="text-lime-400">Relay Status: {relayStatus}</p>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
