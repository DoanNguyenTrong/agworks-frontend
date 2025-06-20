import { WorkOrder } from "@/lib/types";

const baseWorkOrders: WorkOrder[] = [
  {
    id: "order-1",
    siteId: "site-1",
    blockId: "block-1",
    address: "1234 North Hill Rd, Napa, CA 94558",
    startDate: "2023-06-15T08:00:00Z",
    endDate: "2023-06-20T17:00:00Z",
    workType: "pruning",
    neededWorkers: 4,
    expectedHours: 30,
    payRate: 22.50,
    acres: 5.2,
    rows: 120,
    vines: 3600,
    notes: "Focus on removing excess foliage to improve air circulation.",
    status: "completed",
    createdAt: "2023-06-10T09:00:00Z",
    createdBy: "user-3",
    serviceCompanyIds: ["user-6", "user-7"]
  },
  {
    id: "order-2",
    siteId: "site-1",
    blockId: "block-2",
    address: "1234 North Hill Rd, Napa, CA 94558",
    startDate: "2023-07-01T08:00:00Z",
    endDate: "2023-07-05T17:00:00Z",
    workType: "shootThinning",
    neededWorkers: 3,
    expectedHours: 25,
    payRate: 23.00,
    acres: 3.8,
    rows: 90,
    vines: 2700,
    status: "inProgress",
    createdAt: "2023-06-25T10:00:00Z",
    createdBy: "user-3",
    serviceCompanyIds: ["user-6"],
    acceptedByServiceCompanyId: "user-6"
  },
  {
    id: "order-3",
    siteId: "site-2",
    blockId: "block-3",
    address: "5678 South Valley Ave, Sonoma, CA 95476",
    startDate: "2023-07-10T08:00:00Z",
    endDate: "2023-07-15T17:00:00Z",
    workType: "other",
    neededWorkers: 5,
    expectedHours: 35,
    payRate: 24.00,
    acres: 4.5,
    rows: 110,
    vines: 3300,
    notes: "Leaf removal around fruit zone to increase sun exposure.",
    status: "published",
    createdAt: "2023-07-01T11:00:00Z",
    createdBy: "user-3",
    serviceCompanyIds: ["user-6", "user-7", "user-8"]
  },
  {
    id: "order-4",
    siteId: "site-3",
    blockId: "block-4",
    address: "9012 East Ridge Dr, Calistoga, CA 94515",
    startDate: "2023-07-20T08:00:00Z",
    endDate: "2023-07-25T17:00:00Z",
    workType: "pruning",
    neededWorkers: 6,
    expectedHours: 40,
    payRate: 25.00,
    acres: 6.0,
    rows: 140,
    vines: 4200,
    status: "draft",
    createdAt: "2023-07-05T12:00:00Z",
    createdBy: "user-3",
    serviceCompanyIds: ["user-8", "user-9", "user-10"]
  },
  {
    id: "order-5",
    siteId: "site-1",
    blockId: "block-1",
    address: "1234 North Hill Rd, Napa, CA 94558",
    startDate: "2023-08-01T08:00:00Z",
    endDate: "2023-08-03T17:00:00Z",
    workType: "pruning",
    neededWorkers: 3,
    expectedHours: 20,
    payRate: 24.50,
    acres: 4.0,
    rows: 100,
    vines: 3000,
    status: "published",
    createdAt: "2023-07-25T09:00:00Z",
    createdBy: "user-3",
    serviceCompanyIds: ["user-6", "user-11"]
  },
  {
    id: "order-6",
    siteId: "site-2",
    blockId: "block-3",
    address: "5678 South Valley Ave, Sonoma, CA 95476",
    startDate: "2023-08-05T08:00:00Z",
    endDate: "2023-08-08T17:00:00Z",
    workType: "shootThinning",
    neededWorkers: 4,
    expectedHours: 28,
    payRate: 23.75,
    acres: 3.5,
    rows: 85,
    vines: 2550,
    status: "inProgress",
    createdAt: "2023-07-28T10:00:00Z",
    createdBy: "user-3",
    serviceCompanyIds: ["user-7", "user-12"],
    acceptedByServiceCompanyId: "user-7"
  },
  {
    id: "order-7",
    siteId: "site-3",
    blockId: "block-4",
    address: "9012 East Ridge Dr, Calistoga, CA 94515",
    startDate: "2023-08-10T08:00:00Z",
    endDate: "2023-08-14T17:00:00Z",
    workType: "other",
    neededWorkers: 5,
    expectedHours: 32,
    payRate: 25.25,
    acres: 5.5,
    rows: 130,
    vines: 3900,
    notes: "Canopy management and shoot positioning",
    status: "completed",
    createdAt: "2023-08-01T11:00:00Z",
    createdBy: "user-3",
    serviceCompanyIds: ["user-8", "user-13"]
  },
  {
    id: "order-8",
    siteId: "site-1",
    blockId: "block-2",
    address: "1234 North Hill Rd, Napa, CA 94558",
    startDate: "2023-08-15T08:00:00Z",
    endDate: "2023-08-18T17:00:00Z",
    workType: "pruning",
    neededWorkers: 2,
    expectedHours: 18,
    payRate: 22.00,
    acres: 2.8,
    rows: 70,
    vines: 2100,
    status: "draft",
    createdAt: "2023-08-05T12:00:00Z",
    createdBy: "user-3",
    serviceCompanyIds: ["user-9", "user-14"]
  },
  {
    id: "order-9",
    siteId: "site-2",
    blockId: "block-3",
    address: "5678 South Valley Ave, Sonoma, CA 95476",
    startDate: "2023-08-20T08:00:00Z",
    endDate: "2023-08-23T17:00:00Z",
    workType: "shootThinning",
    neededWorkers: 6,
    expectedHours: 36,
    payRate: 26.00,
    acres: 6.2,
    rows: 150,
    vines: 4500,
    status: "published",
    createdAt: "2023-08-10T13:00:00Z",
    createdBy: "user-3",
    serviceCompanyIds: ["user-10", "user-15"]
  },
  {
    id: "order-10",
    siteId: "site-3",
    blockId: "block-4",
    address: "9012 East Ridge Dr, Calistoga, CA 94515",
    startDate: "2023-08-25T08:00:00Z",
    endDate: "2023-08-28T17:00:00Z",
    workType: "other",
    neededWorkers: 4,
    expectedHours: 24,
    payRate: 24.75,
    acres: 4.8,
    rows: 115,
    vines: 3450,
    notes: "Fruit zone leaf removal",
    status: "inProgress",
    createdAt: "2023-08-15T14:00:00Z",
    createdBy: "user-3",
    serviceCompanyIds: ["user-11", "user-16"],
    acceptedByServiceCompanyId: "user-11"
  }
];

