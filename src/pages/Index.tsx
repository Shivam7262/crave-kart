
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import ShopCard from "@/components/ShopCard";
import * as shopService from "@/services/shopService";
import { getAllShops as getLocalShops } from "@/lib/data";
import { toast } from "sonner";

interface Shop {
  _id: string;
  id?: string;
  name: string;
  description: string;
  logo: string;
  categories: string[];
  source?: string;
}

const Index = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const [featuredShops, setFeaturedShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        setLoading(true);
        
        // 1. Get approved shops from the API
        const shopData = await shopService.getAllShops();
        
        // Transform data to ensure id property is consistently available
        const apiShops = shopData.map((shop: any) => ({
          ...shop,
          id: shop.id || shop._id,
          source: 'api'
        }));
        
        // 2. Get shops from local storage
        const localShopsString = localStorage.getItem('localShops');
        let localShops: Shop[] = [];
        
        if (localShopsString) {
          try {
            localShops = JSON.parse(localShopsString).map((shop: Shop) => ({
              ...shop,
              source: 'local'
            }));
            console.log('Loaded local shops for home page:', localShops);
          } catch (error) {
            console.error('Error parsing local shops:', error);
          }
        }
        
        // 3. Get predefined shops from data.ts
        const predefinedShops = getLocalShops().map(shop => ({
          ...shop,
          source: 'predefined'
        }));
        
        // Combine shops and limit to 3 for featured section
        const combinedShops = [...apiShops, ...localShops, ...predefinedShops];
        setFeaturedShops(combinedShops.slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch shops:", error);
        toast.error("Failed to load featured shops");
      } finally {
        setLoading(false);
      }
    };
    
    fetchShops();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return;
      const scrollY = window.scrollY;
      const opacity = 1 - scrollY / 500;
      const scale = 1 - scrollY / 2000;
      const translateY = scrollY / 2;

      heroRef.current.style.opacity = opacity.toString();
      heroRef.current.style.transform = `scale(${scale}) translateY(${translateY}px)`;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[80vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center blur-[2px]"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop)",
          }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        <div
          ref={heroRef}
          className="relative h-full flex flex-col items-center justify-center text-center px-4 transition-transform duration-300"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold text-white max-w-3xl leading-tight"
          >
            Order Delicious Food From Your Favorite Restaurants
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-xl text-white/90 max-w-2xl"
          >
            Browse through a wide selection of restaurants and cuisines to satisfy your cravings.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8"
          >
            <Link to="/shops">
              <Button
                size="lg"
                className="bg-white text-black hover:bg-white/90 transition-all px-8"
              >
                Explore Shops
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Featured Shops Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
            <div>
              <h2 className="text-3xl font-bold">Featured Shops</h2>
              <p className="mt-2 text-gray-600">Discover our most popular food shops</p>
            </div>
            <Link to="/shops" className="mt-4 md:mt-0 inline-flex items-center text-black hover:underline">
              View All
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading featured shops...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredShops.map((shop, index) => (
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
            </div>
          )}
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">How It Works</h2>
            <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
              Ordering your favorite food has never been easier
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-xl shadow-sm text-center"
            >
              <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">Choose a Shop</h3>
              <p className="text-gray-600">
                Browse our selection of restaurants and find your favorite cuisine.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-xl shadow-sm text-center"
            >
              <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">Select Your Food</h3>
              <p className="text-gray-600">
                Add your favorite items to your cart and customize as needed.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-xl shadow-sm text-center"
            >
              <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">Place Your Order</h3>
              <p className="text-gray-600">
                Complete your purchase and wait for your delicious food to arrive.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="flex flex-col lg:flex-row">
              <div className="lg:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                  Hungry? Order now and satisfy your cravings
                </h2>
                <p className="mt-4 text-lg text-gray-300">
                  Order from your favorite restaurants and have your food delivered to your doorstep.
                </p>
                <div className="mt-8">
                  <Link to="/shops">
                    <Button
                      size="lg"
                      className="bg-white text-black hover:bg-white/90 transition-all px-8"
                    >
                      Order Now
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="lg:w-1/2 relative min-h-[300px] lg:min-h-[auto]">
                <img
                  src="https://images.unsplash.com/photo-1565299507177-b0ac66763828?q=80&w=1964&auto=format&fit=crop"
                  alt="Food"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
