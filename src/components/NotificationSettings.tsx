
import React, { useState } from "react";
import { Bell, BellOff, ShoppingCart, Star, TrendingUp } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface NotificationSetting {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  icon: React.ReactNode;
}

const NotificationSettings: React.FC = () => {
  const [settings, setSettings] = useState<NotificationSetting[]>([
    {
      id: "order-updates",
      name: "Order Updates",
      description: "Get notified about your order status",
      enabled: true,
      icon: <ShoppingCart className="h-4 w-4" />
    },
    {
      id: "promotions",
      name: "Promotions & Deals",
      description: "Receive promotional offers and special deals",
      enabled: true,
      icon: <Star className="h-4 w-4" />
    },
    {
      id: "delivery-estimates",
      name: "Delivery Estimates",
      description: "Get updates about your delivery time",
      enabled: true,
      icon: <TrendingUp className="h-4 w-4" />
    }
  ]);
  const { toast } = useToast();

  const toggleNotification = (id: string) => {
    setSettings(settings.map(setting => 
      setting.id === id 
        ? { ...setting, enabled: !setting.enabled } 
        : setting
    ));

    const setting = settings.find(s => s.id === id);
    if (setting) {
      toast({
        title: setting.enabled ? "Notifications Disabled" : "Notifications Enabled",
        description: `${setting.name} notifications have been ${setting.enabled ? "disabled" : "enabled"}`
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Notification Settings</h3>
        <div className="flex items-center space-x-2">
          <Bell className="h-4 w-4 text-gray-500" />
        </div>
      </div>

      <div className="space-y-4">
        {settings.map((setting) => (
          <div key={setting.id} className="flex items-center justify-between border p-4 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-full ${setting.enabled ? "bg-gray-100 dark:bg-gray-800" : "bg-gray-50 dark:bg-gray-900"}`}>
                {setting.icon}
              </div>
              <div>
                <Label htmlFor={setting.id} className="text-base font-medium">
                  {setting.name}
                </Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {setting.description}
                </p>
              </div>
            </div>
            <Switch
              id={setting.id}
              checked={setting.enabled}
              onCheckedChange={() => toggleNotification(setting.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationSettings;
