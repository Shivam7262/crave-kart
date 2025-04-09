
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileIcon, Upload, FileImage, File, AlertCircle } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ShopCategoryInput from "./ShopCategoryInput";
import QuickCategoryButtons from "./QuickCategoryButtons";

const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const formSchema = z.object({
  name: z.string().min(2, { message: "Shop name must be at least 2 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  logo: z.string().url({ message: "Please enter a valid URL for your logo" }),
  categories: z.array(z.string()).min(1, { message: "Add at least one category" }),
  certificate: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, { message: "Certificate is required" })
    .refine((files) => files.length <= 1, { message: "Only one file is allowed" })
    .refine(
      (files) => ACCEPTED_FILE_TYPES.includes(files[0]?.type),
      { message: "Only JPEG, PNG, and PDF files are accepted" }
    )
    .refine(
      (files) => files[0]?.size <= MAX_FILE_SIZE,
      { message: `File size should be less than 5MB` }
    ),
});

export type ShopFormValues = z.infer<typeof formSchema>;

interface ShopRegistrationFormProps {
  onSubmit: (values: ShopFormValues) => void;
  isLoading: boolean;
}

const ShopRegistrationForm = ({ onSubmit, isLoading }: ShopRegistrationFormProps) => {
  const form = useForm<ShopFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      logo: "",
      categories: [],
    },
  });
  
  const [certificatePreview, setCertificatePreview] = useState<string | null>(null);
  const [certificateType, setCertificateType] = useState<string | null>(null);
  const [certificateSize, setCertificateSize] = useState<number>(0);
  const [formErrors, setFormErrors] = useState<string[]>([]);

  const addCategory = (category: string) => {
    const currentCategories = form.getValues("categories");
    if (!currentCategories.includes(category)) {
      form.setValue("categories", [...currentCategories, category]);
    }
  };

  const removeCategory = (category: string) => {
    const currentCategories = form.getValues("categories");
    form.setValue(
      "categories",
      currentCategories.filter((c) => c !== category)
    );
  };
  
  const handleCertificateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setCertificateType(file.type);
    setCertificateSize(file.size);
    
    // Check file size and show warning if it's close to limit
    const fileSizeMB = file.size / (1024 * 1024);
    
    // Only create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setCertificatePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else if (file.type === 'application/pdf') {
      // For PDFs just show file info, not preview
      setCertificatePreview(null);
    }
  };
  
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  const validateForm = () => {
    const errors: string[] = [];
    
    // Check logo URL
    const logoUrl = form.getValues("logo");
    if (!logoUrl) {
      errors.push("Please provide a logo URL");
    }
    
    // Check categories
    const categories = form.getValues("categories");
    if (categories.length === 0) {
      errors.push("Please select at least one category");
    }
    
    // Check certificate
    const certificate = form.getValues("certificate");
    if (!certificate || certificate.length === 0) {
      errors.push("Please upload a certificate file");
    } else {
      // Check file size
      if (certificate[0]?.size > MAX_FILE_SIZE) {
        errors.push(`Certificate file is too large (${formatFileSize(certificate[0]?.size)}). Maximum allowed size is 5MB.`);
      }
    }
    
    setFormErrors(errors);
    return errors.length === 0;
  };
  
  const handleSubmit = (data: ShopFormValues) => {
    if (validateForm()) {
      setFormErrors([]);
      onSubmit(data);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {formErrors.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <ul className="list-disc pl-5 mt-2">
                {formErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}
      
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Shop Name</FormLabel>
              <FormControl>
                <Input placeholder="My Awesome Restaurant" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Tell customers about your shop and what makes it special..." 
                  {...field} 
                  className="min-h-24"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="logo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Logo URL</FormLabel>
              <FormDescription>
                Provide a direct URL to your logo image. You can upload an image to a service like Imgur and paste the link here.
              </FormDescription>
              <FormControl>
                <Input 
                  placeholder="https://example.com/your-logo.jpg" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="certificate"
          render={({ field: { onChange, value, ...rest } }) => (
            <FormItem>
              <FormLabel>Business Certificate</FormLabel>
              <FormDescription>
                Upload your business certificate, license, or FSSAI registration (JPEG, PNG, or PDF, max 5MB)
              </FormDescription>
              <FormControl>
                <div className="flex flex-col gap-4">
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <Input
                      type="file"
                      className="hidden"
                      id="certificate-upload"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={(e) => {
                        onChange(e.target.files);
                        handleCertificateChange(e);
                      }}
                      {...rest}
                    />
                    <label htmlFor="certificate-upload" className="cursor-pointer flex flex-col items-center">
                      <Upload className="h-8 w-8 mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        (JPG, PNG, or PDF, max 5MB)
                      </p>
                    </label>
                  </div>
                  
                  {/* File size indicator */}
                  {certificateSize > 0 && (
                    <div className={`text-sm ${certificateSize > MAX_FILE_SIZE * 0.8 ? 'text-amber-600 dark:text-amber-500' : 'text-gray-600 dark:text-gray-400'}`}>
                      File size: {formatFileSize(certificateSize)}
                      {certificateSize > MAX_FILE_SIZE * 0.8 && certificateSize <= MAX_FILE_SIZE && 
                        " (Warning: approaching size limit)"}
                      {certificateSize > MAX_FILE_SIZE && 
                        " (Error: exceeds maximum size)"}
                    </div>
                  )}
                  
                  {/* Preview area */}
                  {form.getValues("certificate") && (
                    <div className="flex items-center gap-2 p-2 border rounded bg-gray-50 dark:bg-gray-800">
                      {certificateType?.startsWith('image/') && certificatePreview ? (
                        <div className="flex items-center gap-2">
                          <FileImage className="h-5 w-5 text-blue-500" />
                          <span className="text-sm">Image Certificate</span>
                          <div className="w-16 h-16 overflow-hidden rounded">
                            <img src={certificatePreview} alt="Certificate" className="object-cover w-full h-full" />
                          </div>
                        </div>
                      ) : certificateType === 'application/pdf' ? (
                        <div className="flex items-center gap-2">
                          <File className="h-5 w-5 text-red-500" />
                          <span className="text-sm">
                            {form.getValues("certificate")?.[0]?.name || "PDF Certificate"}
                          </span>
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="categories"
          render={() => (
            <FormItem>
              <FormLabel>Categories</FormLabel>
              <ShopCategoryInput 
                categories={form.watch("categories")}
                onAddCategory={addCategory}
                onRemoveCategory={removeCategory}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-3 gap-4 pt-4">
          <Button 
            type="submit" 
            className="col-span-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? "Registering Shop..." : "Register Shop"}
          </Button>
          
          <QuickCategoryButtons onAddCategory={addCategory} />
        </div>
      </form>
    </Form>
  );
};

export default ShopRegistrationForm;
