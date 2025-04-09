import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Briefcase, 
  Edit, 
  Plus, 
  Settings, 
  ShoppingCart, 
  Tag, 
  Trash2,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import Layout from "@/components/Layout";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import ShopEditForm from "@/components/ShopEditForm";
import MenuItemsManager from "@/components/MenuItemsManager";
import PromotionalOffersManager from "@/components/PromotionalOffersManager";
import * as shopService from "@/services/shopService";

const ShopDashboardPage = () => {
  const { currentUser, getUserOwnedShop, refreshUserShop, deleteShop } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [shop, setShop] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dataFetched, setDataFetched] = useState(false); // Add this to track if data has been fetched
  
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    
    if (currentUser.userType !== "shopOwner") {
      navigate("/");
      return;
    }
    
    // Prevent continuous loading by checking if data has already been fetched
    if (dataFetched && shop) {
      console.log("Dashboard: Data already fetched, skipping reload");
      return;
    }
    
    const loadShop = async () => {
      if (isLoading) return; // Prevent multiple simultaneous fetches
      
      setIsLoading(true);
      try {
        console.log("Dashboard: Loading shop data");
        
        // First check if we have the shop data in the auth context
        let shopData = getUserOwnedShop();
        console.log("Dashboard: Shop data from context:", shopData);
        
        // If not available there but user has ownedShopId, fetch it directly
        if (!shopData && currentUser.ownedShopId) {
          console.log("Dashboard: Fetching shop directly with ID:", currentUser.ownedShopId);
          try {
            const fetchedShop = await shopService.getShopById(currentUser.ownedShopId, currentUser.id);
            if (fetchedShop) {
              console.log("Dashboard: Fetched shop data:", fetchedShop);
              shopData = {
                ...fetchedShop,
                id: fetchedShop.id || fetchedShop._id
              };
              
              // Only refresh user shop data once to avoid infinite loops
              if (!dataFetched) {
                await refreshUserShop();
              }
            } else {
              console.log("Dashboard: Shop not found with direct API call");
            }
          } catch (error) {
            console.error("Error fetching shop directly:", error);
          }
        }
        
        if (shopData) {
          setShop(shopData);
          setDataFetched(true); // Mark data as fetched to prevent further loading
        } else {
          // If no shop is found, redirect to register shop page
          console.log("Dashboard: No shop found, redirecting to register page");
          navigate("/register-shop");
        }
      } catch (error) {
        console.error("Error loading shop:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load your shop details."
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadShop();
  }, [currentUser, getUserOwnedShop, navigate, toast, dataFetched, shop]);

  const handleDeleteShop = async () => {
    if (!shop) return;
    
    setIsLoading(true);
    try {
      await deleteShop(shop.id);
      toast({
        title: "Success",
        description: "Your shop has been deleted",
      });
      navigate("/");
    } catch (error) {
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete shop",
      });
    }
  };

  if (!currentUser) return null;
  
  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-semibold mb-4">Loading your shop...</h2>
        </div>
      </Layout>
    );
  }

  if (!shop) return null;

  const isPending = shop.status === 'pending';
  const isRejected = shop.status === 'rejected';
  const isApproved = shop.status === 'approved';

  console.log("Shop dashboard - Shop status:", shop.status);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <div className="flex items-center">
              <div className="mr-4 p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                <Briefcase className="h-8 w-8 text-gray-700 dark:text-gray-300" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{shop.name}</h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Shop Dashboard 
                  {isPending && <span className="ml-2 text-yellow-600 dark:text-yellow-400">(Pending Approval)</span>}
                  {isRejected && <span className="ml-2 text-red-600 dark:text-red-400">(Rejected)</span>}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {isApproved && (
                <Button 
                  onClick={() => navigate(`/shop/${shop.id}`)}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span className="hidden sm:inline">View Shop</span>
                </Button>
              )}
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="destructive"
                    className="flex items-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Delete Shop</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your shop, all menu items, and promotional offers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDeleteShop}
                      className="bg-red-500 hover:bg-red-600"
                      disabled={isLoading}
                    >
                      {isLoading ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </motion.div>
          
          {(isPending || isRejected) && (
            <div className={`mb-6 p-4 rounded-lg ${
              isPending ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800' : 
              'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
            }`}>
              <div className="flex items-start">
                <AlertTriangle className={`h-5 w-5 mr-3 mt-0.5 ${
                  isPending ? 'text-yellow-600 dark:text-yellow-400' : 
                  'text-red-600 dark:text-red-400'
                }`} />
                <div>
                  <h3 className={`font-medium ${
                    isPending ? 'text-yellow-800 dark:text-yellow-300' : 
                    'text-red-800 dark:text-red-300'
                  }`}>
                    {isPending ? 'Your shop is awaiting approval' : 'Your shop has been rejected'}
                  </h3>
                  <p className={`mt-1 text-sm ${
                    isPending ? 'text-yellow-700 dark:text-yellow-400' : 
                    'text-red-700 dark:text-red-400'
                  }`}>
                    {isPending 
                      ? 'You can edit your shop details while waiting for approval, but customers won\'t be able to see your shop until it\'s approved.'
                      : 'Please contact admin for more information on why your shop was rejected. You can edit your shop details and resubmit for approval.'}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                <span>Overview</span>
              </TabsTrigger>
              <TabsTrigger value="menu" className="flex items-center gap-2" disabled={!isApproved}>
                <ShoppingCart className="h-4 w-4" />
                <span>Menu Items</span>
              </TabsTrigger>
              <TabsTrigger value="promotions" className="flex items-center gap-2" disabled={!isApproved}>
                <Tag className="h-4 w-4" />
                <span>Promotions</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-semibold">Shop Details</h2>
                  <Button 
                    onClick={() => setActiveTab("menu")}
                    className="flex items-center gap-2"
                    disabled={!isApproved}
                  >
                    <Edit className="h-4 w-4" />
                    <span>Edit Details</span>
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Basic Information</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Shop Name</p>
                        <p className="mt-1">{shop.name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</p>
                        <p className="mt-1">{shop.description}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Categories</p>
                        <div className="mt-1 flex flex-wrap gap-2">
                          {shop.categories.map((category: string) => (
                            <span 
                              key={category}
                              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm"
                            >
                              {category}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</p>
                        <p className={`mt-1 font-medium ${
                          shop.status === 'approved' ? 'text-green-600' : 
                          shop.status === 'rejected' ? 'text-red-600' : 'text-yellow-600'
                        }`}>
                          {shop.status === 'approved' ? 'Approved' : 
                           shop.status === 'rejected' ? 'Rejected' : 'Pending Approval'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Shop Logo</h3>
                    {shop.logo ? (
                      <img 
                        src={shop.logo} 
                        alt={shop.name} 
                        className="w-full max-w-[200px] h-auto rounded-lg border"
                      />
                    ) : (
                      <div className="w-full max-w-[200px] h-[200px] rounded-lg border flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                        <p className="text-gray-500 dark:text-gray-400">No logo</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
              
              {isApproved && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-semibold">Quick Actions</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <Button
                      variant="outline"
                      className="h-auto flex flex-col items-center justify-center py-6 px-4"
                      onClick={() => setActiveTab("menu")}
                    >
                      <ShoppingCart className="h-8 w-8 mb-2" />
                      <span className="text-lg font-medium">Manage Menu</span>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 text-center">
                        Add, edit or remove menu items
                      </p>
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="h-auto flex flex-col items-center justify-center py-6 px-4"
                      onClick={() => setActiveTab("promotions")}
                    >
                      <Tag className="h-8 w-8 mb-2" />
                      <span className="text-lg font-medium">Promotions</span>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 text-center">
                        Create special offers for customers
                      </p>
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="h-auto flex flex-col items-center justify-center py-6 px-4"
                    >
                      <Settings className="h-8 w-8 mb-2" />
                      <span className="text-lg font-medium">Settings</span>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 text-center">
                        Configure shop settings
                      </p>
                    </Button>
                  </div>
                </motion.div>
              )}
            </TabsContent>
            
            <TabsContent value="menu">
              {isApproved ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-6"
                >
                  <MenuItemsManager shopId={shop.id} categories={shop.categories} />
                </motion.div>
              ) : (
                <div className="text-center py-12">
                  <AlertTriangle className="h-16 w-16 mx-auto text-yellow-500 mb-4" />
                  <h3 className="text-xl font-medium mb-2">Shop Not Yet Approved</h3>
                  <p className="text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
                    You'll be able to manage your menu items once your shop is approved by an administrator.
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="promotions">
              {isApproved ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-6"
                >
                  <PromotionalOffersManager shopId={shop.id} />
                </motion.div>
              ) : (
                <div className="text-center py-12">
                  <AlertTriangle className="h-16 w-16 mx-auto text-yellow-500 mb-4" />
                  <h3 className="text-xl font-medium mb-2">Shop Not Yet Approved</h3>
                  <p className="text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
                    You'll be able to manage promotions once your shop is approved by an administrator.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default ShopDashboardPage;
