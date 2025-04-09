
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import OrderHistory from "@/components/OrderHistory";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

const OrdersPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Redirect if not logged in
    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "Please log in to view your orders.",
        variant: "destructive"
      });
      navigate("/login");
      return;
    }
    setIsLoading(false);
  }, [currentUser, navigate, toast]);

  if (isLoading) return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-100 dark:bg-gray-700 rounded w-1/4"></div>
            <div className="h-40 bg-gray-100 dark:bg-gray-700 rounded"></div>
            <div className="h-40 bg-gray-100 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    </Layout>
  );

  if (!currentUser) return null;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-8">
            <button
              onClick={() => navigate(-1)}
              className="mr-4 text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-3xl font-bold">Your Orders</h1>
          </div>

          <OrderHistory />
        </div>
      </div>
    </Layout>
  );
};

export default OrdersPage;
