import { DTO_Item } from "./DTO_Item";

export interface DTO_GenerateSale{

    fkUser: number | null;
    total: number | null;
    receivedAmount?: number | null;
    changeAmount?: number | null;
    discountAmount?: number | null ,
    subtotal?: number | null, 
    items: DTO_Item[];
}