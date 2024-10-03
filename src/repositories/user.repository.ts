import { IUser } from "../interfaces/user.interface";
import { Token } from "../models/token.model";
import { UserModel } from "../models/user.models";

class UserRepository {
  public async getList(): Promise<IUser[]> {
    return await UserModel.find();
  }

  public async create(dto: IUser): Promise<IUser> {
    return await UserModel.create(dto);
  }

  public async getOneUser(id: string): Promise<IUser> {
    return await UserModel.findById(id);
  }

  public async update(id: string, dto: Partial<IUser>): Promise<IUser> {
    return await UserModel.findByIdAndUpdate(id, dto, {
      returnDocument: "after",
    });
  }

  public async delete(id: string): Promise<void> {
    await UserModel.findByIdAndDelete(id);
  }
  public async getByParams(params: Partial<IUser>): Promise<IUser> {
    return await UserModel.findOne(params);
  }

  public async findWithOutActivityAfter(date: Date): Promise<IUser[]> {
    return await UserModel.aggregate([
      {
        $lookup: {
          from: Token.collection.name,
          let: { userId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_userId", "$$userId"] } } },
            { $match: { createdAt: { $gt: date } } },
          ],
          as: "tokens",
        },
      },
      {
        $match: { tokens: { $size: 0 } },
      },
    ]);
  }
}

export const userRepository = new UserRepository();
