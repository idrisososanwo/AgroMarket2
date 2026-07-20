import { supabase } from "../lib/supabase";

export const storageService = {
  /**
   * Upload product image file to Supabase Storage bucket
   */
  async uploadProductImage(file: File): Promise<string> {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `product-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.warn(
          "Supabase storage upload returned error (using Data URL fallback):",
          uploadError.message
        );
        return await this.fileToDataUrl(file);
      }

      const { data } = supabase.storage.from("product-images").getPublicUrl(filePath);

      return data.publicUrl || (await this.fileToDataUrl(file));
    } catch (err) {
      console.warn("Storage service exception (using Data URL fallback)", err);
      return await this.fileToDataUrl(file);
    }
  },

  /**
   * Fallback helper converting File to base64 Data URL
   */
  fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  },
};
