
// Add the SiteManager type if it doesn't exist
export interface SiteManager {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  customerId: string;
  profileImage: string | null;
  createdAt: string;
}
