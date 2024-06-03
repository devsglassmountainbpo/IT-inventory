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
  }
  

  export interface DetailItem {
    id: number;
    name: string;
    value: string;
  }