
import { Link } from "react-router-dom";
import { User, LogOut, Shield, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface UserMenuProps {
  currentUser: any;
  isAdmin: boolean;
  onLogout: () => void;
}

const UserMenu = ({ currentUser, isAdmin, onLogout }: UserMenuProps) => {
  const { toast } = useToast();
  const { getUserOwnedShop } = useAuth();
  
  if (!currentUser) {
    return (
      <Link to="/login">
        <Button variant="outline" className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          Sign In
        </Button>
      </Link>
    );
  }

  // Get the actual shop data from context to check approval status
  const userShop = getUserOwnedShop();
  
  // Always show shop dashboard option for shop owners with ownedShopId
  const showShopDashboard = currentUser.userType === 'shopOwner' && currentUser.ownedShopId;
  
  console.log("UserMenu: Shop status check", { 
    userType: currentUser.userType,
    ownedShopId: currentUser.ownedShopId,
    shopStatus: userShop?.status,
    showShopDashboard
  });
  
  const handleShopDashboardClick = () => {
    toast({
      title: "Navigating to Shop Dashboard",
      description: "Opening your shop management panel"
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full w-10 h-10 transition-all hover:shadow-md hover:border-gray-400 dark:hover:border-gray-500"
        >
          <User className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 animate-slideIn">
        <DropdownMenuLabel className="font-semibold">My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-default opacity-75 text-sm">
          Signed in as {currentUser.email}
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/profile" className="cursor-pointer w-full hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
            My Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/orders" className="cursor-pointer w-full hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
            My Orders
          </Link>
        </DropdownMenuItem>
        
        {/* Shop Owner Menu Item - Always shown for shop owners if they have a shop ID */}
        {showShopDashboard && (
          <DropdownMenuItem asChild>
            <Link 
              to="/shop-dashboard" 
              className="cursor-pointer w-full hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md flex items-center"
              onClick={handleShopDashboardClick}
            >
              <Store className="mr-2 h-4 w-4" />
              Manage Shop
            </Link>
          </DropdownMenuItem>
        )}
        
        {/* Admin Dashboard Menu Item - Only shown for admin users */}
        {isAdmin && (
          <DropdownMenuItem asChild>
            <Link to="/admin" className="cursor-pointer w-full hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md flex items-center">
              <Shield className="mr-2 h-4 w-4" />
              Admin Dashboard
            </Link>
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={onLogout}
          className="text-red-500 cursor-pointer flex items-center hover:bg-red-50 dark:hover:bg-red-950/20 rounded-md"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
