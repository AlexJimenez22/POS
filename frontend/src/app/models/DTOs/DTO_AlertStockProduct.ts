
export interface DTO_AlertStockProduct {
    pkProduct: number;
    name: string;
    minQuantity: number;
    quantity: number;
    state: 'warning' | 'urgent';
}