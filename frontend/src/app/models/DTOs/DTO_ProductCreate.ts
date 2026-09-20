
export interface DTO_ProductCreate{
    name: string;
    serialNumber: string;
    minQuantity: number,
    quantity: number;
    minPrice: number | null;
    price: number | null;
    enable?: boolean
    fkCreatedBy?: number,
    fkUpdatedBy?: number,
    fkUnit?: number
}