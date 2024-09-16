import { ApiError } from "../errors/api-error";
import { IUser } from "../interfaces/user.interface";
import { userRepository } from "../repositories/user.repository";

class UserService {
  public async getList(): Promise<IUser[]> {
    return await userRepository.getList();
  }

  public async create(dto: IUser): Promise<IUser> {
    const { username, age, email, password } = dto;

    if (!username || username.length < 3) {
      throw new ApiError(
        "Name is required and should be at least 3 characters",
        400,
      );
    }
    if (!email || !email.includes("@")) {
      throw new ApiError("Email is required and should be valid", 400);
    }
    if (!password || password.length < 6) {
      throw new ApiError(
        "Password is required and should be at least 6 characters",
        400,
      );
    }
    if (
      !username ||
      typeof username !== "string" ||
      username.length < 3 ||
      username.length > 20
    ) {
      throw new ApiError(
        "Missing or invalid data in the field username. The username field is required, must be a string between 3 and 20 characters!!!!",
        400,
      );
    }
    if (!age || typeof age !== "number" || age < 0 || age > 120) {
      throw new ApiError(
        "Missing or invalid data in the field age. The age field is required, must be a number between 0 and 120.",
        400,
      );
    }
    if (
      !email ||
      typeof email !== "string" ||
      email.length < 5 ||
      email.length > 50 ||
      !email.includes("@")
    ) {
      throw new ApiError(
        "Missing or invalid data in the field email. The email field must be a string between 5 and 50 characters and contain an @ symbol.",
        400,
      );
    }
    if (
      !password ||
      typeof password !== "string" ||
      password.length < 5 ||
      password.length > 50
    ) {
      throw new ApiError(
        "Missing or invalid data in the field password. The password field is required, must be a string between 8 and 50 characters",
        400,
      );
    }
    if (!/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
      throw new ApiError(
        "The password must contain at least one digit and one letter",
        400,
      );
    }
    return await userRepository.create(dto);
  }

  public async getOneUser(id: number): Promise<IUser> {
    return await userRepository.getOneUser(id);
  }

  public async update(id: number, dto: IUser): Promise<IUser> {
    const { username, age, email, password } = dto;
    if (username) {
      if (
        typeof username !== "string" ||
        username.length < 3 ||
        username.length > 20
      ) {
        throw new ApiError(
          "Missing or invalid data in the field username. The username field is required, must be a string between 3 and 20 characters.",
          400,
        );
      }
    }
    if (age) {
      if (typeof age !== "number" || age < 0 || age > 120) {
        throw new ApiError(
          "Missing or invalid data in the field age. The age field is required, must be a number between 0 and 120.",
          400,
        );
      }
    }
    if (email) {
      if (
        typeof email !== "string" ||
        email.length < 5 ||
        email.length > 50 ||
        !email.includes("@")
      ) {
        throw new ApiError(
          "Missing or invalid data in the field email. The email field must be a string between 5 and 50 characters and contain an @ symbol.",
          400,
        );
      }
    }
    if (password) {
      if (
        typeof password !== "string" ||
        password.length < 8 ||
        password.length > 50
      ) {
        throw new ApiError(
          "Missing or invalid data in the field password. The password field is required, must be a string between 8 and 50 characters.",
          400,
        );
      }
      if (!/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
        throw new ApiError(
          "The password must contain at least one digit and one letter",
          400,
        );
      }
    }
    return await userRepository.update(id, dto);
  }

  public async delete(id: number): Promise<void> {
    await userRepository.delete(id);
  }
}

export const userService = new UserService();
