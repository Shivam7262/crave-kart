
import { Button } from "@/components/ui/button";

interface QuickCategoryButtonsProps {
  onAddCategory: (category: string) => void;
}

const QuickCategoryButtons = ({ onAddCategory }: QuickCategoryButtonsProps) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      <Button 
        type="button" 
        variant="outline"
        className="btn-north-indian"
        onClick={() => onAddCategory("North Indian")}
      >
        Add North Indian
      </Button>
      
      <Button 
        type="button" 
        variant="outline"
        className="btn-south-indian"
        onClick={() => onAddCategory("South Indian")}
      >
        Add South Indian
      </Button>
      
      <Button 
        type="button" 
        variant="outline"
        className="btn-chinese"
        onClick={() => onAddCategory("Chinese")}
      >
        Add Chinese
      </Button>
    </div>
  );
};

export default QuickCategoryButtons;
