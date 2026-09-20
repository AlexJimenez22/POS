
export interface User{
    pkUser: number;
    name: string;
    lastname: string;
    role: string;
    mail: string;
    registerDate?: string;
    updateDate?: string;
    enable?: boolean;
}