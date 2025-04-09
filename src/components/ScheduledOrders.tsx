
import React, { useState } from "react";
import { Clock, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface ScheduledOrder {
  id: string;
  shop: string;
  items: { name: string; quantity: number }[];
  scheduledFor: Date;
  total: number;
}

const ScheduledOrders: React.FC = () => {
  const [scheduledOrders, setScheduledOrders] = useState<ScheduledOrder[]>([
    {
      id: "sched-001",
      shop: "Pizza Paradise",
      items: [
        { name: "Margherita Pizza", quantity: 1 },
        { name: "Garlic Bread", quantity: 1 }
      ],
      scheduledFor: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      total: 18.98
    }
  ]);
  const { toast } = useToast();

  const cancelScheduledOrder = (id: string) => {
    setScheduledOrders(scheduledOrders.filter(order => order.id !== id));
    toast({
      title: "Order Cancelled",
      description: "Your scheduled order has been cancelled"
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Scheduled Orders</h3>

      {scheduledOrders.length > 0 ? (
        <div className="space-y-4">
          {scheduledOrders.map((order) => (
            <div key={order.id} className="rounded-lg border overflow-hidden">
              <div className="bg-gray-50 dark:bg-gray-900 p-3 flex justify-between items-center">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                  <span className="font-medium">
                    {format(order.scheduledFor, "PPP")} at {format(order.scheduledFor, "p")}
                  </span>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">#{order.id}</span>
              </div>
              <div className="p-3">
                <h4 className="font-medium">{order.shop}</h4>
                <ul className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {order.items.map((item, index) => (
                    <li key={index}>
                      {item.quantity} × {item.name}
                    </li>
                  ))}
                </ul>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-semibold">${order.total.toFixed(2)}</span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => cancelScheduledOrder(order.id)}
                    className="text-red-500 border-red-500 hover:bg-red-50 dark:hover:bg-red-950"
                  >
                    Cancel Order
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6">
          <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
            <Calendar className="h-6 w-6 text-gray-400" />
          </div>
          <h4 className="text-lg font-medium mb-2">No scheduled orders</h4>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            You don't have any upcoming scheduled orders
          </p>
          <Button onClick={() => window.location.href = "/shops"}>
            Order Now
          </Button>
        </div>
      )}
    </div>
  );
};

export default ScheduledOrders;
