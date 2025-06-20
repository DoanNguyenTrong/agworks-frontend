
import { User } from "@/lib/types";

export const users: User[] = [
  {
    id: "user-1",
    email: "admin@agworks.com",
    name: "System Administrator",
    role: "admin",
    createdAt: "2023-01-01T00:00:00Z"
  },
  {
    id: "user-2",
    email: "vineyard@example.com",
    name: "Vineyard Owner",
    role: "customer",
    companyName: "Napa Valley Vineyards",
    phone: "(707) 555-0123",
    address: "1234 Vineyard Lane, Napa, CA 94558",
    createdAt: "2023-01-15T00:00:00Z"
  },
  {
    id: "user-3",
    email: "manager@example.com",
    name: "Site Manager",
    role: "siteManager",
    customerId: "user-2",
    phone: "(707) 555-0456",
    createdAt: "2023-02-01T00:00:00Z"
  },
  {
    id: "user-4",
    email: "john@example.com",
    name: "John Worker",
    role: "worker",
    serviceCompanyId: "user-6",
    phone: "(707) 555-0789",
    createdAt: "2023-02-15T00:00:00Z"
  },
  {
    id: "user-5",
    email: "jane@example.com",
    name: "Jane Worker",
    role: "worker",
    serviceCompanyId: "user-6",
    phone: "(707) 555-0012",
    createdAt: "2023-02-20T00:00:00Z"
  },
  {
    id: "user-6",
    email: "valley@agservices.com",
    name: "Valley Agricultural Services",
    role: "serviceCompany",
    companyName: "Valley Agricultural Services",
    phone: "(707) 555-1000",
    address: "456 Service Road, Napa, CA 94559",
    createdAt: "2023-01-20T00:00:00Z"
  },
  {
    id: "user-7",
    email: "premium@vineyardservices.com",
    name: "Premium Vineyard Services",
    role: "serviceCompany",
    companyName: "Premium Vineyard Services",
    phone: "(707) 555-2000",
    address: "789 Premium Lane, Sonoma, CA 95476",
    createdAt: "2023-01-25T00:00:00Z"
  },
  // Adding 10 more service companies
  {
    id: "user-8",
    email: "golden@vineservices.com",
    name: "Golden State Vine Services",
    role: "serviceCompany",
    companyName: "Golden State Vine Services",
    phone: "(707) 555-3000",
    address: "123 Golden Gate Ave, Calistoga, CA 94515",
    createdAt: "2023-03-01T00:00:00Z"
  },
  {
    id: "user-9",
    email: "coastal@agwork.com",
    name: "Coastal Agricultural Work",
    role: "serviceCompany",
    companyName: "Coastal Agricultural Work",
    phone: "(707) 555-4000",
    address: "456 Coastal Highway, Petaluma, CA 94952",
    createdAt: "2023-03-05T00:00:00Z"
  },
  {
    id: "user-10",
    email: "summit@vineyard.com",
    name: "Summit Vineyard Solutions",
    role: "serviceCompany",
    companyName: "Summit Vineyard Solutions",
    phone: "(707) 555-5000",
    address: "789 Summit Drive, St. Helena, CA 94574",
    createdAt: "2023-03-10T00:00:00Z"
  },
  {
    id: "user-11",
    email: "redwood@agservices.com",
    name: "Redwood Agricultural Services",
    role: "serviceCompany",
    companyName: "Redwood Agricultural Services",
    phone: "(707) 555-6000",
    address: "321 Redwood Circle, Yountville, CA 94599",
    createdAt: "2023-03-15T00:00:00Z"
  },
  {
    id: "user-12",
    email: "hillside@vinecare.com",
    name: "Hillside Vine Care",
    role: "serviceCompany",
    companyName: "Hillside Vine Care",
    phone: "(707) 555-7000",
    address: "654 Hillside Road, Rutherford, CA 94573",
    createdAt: "2023-03-20T00:00:00Z"
  },
  {
    id: "user-13",
    email: "heritage@agwork.com",
    name: "Heritage Agricultural Works",
    role: "serviceCompany",
    companyName: "Heritage Agricultural Works",
    phone: "(707) 555-8000",
    address: "987 Heritage Lane, Oakville, CA 94562",
    createdAt: "2023-03-25T00:00:00Z"
  },
  {
    id: "user-14",
    email: "sunrise@vineservices.com",
    name: "Sunrise Vine Services",
    role: "serviceCompany",
    companyName: "Sunrise Vine Services",
    phone: "(707) 555-9000",
    address: "147 Sunrise Boulevard, American Canyon, CA 94503",
    createdAt: "2023-03-30T00:00:00Z"
  },
  {
    id: "user-15",
    email: "mountain@agcare.com",
    name: "Mountain Agricultural Care",
    role: "serviceCompany",
    companyName: "Mountain Agricultural Care",
    phone: "(707) 555-1100",
    address: "258 Mountain View Drive, Angwin, CA 94508",
    createdAt: "2023-04-01T00:00:00Z"
  },
  {
    id: "user-16",
    email: "valley@vineyardpros.com",
    name: "Valley Vineyard Professionals",
    role: "serviceCompany",
    companyName: "Valley Vineyard Professionals",
    phone: "(707) 555-1200",
    address: "369 Valley Floor Road, Deer Park, CA 94576",
    createdAt: "2023-04-05T00:00:00Z"
  },
  {
    id: "user-17",
    email: "elite@agservices.com",
    name: "Elite Agricultural Services",
    role: "serviceCompany",
    companyName: "Elite Agricultural Services",
    phone: "(707) 555-1300",
    address: "741 Elite Avenue, Pope Valley, CA 94567",
    createdAt: "2023-04-10T00:00:00Z"
  }
];
