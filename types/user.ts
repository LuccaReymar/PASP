export enum UserRole {
  PA = "PA",
  ADMIN = "ADMIN",
}

export type UserType = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
};
