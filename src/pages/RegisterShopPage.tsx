
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";
import ShopRegistrationForm from "@/components/shop/ShopRegistrationForm";
import type { ShopFormValues } from "@/components/shop/ShopRegistrationForm";

const RegisterShopPage = () => {
  const { currentUser, registerShop } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // Handle redirects based on user status
    if (!currentUser) {
      console.log("No user logged in, redirecting to login");
      navigate("/login");
      return;
    } 
    
    if (currentUser.userType !== "shopOwner") {
      console.log("User is not a shop owner, redirecting to home");
      navigate("/");
      return;
    } 
    
    if (currentUser.ownedShopId) {
      console.log("User already has a shop, redirecting to shop dashboard");
      navigate(`/shop-dashboard`);
      return;
    }
    
    console.log("User is a shop owner without a shop, showing registration form");
  }, [currentUser, navigate]);

  // If we're still checking auth or redirecting, show nothing
  if (!currentUser || currentUser.userType !== "shopOwner" || currentUser.ownedShopId) {
    return null;
  }

  const handleSubmit = async (values: ShopFormValues) => {
    setIsLoading(true);
    try {
      console.log("Submitting shop registration with values:", values);
      console.log("Current user:", currentUser);
      
      // Check for either id or _id
      const userId = currentUser.id || currentUser._id;
      
      if (!userId) {
        console.error("User ID is missing from current user");
        toast({
          variant: "destructive",
          title: "Error",
          description: "User identification is missing. Please log in again."
        });
        navigate("/login");
        return;
      }
      
      // Convert certificate file to base64 for storage
      const certificateFile = values.certificate[0];
      
      // Check file size
      if (certificateFile.size > 5 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "File Too Large",
          description: "Certificate file must be less than 5MB. Please choose a smaller file or compress it."
        });
        setIsLoading(false);
        return;
      }
      
      let certificateBase64;
      
      // Handle image compression for JPG/PNG files
      if (certificateFile.type.startsWith('image/')) {
        certificateBase64 = await compressAndConvertToBase64(certificateFile);
      } else {
        // For PDFs, just convert to base64 without compression
        certificateBase64 = await fileToBase64(certificateFile);
      }
      
      // Create the shop using the AuthContext's registerShop function
      const shopId = await registerShop({
        name: values.name,
        description: values.description,
        logo: values.logo,
        categories: values.categories,
        certificate: {
          data: certificateBase64,
          type: certificateFile.type,
          name: certificateFile.name
        }
      });
      
      console.log("Shop registered successfully with ID:", shopId);
      
      toast({
        title: "Success!",
        description: "Your shop has been registered and is pending approval.",
      });
      
      // Navigate to the shop page
      navigate(`/shop/${shopId}`);
    } catch (error) {
      setIsLoading(false);
      console.error("Failed to register shop:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to register shop",
      });
    }
  };
  
  // Helper function to convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };
  
  // Helper function to compress image and convert to base64
  const compressAndConvertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        
        img.onload = () => {
          // Create canvas for compression
          const canvas = document.createElement('canvas');
          
          // Calculate new dimensions, maintaining aspect ratio
          let width = img.width;
          let height = img.height;
          
          // If image is too large, scale it down
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
          
          if (width > height) {
            if (width > MAX_WIDTH) {
              height = Math.round(height * MAX_WIDTH / width);
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = Math.round(width * MAX_HEIGHT / height);
              height = MAX_HEIGHT;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          // Draw image on canvas with new dimensions
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Get compressed data URL
          const dataUrl = canvas.toDataURL(file.type, 0.7); // 0.7 quality reduces file size
          resolve(dataUrl);
        };
        
        img.onerror = () => {
          reject(new Error('Error loading image for compression'));
        };
      };
      
      reader.onerror = () => {
        reject(new Error('Error reading file'));
      };
    });
  };

  return (
    <Layout>
      <div className="container max-w-3xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-800 dark:to-gray-900 p-8 rounded-xl shadow-md border border-orange-100 dark:border-gray-700"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-orange-600 dark:text-orange-500">Register Your Shop</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Fill in the details below and upload required certificates to get started with selling on CraveKart
            </p>
          </div>

          <ShopRegistrationForm 
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </motion.div>
      </div>
    </Layout>
  );
};

export default RegisterShopPage;
