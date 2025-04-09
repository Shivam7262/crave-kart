
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";

const NotFound = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-8xl font-bold mb-8">404</h1>
            <h2 className="text-3xl font-semibold mb-4">Page Not Found</h2>
            <p className="text-gray-600 mb-8">
              Oops! The page you are looking for doesn't exist or has been moved.
            </p>
            
            <div className="flex justify-center gap-4">
              <Link to="/">
                <Button className="bg-black hover:bg-gray-800 text-white">
                  <Home className="mr-2 h-5 w-5" />
                  Return Home
                </Button>
              </Link>
              
              <Link to="/shops">
                <Button variant="outline">
                  Browse Shops
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
