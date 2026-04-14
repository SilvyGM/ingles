export const ROLE_VALUES = ['admin', 'learner'] as const;

export type UserRole = (typeof ROLE_VALUES)[number];

export type JwtPayload = {
  sub: string;
  email: string;
  role: UserRole;
};
