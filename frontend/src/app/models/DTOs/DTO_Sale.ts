
export interface DTO_Sale {
  pkSale: number;
  discountAmount: number;
  receivedAmount: number;
  changeAmount: number;
  subtotal: number;
  total: number;
  registerDate: string;
  updateDate: string | null;
  enable: boolean;
  user: DTO_MinimalUser | null;
  payCard: boolean;
  payCash: boolean;
  payTransfer: boolean;
  details: DTO_DetailResponse[];
}

export interface DTO_MinimalUser {
  pkUser: number;
  name: string;
  lastname: string;
  role: string;
}

export interface DTO_DetailResponse {
  pkSaleDetail: number;
  quantity: number;
  unitPrice: number;
  discount: number;
  totalProduct: number;
  product: DTO_MinimalProduct | null;
}

export interface DTO_MinimalProduct {
  pkProduct: number;
  name: string;
  price: number;
  abbreviationUnit: string; 
}