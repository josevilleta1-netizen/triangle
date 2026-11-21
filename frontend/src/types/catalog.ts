export interface Category {
  id: string;
  name: string;
  icon: string | null;
  _count?: {
    products: number;
  };
}

export interface ProductBatch {
  id: string;
  batchNumber: string;
  expirationDate: string;
  remainingQuantity: number;
}

export interface Product {
  id: string;
  sku: string;
  barcode: string | null;
  name: string;
  description: string | null;
  unitOfMeasure: string;
  costPrice: number;
  salePrice: number;
  taxRate: number;
  minStock: number;
  locationShelf: string | null;
  imageUrl: string | null;
  category: {
    id: string;
    name: string;
    icon: string | null;
  };
  stock: {
    current: number;
    status: 'NORMAL' | 'LOW' | 'OUT_OF_STOCK';
    lastUpdated: string;
  };
  batches: ProductBatch[];
}

export interface InventoryAlerts {
  expiringCount: number;
  lowStockCount: number;
  expiringBatches: Array<{
    id: string;
    productName: string;
    categoryName: string;
    batchNumber: string;
    expirationDate: string;
    remainingQuantity: number;
    daysRemaining: number;
    isExpired: boolean;
  }>;
  lowStockProducts: Product[];
}
