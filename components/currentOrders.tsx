'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';

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
  const [relayStatus, setRelayStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');

  useEffect(() => {
    const RELAY = process.env.NEXT_PUBLIC_RELAY_URL;

    if (!RELAY) {
      console.error('Relay URL is not defined');
      setRelayStatus('error');
      return;
    }

    const socket = new WebSocket(RELAY);

    socket.onopen = () => {
      console.log('[Relay] Connected ✅');
      setRelayStatus('connected');

      const req = [
        'REQ',
        'mostro-orders',
        {
          kinds: [38383],
          limit: 20
        }
      ];

      socket.send(JSON.stringify(req));
      console.log('[Relay] Request sent:', req);
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data[0] === 'EVENT' && data[2]?.kind === 38383) {
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
      setRelayStatus('error');
    };

    socket.onclose = () => {
      console.log('[Relay] Connection closed ❎');
    };

    return () => socket.close();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto text-white space-y-4">
      <h2 className="text-xl font-bold mb-4">Live Orders</h2>

      {relayStatus === 'connecting' && (
        <div className="flex items-center justify-center py-12">
          <Image src="/loading.gif" alt="Loading..." width={36} height={36} />
        </div>
      )}

      {orders.length === 0 && relayStatus === 'connected' && (
        <p className="text-gray-400">No open orders found from Mostro daemon.</p>
      )}

      {orders.map((order, index) => (
        <Card key={`${order.id}-${index}`} className="bg-neutral-900 border border-neutral-700">
          <CardContent className="p-4 text-sm font-mono text-white">
            <div className="text-lime-400 font-bold mb-2">Raw JSON Event</div>
            <pre className="whitespace-pre-wrap break-words">{JSON.stringify(order, null, 2)}</pre>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
