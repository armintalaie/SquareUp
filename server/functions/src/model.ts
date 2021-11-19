export interface ClientDoc {
    storeId: string;
    storeToken: string;
    storeName: string;
    InternalPointsRecieved: number;
    InternalPointsRedeemed: number;
    ExternalPointsRecieved: number;
    ExternalPointsRedeemed: number;

}

export interface ProgramInfo {
    stores: string[];
    storeActivities: StoreMap;
    storeCount: number;
    programName: string;
    id: string;
   
}

export interface Activity {
    [clientNumber: string]: StoreMap;
}

export interface StoreMap {
    [storeId: string]: boolean;
}


export interface ClientInfo {
    programId: string;
    storeId: string;
    storeName: string;
    isActive: boolean;
}