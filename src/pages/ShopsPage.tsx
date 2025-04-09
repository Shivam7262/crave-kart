
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import Layout from "@/components/Layout";
import ShopCard from "@/components/ShopCard";
import { Input } from "@/components/ui/input";
import * as shopService from "@/services/shopService";
import { getAllShops as getLocalShops } from "@/lib/data";
import { toast } from "sonner";

interface Shop {
  _id?: string;
  id?: string;
  name: string;
  description: string;
  logo: string;
  categories: string[];
  status?: string;
  source?: string;
}

const ShopsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchShops = async () => {
      try {
        setLoading(true);
        
        // 1. Get approved shops from the API
        let apiShops: Shop[] = [];
        try {
          const shopData = await shopService.getAllShops();
          console.log('Loaded shops from API:', shopData);
          
          // Transform data to ensure id property is consistently available
          apiShops = shopData.map((shop: any) => ({
            ...shop,
            id: shop.id || shop._id,
            source: 'api'
          }));
        } catch (error) {
          console.error("Error fetching shops from API:", error);
          // Continue with other shop sources even if API fails
          apiShops = [];
        }
        
        // 2. Get shops from local storage (added by shop owners)
        const localShopsString = localStorage.getItem('localShops');
        let localShops: Shop[] = [];
        
        if (localShopsString) {
          try {
            localShops = JSON.parse(localShopsString).map((shop: Shop) => ({
              ...shop,
              source: 'local'
            }));
            console.log('Loaded shops from local storage:', localShops);
          } catch (error) {
            console.error('Error parsing local shops:', error);
            toast.error('Error loading local shops');
          }
        }
        
        // 3. Get predefined shops from data.ts
        const predefinedShops = getLocalShops().map(shop => ({
          ...shop,
          source: 'predefined'
        }));
        console.log('Loaded predefined shops:', predefinedShops);
        
        // 4. Combine all sources of shops
        const combinedShops = [...apiShops, ...localShops, ...predefinedShops];
        setShops(combinedShops);
      } catch (error) {
        console.error("Failed to fetch shops:", error);
        toast.error("Failed to load shops");
      } finally {
        setLoading(false);
      }
    };
    
    fetchShops();
  }, []);
  
  const filteredShops = shops.filter(shop => {
    // Only show approved shops or all shops from predefined/local sources
    if (shop.source === 'api' && shop.status !== 'approved') {
      return false;
    }
    
    // Filter by search query if provided
    if (!searchQuery) return true;
    
    return shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           shop.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
           shop.categories.some(category => 
             category.toLowerCase().includes(searchQuery.toLowerCase())
           );
  });

  return (
    <Layout>
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold mb-4 dark:text-white">All Shops</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Discover a wide variety of restaurants and cuisines to satisfy your cravings
            </p>
          </motion.div>
          
          <div className="max-w-md mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
              <Input
                type="text"
                placeholder="Search shops, food items, cuisines, etc."
                className="pl-10 py-6 dark:bg-gray-800 dark:text-white dark:border-gray-700"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin h-8 w-8 border-4 border-t-black dark:border-t-white border-gray-200 rounded-full mb-4"></div>
              <h3 className="text-xl font-medium dark:text-white">Loading shops...</h3>
            </div>
          ) : filteredShops.length > 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, staggerChildren: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredShops.map((shop, index) => (
                <ShopCard 
                  key={shop.id || shop._id} 
                  shop={{
                    id: shop.id || shop._id,
                    name: shop.name,
                    description: shop.description,
                    logo: shop.logo,
                    categories: shop.categories
                  }} 
                  index={index} 
                />
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2 dark:text-white">No shops found</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Try adjusting your search criteria or browse all shops.
              </p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default ShopsPage;
