import { useState, useRef } from "react";
import { Camera, X, Loader2, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  folder?: string;
  className?: string;
}

export function ImageUpload({ 
  images, 
  onImagesChange, 
  maxImages = 10, 
  folder = "properties",
  className 
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    setIsUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (const file of Array.from(files)) {
        // Validate file type
        if (!file.type.startsWith("image/")) {
          toast.error(`${file.name} is not an image`);
          continue;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name} is too large. Max 5MB allowed`);
          continue;
        }

        const fileExt = file.name.split(".").pop();
        const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { data, error } = await supabase.storage
          .from("property-photos")
          .upload(fileName, file);

        if (error) {
          console.error("Upload error:", error);
          toast.error(`Failed to upload ${file.name}`);
          continue;
        }

        const { data: urlData } = supabase.storage
          .from("property-photos")
          .getPublicUrl(data.path);

        uploadedUrls.push(urlData.publicUrl);
      }

      if (uploadedUrls.length > 0) {
        onImagesChange([...images, ...uploadedUrls]);
        toast.success(`${uploadedUrls.length} image(s) uploaded`);
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload images");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeImage = async (index: number) => {
    const imageUrl = images[index];
    
    // Extract path from URL
    const urlParts = imageUrl.split("/property-photos/");
    if (urlParts.length > 1) {
      const path = urlParts[1];
      await supabase.storage.from("property-photos").remove([path]);
    }

    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
    toast.success("Image removed");
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex flex-wrap gap-3">
        {images.map((url, index) => (
          <div 
            key={index} 
            className="relative w-20 h-20 rounded-lg overflow-hidden border border-border group"
          >
            <img 
              src={url} 
              alt={`Property ${index + 1}`} 
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-1 right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
        
        {images.length < maxImages && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-20 h-20 rounded-lg border-2 border-dashed border-border hover:border-accent flex flex-col items-center justify-center transition-colors disabled:opacity-50"
          >
            {isUploading ? (
              <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
            ) : (
              <>
                <Camera className="w-5 h-5 text-muted-foreground mb-1" />
                <span className="text-xs text-muted-foreground">Add</span>
              </>
            )}
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />
      
      <p className="text-xs text-muted-foreground">
        {images.length}/{maxImages} photos • Max 5MB each
      </p>
    </div>
  );
}
