export interface SaleItem {
  _id: string;
  date: string;
  price: number;
  customerEmail: string;
  customerPhone: string;
  __v: number;
}

export interface TotalSalesItem {
  day: string;
  totalSale: number;
}

export interface SalesResponse {
  results: {
    TotalSales: TotalSalesItem[];
    Sales: SaleItem[];
  };
  pagination: {
    before: string;
    after: string;
  };
}

export interface AuthResponse {
  token: string;
  expire: number;
}

export interface SalesFilters {
  startDate: string;
  endDate: string;
  priceMin?: string;
  email?: string;
  phone?: string;
  sortBy: 'date' | 'price';
  sortOrder: 'asc' | 'desc';
  after?: string;
  before?: string;
}
