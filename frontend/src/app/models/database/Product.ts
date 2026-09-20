import { DTO_MinimalUnit } from "../DTOs/DTO_MinimalUnit";
import { DTO_MinimalUser } from "../DTOs/DTO_MinimalUser";

export interface Product{
    pkProduct: number,
    serialNumber: string,
    name: string;
    minQuantity: number,
    quantity: number;
    minPrice: number;
    price: number;
    registerDate?: string;
    updateDate?: string;
    enable?: boolean

    //Fks
    createdBy?: DTO_MinimalUser,
    updatedBy?: DTO_MinimalUser,
    unit?: DTO_MinimalUnit
}