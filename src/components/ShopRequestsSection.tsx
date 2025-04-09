
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, X, Eye, Store, FileText, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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

interface ShopRequestsSectionProps {
  adminView?: boolean;
  shops: Shop[];
  isLoading: boolean;
  onRefresh: () => void;
}

const ShopRequestsSection = ({ adminView = true, shops, isLoading, onRefresh }: ShopRequestsSectionProps) => {
  const { isAdmin, approveShop, denyShop } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [certificateDialogOpen, setCertificateDialogOpen] = useState(false);
  const [processingShopId, setProcessingShopId] = useState<string | null>(null);

  const handleViewShopDetails = (shop: Shop) => {
    setSelectedShop(shop);
    setIsDialogOpen(true);
  };

  const viewCertificate = (shop: Shop) => {
    setSelectedShop(shop);
    setCertificateDialogOpen(true);
  };

  const handleApproveShop = async (shopId: string) => {
    try {
      setProcessingShopId(shopId);
      await approveShop(shopId);
      toast({
        title: "Shop Approved",
        description: "The shop has been approved and is now visible to customers",
      });
      onRefresh();
      if (shopId === selectedShop?.id || shopId === selectedShop?._id) {
        setIsDialogOpen(false);
      }
    } catch (error) {
      console.error("Failed to approve shop:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to approve shop",
      });
    } finally {
      setProcessingShopId(null);
    }
  };

  const handleDenyShop = async (shopId: string) => {
    try {
      setProcessingShopId(shopId);
      await denyShop(shopId);
      toast({
        title: "Shop Rejected",
        description: "The shop has been rejected",
      });
      onRefresh();
      if (shopId === selectedShop?.id || shopId === selectedShop?._id) {
        setIsDialogOpen(false);
      }
    } catch (error) {
      console.error("Failed to deny shop:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to deny shop",
      });
    } finally {
      setProcessingShopId(null);
    }
  };

  // Format date for display
  const formatDate = (dateString?: Date) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800">
            Pending
          </Badge>
        );
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800">
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800">
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400 border-gray-200 dark:border-gray-800">
            Unknown
          </Badge>
        );
    }
  };

  if (!adminView || !isAdmin()) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="py-8 text-center">
        <div className="inline-block animate-spin h-8 w-8 border-4 border-t-black dark:border-t-white border-gray-200 rounded-full mb-4"></div>
        <p className="text-gray-500 dark:text-gray-400">Loading shop requests...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">
          {shops.length} Shop{shops.length !== 1 ? 's' : ''}
        </h3>
        <Button 
          variant="outline" 
          onClick={onRefresh}
          size="sm"
          className="hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          Refresh
        </Button>
      </div>

      {shops.length === 0 ? (
        <div className="py-12 text-center bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700">
          <Store className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <h4 className="text-lg font-medium mb-2">No Shops Found</h4>
          <p className="text-gray-500 dark:text-gray-400">
            There are no shops with the selected status.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {shops.map((shop) => (
            <Card key={shop.id || shop._id} className="overflow-hidden hover:shadow-md transition-all">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{shop.name}</CardTitle>
                    <CardDescription className="mt-1">
                      Submitted: {formatDate(shop.createdAt)}
                    </CardDescription>
                  </div>
                  {getStatusBadge(shop.status)}
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                  {shop.description}
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {shop.categories?.map((category: string) => (
                    <Badge key={category} variant="secondary" className="text-xs">
                      {category}
                    </Badge>
                  ))}
                </div>
                {shop.certificate && (
                  <div className="mt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => viewCertificate(shop)}
                      className="flex items-center gap-1 text-xs hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <FileText className="h-3 w-3" />
                      View Certificate
                    </Button>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between pt-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="gap-1 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => handleViewShopDetails(shop)}
                >
                  <Eye className="h-4 w-4" />
                  View Details
                </Button>
                <div className="flex gap-2">
                  {shop.status !== "rejected" && (
                    <Button 
                      variant="destructive" 
                      size="sm"
                      className="gap-1"
                      onClick={() => handleDenyShop(shop.id || shop._id || "")}
                      disabled={processingShopId === (shop.id || shop._id)}
                    >
                      <X className="h-4 w-4" />
                      {shop.status === "approved" ? "Suspend" : "Reject"}
                    </Button>
                  )}
                  {shop.status !== "approved" && (
                    <Button 
                      variant="default" 
                      size="sm"
                      className="gap-1 bg-green-600 hover:bg-green-700"
                      onClick={() => handleApproveShop(shop.id || shop._id || "")}
                      disabled={processingShopId === (shop.id || shop._id)}
                    >
                      <Check className="h-4 w-4" />
                      Approve
                    </Button>
                  )}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Shop Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedShop && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">{selectedShop.name}</DialogTitle>
                <DialogDescription>
                  Shop request submitted on {formatDate(selectedShop.createdAt)}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                <div>
                  <h4 className="font-medium mb-2">Shop Information</h4>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</p>
                      <p className="mt-1">{selectedShop.description}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Categories</p>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {selectedShop.categories?.map((category: string) => (
                          <Badge key={category} variant="secondary">
                            {category}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</p>
                      <div className="mt-1">
                        {getStatusBadge(selectedShop.status)}
                      </div>
                    </div>
                    
                    {selectedShop.certificate && (
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Food License/Certificate</p>
                        <div className="mt-1 flex items-center">
                          <p>{selectedShop.certificate.name || "Certificate uploaded"}</p>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="ml-2"
                            onClick={() => viewCertificate(selectedShop)}
                          >
                            <Eye className="h-4 w-4 mr-1" /> View
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Shop Logo</h4>
                  {selectedShop.logo ? (
                    <img 
                      src={selectedShop.logo} 
                      alt={`${selectedShop.name} logo`} 
                      className="w-full max-w-[200px] h-auto rounded-lg border"
                    />
                  ) : (
                    <div className="w-full max-w-[200px] h-[150px] bg-gray-100 dark:bg-gray-800 rounded-lg border flex items-center justify-center">
                      <Store className="h-10 w-10 text-gray-400" />
                    </div>
                  )}
                </div>
              </div>
              
              <Separator />
              
              <DialogFooter className="flex sm:justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Close
                </Button>
                
                <div className="flex gap-2">
                  {selectedShop.status !== "rejected" && (
                    <Button 
                      variant="destructive"
                      onClick={() => handleDenyShop(selectedShop.id || selectedShop._id || "")}
                      disabled={processingShopId === (selectedShop.id || selectedShop._id)}
                    >
                      <X className="h-4 w-4 mr-2" />
                      {selectedShop.status === "approved" ? "Suspend Shop" : "Reject Shop"}
                    </Button>
                  )}
                  {selectedShop.status !== "approved" && (
                    <Button 
                      variant="default"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleApproveShop(selectedShop.id || selectedShop._id || "")}
                      disabled={processingShopId === (selectedShop.id || selectedShop._id)}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Approve Shop
                    </Button>
                  )}
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Certificate View Dialog */}
      <Dialog open={certificateDialogOpen} onOpenChange={setCertificateDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Shop Certificate</DialogTitle>
            <DialogDescription>
              Certificate for {selectedShop?.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="my-4">
            {selectedShop?.certificate && (
              <>
                <div className="mb-2">
                  <strong>File Name:</strong> {selectedShop.certificate.name}
                </div>
                <div className="mb-4">
                  <strong>File Type:</strong> {selectedShop.certificate.type}
                </div>
                
                {selectedShop.certificate.type.includes('pdf') ? (
                  <div className="border rounded p-4 text-center">
                    <FileText className="h-16 w-16 mx-auto mb-2 text-red-500" />
                    <p className="mb-2">PDF Document</p>
                    <a 
                      href={selectedShop.certificate.data} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 hover:underline"
                    >
                      Open PDF <ExternalLink className="h-4 w-4 ml-1" />
                    </a>
                  </div>
                ) : (
                  <div className="border rounded p-4 flex justify-center">
                    <img 
                      src={selectedShop.certificate.data} 
                      alt="Certificate" 
                      className="max-h-[400px] object-contain" 
                    />
                  </div>
                )}
              </>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setCertificateDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ShopRequestsSection;
