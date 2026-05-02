export enum PricePolicy {
    GLOBAL_ENFORCED = 'GLOBAL_ENFORCED',
    LOCAL_ALLOWED = 'LOCAL_ALLOWED'
}

export interface TenantSettings {
    pricePolicy: PricePolicy;
    // Other settings can be added here
}
