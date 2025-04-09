
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getUserOrders } from "@/services/orderService";
import { Order } from "@/types/order";
import OrderCard from "@/components/OrderCard";
import { Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";

const OrderHistory = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("all");
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchOrders = async () => {
      if (!currentUser || !currentUser.id) return;
      
      setIsLoading(true);
      try {
        const userId = currentUser._id || currentUser.id;
        console.log("Fetching orders for user ID:", userId);
        const fetchedOrders = await getUserOrders(userId);
        console.log("Fetched orders:", fetchedOrders);
        
        // Make sure we only show orders for the current user
        const userOrders = fetchedOrders.filter(order => {
          const customerId = typeof order.customer === 'string' 
            ? order.customer 
            : order.customer._id || order.customer.id;
          
          return customerId === userId;
        });
        
        setOrders(userOrders);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load your order history. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrders();
  }, [currentUser, toast]);
  
  // Filter orders based on active tab
  const filteredOrders = orders.filter(order => {
    if (activeTab === "all") return true;
    if (activeTab === "active") 
      return ["pending", "confirmed", "preparing", "ready"].includes(order.status);
    if (activeTab === "delivered") 
      return order.status === "delivered";
    if (activeTab === "cancelled") 
      return order.status === "cancelled";
    return true;
  });
  
  if (isLoading) {
    return (
      <div className="w-full">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-100 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="h-40 bg-gray-100 dark:bg-gray-700 rounded"></div>
          <div className="h-40 bg-gray-100 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {orders.length > 0 ? (
        <div>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="all">All Orders</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="delivered">Delivered</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="space-y-6">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <OrderCard key={order._id || order.id} order={order} />
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 dark:text-gray-400">
                    No {activeTab === "all" ? "" : activeTab} orders found
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-6">
            <Package className="h-12 w-12 text-gray-400" />
          </div>
          
          <h2 className="text-2xl font-semibold mb-2">No orders yet</h2>
          
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
            You haven't placed any orders yet. Start browsing our shops to find your favorite food!
          </p>
          
          <Button onClick={() => navigate("/shops")} className="bg-black hover:bg-gray-800 text-white dark:bg-gray-700 dark:hover:bg-gray-600">
            Browse Shops
          </Button>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
