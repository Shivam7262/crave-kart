import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import AddressManager from "@/components/AddressManager";
import NotificationSettings from "@/components/NotificationSettings";
import FavoriteItems from "@/components/FavoriteItems";
import OrderHistory from "@/components/OrderHistory";
import * as shopService from "@/services/shopService";
import { useToast } from "@/hooks/use-toast";

const UserProfilePage = () => {
  const { currentUser, getUserOwnedShop, refreshUserShop } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [userShop, setUserShop] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    const loadUserShop = async () => {
      setIsLoading(true);
      try {
        console.log("UserProfile: Loading user shop data");
        // Refresh shop data from server first
        await refreshUserShop();
        
        // Get shop data from auth context
        const shop = getUserOwnedShop();
        console.log("UserProfile: Shop data from context:", shop);
        
        // If user has ownedShopId but no shop data found in context, fetch directly
        if (!shop && currentUser.ownedShopId) {
          console.log("UserProfile: Fetching shop directly with ID:", currentUser.ownedShopId);
          try {
            const fetchedShop = await shopService.getShopById(currentUser.ownedShopId, currentUser.id);
            if (fetchedShop) {
              console.log("UserProfile: Directly fetched shop:", fetchedShop);
              setUserShop({
                ...fetchedShop,
                id: fetchedShop._id || fetchedShop.id
              });
            }
          } catch (error) {
            console.error("UserProfile: Error fetching shop:", error);
          }
        } else if (shop) {
          console.log("UserProfile: Setting shop from context:", shop);
          setUserShop(shop);
        }
      } catch (error) {
        console.error("Error loading user shop:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserShop();
  }, [currentUser, getUserOwnedShop, refreshUserShop, navigate]);
  
  // Check if user has a shop and it's approved
  const hasApprovedShop = userShop && userShop.status === 'approved';
  const hasPendingShop = userShop && userShop.status === 'pending';
  const hasRejectedShop = userShop && userShop.status === 'rejected';
  
  console.log("UserProfile: Has approved shop:", hasApprovedShop);
  console.log("UserProfile: Has pending shop:", hasPendingShop);
  console.log("UserProfile: Has rejected shop:", hasRejectedShop);
  console.log("UserProfile: Current shop status:", userShop?.status);

  if (!currentUser) return null;

  // Handle the shop dashboard navigation
  const handleManageShopClick = () => {
    console.log("Navigating to shop dashboard with shop ID:", userShop?.id);
    toast({
      title: "Navigating to shop dashboard",
      description: "Opening your shop management dashboard"
    });
    navigate("/shop-dashboard");
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Go back"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h1 className="text-3xl font-bold">My Profile</h1>
        </div>

        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 mb-8 shadow-sm animate-fadeIn">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center">
              <div className="w-16 h-16 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-2xl font-bold">
                {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="ml-4">
                <h2 className="text-2xl font-bold">{currentUser.name || "User"}</h2>
                <p className="text-gray-600 dark:text-gray-400">{currentUser.email}</p>
                <p className="text-sm font-medium mt-1">
                  Account Type: {currentUser.userType === "shopOwner" ? "Shop Owner" : "Customer"}
                </p>
              </div>
            </div>
            {currentUser.userType === "shopOwner" && (
              <div>
                {hasApprovedShop ? (
                  <Button 
                    onClick={handleManageShopClick} 
                    className="flex items-center gap-2 btn-primary"
                  >
                    <Store className="h-4 w-4" />
                    Manage Shop
                  </Button>
                ) : hasPendingShop ? (
                  <Button disabled className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 cursor-not-allowed">
                    <Store className="h-4 w-4" />
                    Shop Pending Approval
                  </Button>
                ) : hasRejectedShop ? (
                  <Button 
                    onClick={handleManageShopClick} 
                    className="flex items-center gap-2 bg-red-500 hover:bg-red-600"
                  >
                    <Store className="h-4 w-4" />
                    Shop Rejected - Edit Details
                  </Button>
                ) : (
                  <Button 
                    onClick={() => navigate("/register-shop")} 
                    className="flex items-center gap-2 btn-primary"
                  >
                    <Plus className="h-4 w-4" />
                    Register Shop
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-5 mb-8">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="addresses">Addresses</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Full Name</h4>
                  <p className="mt-1">{currentUser.name || "Not provided"}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</h4>
                  <p className="mt-1">{currentUser.email}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Joined</h4>
                  <p className="mt-1">April 2023</p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="addresses">
            <AddressManager />
          </TabsContent>
          
          <TabsContent value="favorites">
            <FavoriteItems />
          </TabsContent>
          
          <TabsContent value="notifications">
            <NotificationSettings />
          </TabsContent>
          
          <TabsContent value="orders">
            <OrderHistory />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default UserProfilePage;