// Adding the remaining orders to reach 50+ total
const additionalOrders: WorkOrder[] = [];
for (let i = 11; i <= 60; i++) {
  const statuses: WorkOrder["status"][] = ["draft", "published", "inProgress", "completed", "cancelled"];
  const workTypes: WorkOrder["workType"][] = ["pruning", "shootThinning", "other"];
  const siteIds = ["site-1", "site-2", "site-3"];
  const blockIds = ["block-1", "block-2", "block-3", "block-4"];
  const serviceCompanyIds = ["user-6", "user-7", "user-8", "user-9", "user-10", "user-11", "user-12", "user-13", "user-14", "user-15", "user-16", "user-17", "user-18", "user-19", "user-20", "user-21", "user-22", "user-23", "user-24", "user-25", "user-26", "user-27"];
  
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
  const randomWorkType = workTypes[Math.floor(Math.random() * workTypes.length)];
  const randomSiteId = siteIds[Math.floor(Math.random() * siteIds.length)];
  const randomBlockId = blockIds[Math.floor(Math.random() * blockIds.length)];
  
  // Select 1-3 random service companies
  const shuffledCompanies = [...serviceCompanyIds].sort(() => 0.5 - Math.random());
  const selectedCompanies = shuffledCompanies.slice(0, Math.floor(Math.random() * 3) + 1);
  
  const startDate = new Date(2023, 7 + Math.floor(i/10), (i % 28) + 1);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 5) + 1);
  
  additionalOrders.push({
    id: `order-${i}`,
    siteId: randomSiteId,
    blockId: randomBlockId,
    address: `Address for order ${i}`,
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    workType: randomWorkType,
    neededWorkers: Math.floor(Math.random() * 6) + 2,
    expectedHours: Math.floor(Math.random() * 30) + 15,
    payRate: Math.floor(Math.random() * 500 + 2000) / 100,
    acres: Math.floor(Math.random() * 500 + 200) / 100,
    rows: Math.floor(Math.random() * 100) + 50,
    vines: Math.floor(Math.random() * 2000) + 1500,
    notes: Math.random() > 0.5 ? `Special instructions for order ${i}` : undefined,
    status: randomStatus,
    createdAt: new Date(startDate.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: "user-3",
    serviceCompanyIds: selectedCompanies,
    acceptedByServiceCompanyId: randomStatus === "inProgress" || randomStatus === "completed" ? 
      selectedCompanies[Math.floor(Math.random() * selectedCompanies.length)] : undefined
  });
}

export const workOrders: WorkOrder[] = [
  ...baseWorkOrders,
  ...additionalOrders
];
