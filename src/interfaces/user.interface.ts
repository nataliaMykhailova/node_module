import { RoleEnum } from "../enums/role.enum";

export interface IUser {
  _id?: string;
  username: string;
  age: number;
  email: string;
  password: string;
  phone?: string;
  role: RoleEnum;
  isVerified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
