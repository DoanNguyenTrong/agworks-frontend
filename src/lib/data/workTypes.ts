
import { WorkType } from "@/lib/types";

export const workTypes: WorkType[] = [
  // Pruning Tasks
  {
    _id: "worktype-1",
    name: "1001 - Winter Pruning",
    description: "Dormant season pruning to remove excess canes and shape the vine for optimal fruit production",
    category: "pruning",
    paymentType: "per_vine",
    baseRate: 0.75,
    season: "winter",
    skillLevel: "intermediate",
    equipment: ["Pruning shears", "Loppers", "Hand saw"],
    createdBy: "customer-1",
    isActive: true,
    createdAt: "2023-01-15T00:00:00Z",
    updatedAt: "2023-01-15T00:00:00Z"
  },
  {
    _id: "worktype-2",
    name: "1002 - Summer Pruning",
    description: "Light pruning during growing season to improve air circulation and sun exposure",
    category: "pruning",
    paymentType: "per_hour",
    baseRate: 0.50,
    season: "summer",
    skillLevel: "entry",
    equipment: ["Pruning shears", "Gloves"],
    createdBy: "customer-1",
    isActive: true,
    createdAt: "2023-01-15T00:00:00Z",
    updatedAt: "2023-01-15T00:00:00Z"
  },
  {
    _id: "worktype-3",
    name: "1003 - Shoot Thinning",
    description: "Remove excess shoots to concentrate vine energy on remaining productive shoots",
    category: "pruning",
    paymentType: "per_acre",
    baseRate: 125.00,
    season: "spring",
    skillLevel: "intermediate",
    equipment: ["Pruning shears", "Collection bags"],
    createdBy: "customer-1",
    isActive: true,
    createdAt: "2023-01-15T00:00:00Z",
    updatedAt: "2023-01-15T00:00:00Z"
  },

  // Maintenance Tasks
  {
    _id: "worktype-4",
    name: "2001 - Trellis Repair",
    description: "Repair and maintain trellis systems including posts, wires, and anchors",
    category: "maintenance",
    paymentType: "per_hour",
    baseRate: 22.00,
    season: "year_round",
    skillLevel: "intermediate",
    equipment: ["Wire cutters", "Tensioners", "Post driver", "Wire"],
    createdBy: "customer-1",
    isActive: true,
    createdAt: "2023-01-15T00:00:00Z",
    updatedAt: "2023-01-15T00:00:00Z"
  },
  {
    _id: "worktype-5",
    name: "2002 - Irrigation Maintenance",
    description: "Check and repair drip irrigation systems, replace emitters and fix leaks",
    category: "maintenance",
    paymentType: "per_task",
    baseRate: 85.00,
    season: "spring",
    skillLevel: "expert",
    equipment: ["Pipe cutters", "Emitters", "Pressure gauge", "Repair fittings"],
    createdBy: "customer-1",
    isActive: true,
    createdAt: "2023-01-15T00:00:00Z",
    updatedAt: "2023-01-15T00:00:00Z"
  },
  {
    _id: "worktype-6",
    name: "2003 - Weed Control",
    description: "Manual and mechanical weed removal around vine bases and rows",
    category: "maintenance",
    paymentType: "per_acre",
    baseRate: 95.00,
    season: "spring",
    skillLevel: "entry",
    equipment: ["Hoes", "Hand weeders", "Mulch"],
    createdBy: "customer-1",
    isActive: true,
    createdAt: "2023-01-15T00:00:00Z",
    updatedAt: "2023-01-15T00:00:00Z"
  },

  // Harvest Tasks
  {
    _id: "worktype-7",
    name: "3001 - Hand Harvest",
    description: "Careful hand picking of premium grapes for high-quality wine production",
    category: "harvest",
    paymentType: "per_hour",
    baseRate: 16.50,
    season: "fall",
    skillLevel: "entry",
    equipment: ["Harvest bins", "Pruning shears", "Collection bags"],
    createdBy: "customer-1",
    isActive: true,
    createdAt: "2023-01-15T00:00:00Z",
    updatedAt: "2023-01-15T00:00:00Z"
  },
  {
    _id: "worktype-8",
    name: "3002 - Machine Harvest Support",
    description: "Assist mechanical harvester operation and quality control",
    category: "harvest",
    paymentType: "per_hour",
    baseRate: 19.00,
    season: "fall",
    skillLevel: "intermediate",
    equipment: ["Sorting tables", "Quality control tools"],
    createdBy: "customer-1",
    isActive: true,
    createdAt: "2023-01-15T00:00:00Z",
    updatedAt: "2023-01-15T00:00:00Z"
  },

  // Planting Tasks
  {
    _id: "worktype-9",
    name: "4001 - Vine Planting",
    description: "Plant new grapevines including hole preparation and initial staking",
    category: "planting",
    paymentType: "per_vine",
    baseRate: 2.25,
    season: "spring",
    skillLevel: "intermediate",
    equipment: ["Shovels", "Stakes", "Ties", "Measuring tools"],
    createdBy: "customer-1",
    isActive: true,
    createdAt: "2023-01-15T00:00:00Z",
    updatedAt: "2023-01-15T00:00:00Z"
  },
  {
    _id: "worktype-10",
    name: "4002 - Cover Crop Seeding",
    description: "Plant cover crops between vine rows for soil health and erosion control",
    category: "planting",
    paymentType: "per_acre",
    baseRate: 45.00,
    season: "fall",
    skillLevel: "entry",
    equipment: ["Seed spreader", "Rake", "Seeds"],
    createdBy: "customer-1",
    isActive: true,
    createdAt: "2023-01-15T00:00:00Z",
    updatedAt: "2023-01-15T00:00:00Z"
  },

  // Spraying Tasks
  {
    _id: "worktype-11",
    name: "5001 - Pest Control Spraying",
    description: "Apply pest control treatments using backpack or tractor-mounted sprayers",
    category: "spraying",
    paymentType: "per_acre",
    baseRate: 35.00,
    season: "spring",
    skillLevel: "expert",
    equipment: ["Sprayer", "PPE", "Chemicals"],
    createdBy: "customer-1",
    isActive: true,
    createdAt: "2023-01-15T00:00:00Z",
    updatedAt: "2023-01-15T00:00:00Z"
  },
  {
    _id: "worktype-12",
    name: "5002 - Foliar Nutrition",
    description: "Apply foliar nutrients to improve vine health and fruit quality",
    category: "spraying",
    paymentType: "per_acre",
    baseRate: 28.00,
    season: "summer",
    skillLevel: "intermediate",
    equipment: ["Sprayer", "Nutrients", "pH meter"],
    createdBy: "customer-1",
    isActive: true,
    createdAt: "2023-01-15T00:00:00Z",
    updatedAt: "2023-01-15T00:00:00Z"
  },

  // Cultivation Tasks
  {
    _id: "worktype-13",
    name: "6001 - Soil Cultivation",
    description: "Mechanical cultivation between rows for weed control and soil aeration",
    category: "cultivation",
    paymentType: "per_acre",
    baseRate: 75.00,
    season: "spring",
    skillLevel: "intermediate",
    equipment: ["Tractor", "Cultivator", "Fuel"],
    createdBy: "customer-1",
    isActive: true,
    createdAt: "2023-01-15T00:00:00Z",
    updatedAt: "2023-01-15T00:00:00Z"
  },
  {
    _id: "worktype-14",
    name: "6002 - Compost Application",
    description: "Spread organic compost around vine bases for soil enrichment",
    category: "cultivation",
    paymentType: "per_task",
    baseRate: 150.00,
    season: "fall",
    skillLevel: "entry",
    equipment: ["Spreader", "Compost", "Rakes"],
    createdBy: "customer-1",
    isActive: true,
    createdAt: "2023-01-15T00:00:00Z",
    updatedAt: "2023-01-15T00:00:00Z"
  },

  // Additional tasks for other customers
  {
    _id: "worktype-15",
    name: "7001 - Canopy Management",
    description: "Leaf removal and shoot positioning for optimal sun exposure",
    category: "maintenance",
    paymentType: "per_hour",
    baseRate: 17.50,
    season: "summer",
    skillLevel: "intermediate",
    equipment: ["Pruning shears", "Clips", "Ties"],
    createdBy: "customer-2",
    isActive: true,
    createdAt: "2023-01-16T00:00:00Z",
    updatedAt: "2023-01-16T00:00:00Z"
  }
];
