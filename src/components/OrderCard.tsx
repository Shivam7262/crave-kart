
import { useState } from "react";
import { ChevronDown, ChevronUp, Clock, Package } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Order } from "@/types/order";
import { formatDistanceToNow } from "date-fns";

interface OrderCardProps {
  order: Order;
}

const OrderCard = ({ order }: OrderCardProps) => {
  const [expanded, setExpanded] = useState(false);
  
  // Format date
  const orderDate = new Date(order.createdAt);
  const formattedDate = orderDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  
  const timeDistance = formatDistanceToNow(orderDate, { addSuffix: true });
  
  // Extract shop name
  const shopName = typeof order.shop === 'string' 
    ? 'Unknown Shop' 
    : order.shop.name;
  
  // Format status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "confirmed":
      case "preparing":
      case "ready":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };
  
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "delivered":
        return "Delivered";
      case "cancelled":
        return "Cancelled";
      case "pending":
        return "Pending";
      case "confirmed":
        return "Confirmed";
      case "preparing":
        return "Preparing";
      case "ready":
        return "Ready for Pickup";
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border overflow-hidden transition-all">
      <div className="p-6">
        <div className="flex flex-wrap items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Order #{order._id || order.id}
              </p>
              <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {timeDistance}
              </span>
            </div>
            <h3 className="font-semibold text-lg mt-1">
              {shopName}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {formattedDate}
            </p>
          </div>
          
          <div className="flex flex-col items-end">
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(order.status)}`}
            >
              {getStatusDisplay(order.status)}
            </span>
            
            <span className="mt-2 font-semibold">
              ₹{order.totalAmount.toFixed(2)}
            </span>
          </div>
        </div>
        
        <Separator className="my-4" />
        
        {expanded ? (
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Items:</p>
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between">
                <span>
                  {item.quantity} × {item.foodItem.name}
                </span>
                <span className="font-medium">
                  ₹{(item.foodItem.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
            
            <div className="pt-3">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Delivered to:</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{order.address}</p>
            </div>
            
            <div className="pt-3">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Payment:</p>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {order.paymentMethod?.toUpperCase() || 'Card'} • {order.paymentStatus}
                </span>
                <span className={`text-sm ${order.paymentStatus === 'paid' ? 'text-green-500' : 'text-yellow-500'}`}>
                  {order.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">
              {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
            </span>
            <span className="font-medium">
              View Details
            </span>
          </div>
        )}
      </div>
      
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center transition-colors"
      >
        {expanded ? (
          <>
            <ChevronUp className="h-5 w-5 mr-1" />
            Show Less
          </>
        ) : (
          <>
            <ChevronDown className="h-5 w-5 mr-1" />
            Show Details
          </>
        )}
      </button>
    </div>
  );
};

export default OrderCard;
