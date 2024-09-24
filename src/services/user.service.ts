import { ApiError } from "../errors/api-error";
import { IUser } from "../interfaces/user.interface";
import { userRepository } from "../repositories/user.repository";

class UserService {
  public async getList(): Promise<IUser[]> {
    return await userRepository.getList();
  }

  public async getMe(id: string): Promise<IUser> {
    return await userRepository.getOneUser(id);
  }
  public async getOneUser(id: string): Promise<IUser> {
    return await userRepository.getOneUser(id);
  }

  public async updateMe(id: string, dto: IUser): Promise<IUser> {
    return await userRepository.update(id, dto);
  }

  public async deleteMe(id: string): Promise<void> {
    const user = await userRepository.getOneUser(id);
    if (!user) {
      throw new ApiError("User not found", 404);
    }
    await userRepository.delete(id);
  }
}

export const userService = new UserService();
