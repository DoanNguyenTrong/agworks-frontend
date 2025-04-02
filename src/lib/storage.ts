
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

// Create a storage bucket for profiles and task photos if it doesn't exist
export const initStorage = async () => {
  try {
    // Check if the buckets exist, create them if not
    const { data: buckets } = await supabase.storage.listBuckets();
    
    if (!buckets?.find(bucket => bucket.name === 'profiles')) {
      await supabase.storage.createBucket('profiles', {
        public: true
      });
    }
    
    if (!buckets?.find(bucket => bucket.name === 'task-photos')) {
      await supabase.storage.createBucket('task-photos', {
        public: true
      });
    }
  } catch (error) {
    console.error("Error initializing storage:", error);
  }
};

// Upload a profile image
export const uploadProfileImage = async (file: File): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const filePath = `${uuidv4()}.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from('profiles')
    .upload(filePath, file);
    
  if (error) {
    console.error("Error uploading profile image:", error);
    throw error;
  }
  
  // Get the public URL
  const { data: urlData } = await supabase.storage
    .from('profiles')
    .getPublicUrl(filePath);
    
  return urlData.publicUrl;
};

// Upload a task photo
export const uploadTaskPhoto = async (file: File): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const filePath = `${uuidv4()}.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from('task-photos')
    .upload(filePath, file);
    
  if (error) {
    console.error("Error uploading task photo:", error);
    throw error;
  }
  
  // Get the public URL
  const { data: urlData } = await supabase.storage
    .from('task-photos')
    .getPublicUrl(filePath);
    
  return urlData.publicUrl;
};

// Delete a file
export const deleteFile = async (url: string): Promise<void> => {
  // Extract the bucket and file path from the URL
  const urlObj = new URL(url);
  const pathSegments = urlObj.pathname.split('/');
  const bucket = pathSegments[1]; // after the first /
  const filePath = pathSegments.slice(2).join('/');
  
  const { error } = await supabase.storage
    .from(bucket)
    .remove([filePath]);
    
  if (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
};
