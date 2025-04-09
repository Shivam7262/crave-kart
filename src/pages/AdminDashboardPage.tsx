
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Check, X, FileText, Eye, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import * as shopService from "@/services/shopService";
import { Badge } from "@/components/ui/badge";
import ShopRequestsSection from "@/components/ShopRequestsSection";

interface ShopWithStatus extends Shop {
  status: string;
}

interface Shop {
  id: string;
  _id?: string;
  name: string;
  description: string;
  logo: string;
  categories: string[];
  ownerId: string;
  certificate?: {
    data: string;
    type: string;
    name: string;
  };
  status?: string;
  createdAt?: Date;
}

const AdminDashboardPage = () => {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [shops, setShops] = useState<ShopWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");

  useEffect(() => {
    fetchShops();
  }, [activeTab]);

  const fetchShops = async () => {
    setLoading(true);
    try {
      console.log('Fetching shops with status:', activeTab);
      const allShops = await shopService.getAllShops(true, activeTab);
      console.log('Fetched shops:', allShops);
      
      // Transform the data to ensure id is consistently available
      const transformedShops = allShops.map((shop: any) => ({
        ...shop,
        id: shop.id || shop._id
      }));
      
      setShops(transformedShops);
    } catch (error) {
      console.error("Failed to fetch shops:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch shops. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md"
        >
          <h1 className="text-3xl font-bold mb-6 text-orange-600 dark:text-orange-500">Admin Dashboard</h1>
          
          <Tabs defaultValue="pending" onValueChange={setActiveTab}>
            <TabsList className="mb-8">
              <TabsTrigger value="pending">Pending Shops</TabsTrigger>
              <TabsTrigger value="approved">Approved Shops</TabsTrigger>
              <TabsTrigger value="rejected">Rejected Shops</TabsTrigger>
            </TabsList>
            
            <TabsContent value="pending" className="mt-6">
              <ShopRequestsSection adminView={true} shops={shops.filter(shop => shop.status === "pending")} isLoading={loading} onRefresh={fetchShops} />
            </TabsContent>
            
            <TabsContent value="approved" className="mt-6">
              <ShopRequestsSection adminView={true} shops={shops.filter(shop => shop.status === "approved")} isLoading={loading} onRefresh={fetchShops} />
            </TabsContent>
            
            <TabsContent value="rejected" className="mt-6">
              <ShopRequestsSection adminView={true} shops={shops.filter(shop => shop.status === "rejected")} isLoading={loading} onRefresh={fetchShops} />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </Layout>
  );
};

export default AdminDashboardPage;
