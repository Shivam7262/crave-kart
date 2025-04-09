
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { MapPin, Plus, Home, Briefcase, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Address {
  id: string;
  label: string;
  address: string;
  type: "home" | "work" | "other";
}

const AddressManager: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>([
    { id: "1", label: "Home", address: "123 Main St, Anytown, USA", type: "home" },
    { id: "2", label: "Work", address: "456 Office Ave, Business City, USA", type: "work" }
  ]);
  const [newAddress, setNewAddress] = useState<{
    label: string;
    address: string;
    type: "home" | "work" | "other";
  }>({ label: "", address: "", type: "home" });
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleAddAddress = () => {
    if (!newAddress.label || !newAddress.address) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    const newAddressEntry: Address = {
      id: Date.now().toString(),
      ...newAddress
    };

    setAddresses([...addresses, newAddressEntry]);
    setNewAddress({ label: "", address: "", type: "home" });
    setOpen(false);
    
    toast({
      title: "Address Added",
      description: "Your new address has been saved"
    });
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case "home": return <Home className="h-4 w-4" />;
      case "work": return <Briefcase className="h-4 w-4" />;
      default: return <Heart className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Your Addresses</h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              Add New
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Address</DialogTitle>
              <DialogDescription>
                Enter the details of your new delivery address.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="label">Address Label</Label>
                <Input 
                  id="label" 
                  placeholder="e.g. Home, Work, etc."
                  value={newAddress.label}
                  onChange={(e) => setNewAddress({...newAddress, label: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Full Address</Label>
                <Input 
                  id="address" 
                  placeholder="Street address, city, state, zip"
                  value={newAddress.address}
                  onChange={(e) => setNewAddress({...newAddress, address: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">Address Type</Label>
                <Select 
                  value={newAddress.type} 
                  onValueChange={(value) => {
                    // Ensure the value is one of the allowed types
                    const addressType = value as "home" | "work" | "other";
                    setNewAddress({...newAddress, type: addressType});
                  }}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="home">Home</SelectItem>
                    <SelectItem value="work">Work</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddAddress}>Save Address</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {addresses.map((address) => (
          <div key={address.id} className="flex items-start gap-3 p-3 border rounded-lg">
            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
              {getIconForType(address.type)}
            </div>
            <div>
              <h4 className="font-medium">{address.label}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">{address.address}</p>
              <p className="text-xs text-gray-500 capitalize mt-1">{address.type}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddressManager;
