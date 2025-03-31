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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const socket = new WebSocket('wss://relay.mostro.network');

    socket.onopen = () => {
      console.log('[Relay] Connected ✅');

      const filter = {
        kinds: [23196],
        limit: 20
      };

      const req = ['REQ', 'current-orders', filter];
      socket.send(JSON.stringify(req));
      console.log('[Relay] Request sent:', req);
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data[0] === 'EVENT' && data[2]?.kind === 23196) {
          console.log('[Relay] Event received:', data[2]);
          setOrders((prev) => [...prev, data[2]]);
        } else if (data[0] === 'EOSE') {
          setLoading(false);
          console.log('[Relay] End of stored events');
        } else {
          console.log('[Relay] Message skipped:', data);
        }
      } catch (error) {
        console.error('[Relay] Message parsing error:', error);
      }
    };

    socket.onerror = (err) => {
      console.error('[Relay] Error ❌', err);
    };

    socket.onclose = () => {
      console.log('[Relay] Connection closed ❎');
    };

    return () => socket.close();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto text-white space-y-4">
      <h2 className="text-xl font-bold mb-4">Open Orders ({orders.length})</h2>

      {loading && <Skeleton className="h-24 w-full bg-neutral-800" />}

      {orders.length === 0 && !loading && (
        <p className="text-gray-400 text-sm">No open orders found.</p>
      )}

      {orders.map((order) => {
        let parsed;
        try {
          parsed = JSON.parse(order.content);
        } catch {
          console.warn('Invalid JSON in order:', order);
          return null;
        }

        return (
          <Card key={order.id} className="bg-neutral-900 border border-neutral-700">
            <CardContent className="p-4 space-y-1">
              <p><strong>Type:</strong> {parsed.type}</p>
              <p><strong>Amount:</strong> {parsed.amount}</p>
              <p><strong>Fiat:</strong> {parsed.fiat_code}</p>
              <p><strong>Method:</strong> {parsed.payment_method}</p>
              <div className="mt-2">
                <a
                  href={`/order/${order.id}`}
                  className="text-lime-400 underline text-sm"
                >
                  View Order
                </a>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
