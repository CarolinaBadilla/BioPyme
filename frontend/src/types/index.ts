export interface Company {
  id: number;
  name: string;
  cuit: string;
  address: string;
  latitude: number;
  longitude: number;
  type: "planta" | "expendio" | "almacenadora";
  
  // Precios y costos
  biodieselPrice: number;
  fossilDieselPrice: number;
  variableCost: number;
  fixedCost: number;
  
  // Stock y demanda
  stockLiters: number;
  monthlyDemand: number;
  dailyCapacity: number;
  productionMonth: number;
  
  // Cámara
  knowsChamber: boolean;
  isAssociated: boolean;
  wantsToAssociate: boolean;
  
  // Estado del proyecto
  projectStatus: string;
  
  // Tecnología
  equipment: string;
  
  // Capacidad nominal
  nominalCapacityRange: string;
  
  // Habilitaciones
  hasSecEnergyLicense: boolean;
  hasSelloB100: boolean;
  secEnergyProcessStatus: string;
  
  // Calidad
  qualityControlled: boolean;
  hasAnalysis: boolean;
  satisfactoryResult: boolean;
  labReference: string;
  
  // Aceite
  oilType: string;
  
  // Certificaciones
  qualityCertified: boolean;
  selloB100: boolean;
  
  // Empleos
  employees: number;
  
  // Relaciones
  sellsTo?: { expendioId: number; monthlyLiters: number }[];
}

export interface User {
  id: number;
  email: string;
  role: string;
  companyId?: number;
}

// 👇 AGREGAR ESTO - EXPORTAR Filters
export interface Filters {
  search: string;
  type: string;
  minStock: number;
  minProduction: number;
  maxProduction: number;
}

export interface RegisterData {
  email: string;
  password: string;
  companyName: string;
  cuit: string;
  address: string;
  latitude?: number;
  longitude?: number;
}