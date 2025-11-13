import type { Order } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Clock, Tag, Hash, Utensils, User } from 'lucide-react';
import { outlets } from '@/lib/data';
import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';

type OrderCardProps = {
  order: Order;
  isStaffView?: boolean;
};

const statusVariants = cva('capitalize', {
    variants: {
      status: {
        pending: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/40',
        accepted: 'bg-blue-500/20 text-blue-500 border-blue-500/40',
        preparing: 'bg-primary/20 text-primary border-primary/40',
        ready: 'bg-green-500/20 text-green-500 border-green-500/40',
        completed: 'bg-gray-500/20 text-gray-500 border-gray-500/40',
        cancelled: 'bg-destructive/20 text-destructive border-destructive/40',
      },
    },
    defaultVariants: {
      status: 'pending',
    },
});

export default function OrderCard({ order, isStaffView = false }: OrderCardProps) {
  const outlet = outlets.find(o => o.id === order.outletId);
  const timeAgo = Math.round((new Date().getTime() - new Date(order.createdAt).getTime()) / (1000 * 60));

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="font-headline text-xl flex items-center gap-2">
                    <Tag className="h-5 w-5 text-primary" />
                    {order.orderNumber}
                </CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1">
                    <Hash className="h-4 w-4" />
                    Token {order.tokenNumber}
                </CardDescription>
            </div>
          <Badge variant="outline" className={cn(statusVariants({ status: order.status }))}>
            {order.status}
          </Badge>
        </div>
        {isStaffView ? (
           <div className="flex items-center gap-2 pt-2 text-sm text-muted-foreground">
             <User className="h-4 w-4" /> <span>{order.clientName} ({order.clientId})</span>
           </div>
        ) : outlet && (
            <div className="flex items-center gap-2 pt-2 text-sm text-muted-foreground">
                <Utensils className="h-4 w-4" /> {outlet.name}
            </div>
        )}
      </CardHeader>
      <CardContent className="flex-grow space-y-2">
        <ul className="text-sm space-y-1">
            {order.items.map(item => (
                <li key={item.menuItem.id} className="flex justify-between">
                    <span>{item.menuItem.name} <span className="text-muted-foreground">x{item.quantity}</span></span>
                    <span>₹{(item.menuItem.priceInr * item.quantity).toFixed(2)}</span>
                </li>
            ))}
        </ul>
        <Separator />
        <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>₹{order.totalAmountInr.toFixed(2)}</span>
        </div>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground flex justify-between">
        <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{timeAgo} mins ago</span>
        </div>
        {!isStaffView && <p>ETA: ~{order.estimatedWaitTime} mins</p>}
      </CardFooter>
    </Card>
  );
}
