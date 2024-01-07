export interface ProductBackend {
    name: string;
    price: number;
    userId: string;
    version?: number;
    id: string;
}

export interface Product {
    name: string;
    price: number;
    userId: string;
    id: string;
}
