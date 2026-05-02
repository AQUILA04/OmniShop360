export interface UserProfile {
    sub: string;
    name: string;
    preferred_username?: string;
    email?: string;
    given_name?: string;
    family_name?: string;
    roles?: string[];
    [key: string]: any; // Allow for other potential claims
}
