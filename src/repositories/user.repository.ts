import { IUser } from "../interfaces/user.interface";
import { UserModel } from "../models/user.models";

class UserRepository {
  public async getList(): Promise<IUser[]> {
    return await UserModel.find();
  }

  public async create(dto: IUser): Promise<IUser> {
    return await UserModel.create(dto);
  }

  public async getOneUser(userId: string): Promise<IUser> {
    return await UserModel.findById(userId);
  }

  public async update(userId: string, dto: IUser): Promise<IUser> {
    return await UserModel.findByIdAndUpdate(userId, dto, {
      returnDocument: "after",
    });
  }

  public async deleteById(id: string): Promise<void> {
    await UserModel.deleteOne({ _id: id });
  }
  public async getByParams(params: Partial<IUser>): Promise<IUser> {
    return await UserModel.findOne(params);
  }
}

export const userRepository = new UserRepository();
