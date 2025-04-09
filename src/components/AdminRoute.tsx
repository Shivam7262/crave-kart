
import { ReactNode, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface AdminRouteProps {
  children: ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { currentUser, isAdmin } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [redirecting, setRedirecting] = useState(false);
  
  // Check admin access on component mount
  useEffect(() => {
    // If user is logged in but not an admin
    if (currentUser && !isAdmin() && !redirecting) {
      setRedirecting(true);
      
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "You don't have permission to access the admin area."
      });
      
      navigate("/", { replace: true });
    }
  }, [currentUser, isAdmin, toast, navigate, redirecting]);
  
  // If user is not logged in, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  // If user is an admin, render the children
  if (isAdmin()) {
    return <>{children}</>;
  }
  
  // This will only happen briefly before the useEffect redirect takes place
  return null;
};

export default AdminRoute;
