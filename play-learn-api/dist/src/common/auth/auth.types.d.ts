export declare const ROLE_VALUES: readonly ["admin", "learner"];
export type UserRole = (typeof ROLE_VALUES)[number];
export type JwtPayload = {
    sub: string;
    email: string;
    role: UserRole;
};
