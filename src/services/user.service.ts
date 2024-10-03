import { UploadedFile } from "express-fileupload";

import { ApiError } from "../errors/api-error";
import { IUser } from "../interfaces/user.interface";
import { userRepository } from "../repositories/user.repository";
import { s3Service } from "./s3.service";

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
  public async uploadAvatar(
    userId: string,
    file: UploadedFile,
  ): Promise<IUser> {
    const user = await userRepository.getOneUser(userId);
    const avatar = await s3Service.uploadFile("user", userId, file);

    const updatedUser = await userRepository.update(userId, { avatar });

    if (user.avatar) {
      await s3Service.deleteFile(user.avatar);
    }

    return updatedUser;
  }

  public async deleteAvatar(userId: string): Promise<IUser> {
    const user = await userRepository.getOneUser(userId);

    if (user.avatar) {
      await s3Service.deleteFile(user.avatar);
    }

    return await userRepository.update(userId, { avatar: null });
  }
}

export const userService = new UserService();
