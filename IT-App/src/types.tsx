export interface InventoryItem {
    asset: string;
    brand: string;
    category: string;
    createdBy: string;
    dateTime: string;
    dateUpdated: string;
    details: string;
    id: number;
    idTickets: string;
    model: string;
    quantity: number;
    receivedBy: string | null;
    status: string;
    totalPrice: string;
    vendor: string;
    batchID: number | null;
  }

export interface AssetItem {
    active: number;
    date_created: string;
    id: number;
    name: string;
}

export interface BrandItem {
    name: string;
}

export interface ModelItem {
    name: string;
}

export interface CategoryItem {
    active: number;
    date_created: string;
    id: number;
    name: string;
}