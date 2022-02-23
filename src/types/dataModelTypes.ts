export interface BaseModelItem {
    id: string;
}

export interface StandardModelItem extends BaseModelItem {
    version?: number;
    createdAt: Date;
    updatedAt: Date;
}
