import { DTO_Item } from "./DTO_Item";

export interface DTO_GenerateSale {
    fkUser: number | null;
    total: number | null;
    receivedAmount?: number | null;
    changeAmount?: number | null;
    discountAmount?: number | null;
    subtotal?: number | null;
    
    // Métodos de pago (Montos recibidos)
    cashReceived?: number | null;
    cardReceived?: number | null;
    transferReceived?: number | null;

    // Métodos de pago (Banderas/Indicadores)
    payCash?: boolean | number | null;
    payCard?: boolean | number | null;
    payTransfer?: boolean | number | null;

    items: DTO_Item[];
}