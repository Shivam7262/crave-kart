
import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface ShopCategoryInputProps {
  categories: string[];
  onAddCategory: (category: string) => void;
  onRemoveCategory: (category: string) => void;
}

const ShopCategoryInput = ({
  categories,
  onAddCategory,
  onRemoveCategory
}: ShopCategoryInputProps) => {
  const [newCategory, setNewCategory] = useState("");
  const { toast } = useToast();

  const addCategory = () => {
    if (!newCategory.trim()) return;
    
    if (categories.includes(newCategory.trim())) {
      toast({
        variant: "destructive",
        description: "This category already exists",
      });
      return;
    }
    
    onAddCategory(newCategory.trim());
    setNewCategory("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCategory();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex">
        <Input
          placeholder="Add a category (e.g., North Indian, Street Food)"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          onKeyDown={handleKeyDown}
          className="rounded-r-none"
        />
        <Button
          type="button"
          onClick={addCategory}
          className="rounded-l-none"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <div
            key={category}
            className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full flex items-center gap-2"
          >
            <span>{category}</span>
            <button
              type="button"
              onClick={() => onRemoveCategory(category)}
              className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShopCategoryInput;
