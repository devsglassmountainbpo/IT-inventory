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
    active: number;
    date_created: string;
    id: number;
    id_category: number;
    name: string;
    name_category: string;
}

export interface ModelItem {
    active: number;
    date_created: string;
    id: number;
    name: string;
    name_brand: string;
    name_category: string;
}

export interface CategoryItem {
    active: number;
    date_created: string;
    id: number;
    name: string;
}