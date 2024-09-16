import { ApiError } from "../errors/api-error";
import { IUser } from "../interfaces/user.interface";
import { fsService } from "../services/fsService";

class UserRepository {
  public async getList(): Promise<IUser[]> {
    return await fsService.read();
  }

  public async create(dto: IUser): Promise<IUser> {
    const users = await fsService.read();
    const indexEmail = users.findIndex((user) => user.email === dto.email);
    const indexUsername = users.findIndex(
      (user) => user.username === dto.username,
    );
    if (indexEmail !== -1) {
      throw new ApiError("User with this email already exists", 409);
    }
    if (indexUsername !== -1) {
      throw new ApiError("User with this username already exists", 409);
    }
    const newUser = {
      id: users[users.length - 1].id + 1,
      username: dto.username,
      age: dto.age,
      email: dto.email,
      password: dto.password,
    };
    users.push(newUser);
    await fsService.write(users);
    return newUser;
  }

  public async getOneUser(id: number): Promise<IUser> {
    if (typeof id !== "number" || !Number.isInteger(id) || id <= 0) {
      throw new ApiError("Invalid user ID", 400);
    }
    const users = await fsService.read();
    const user = users.find((user) => user.id === id);
    if (!user) {
      throw new ApiError("User not found", 404);
    }
    return user;
  }

  public async update(id: number, dto: IUser): Promise<IUser> {
    const users = await fsService.read();
    const user = users.find((user) => user.id === id);
    const indexUsername = users.findIndex(
      (user) => user.username === dto.username && user.id !== id,
    );
    const indexEmail = users.findIndex(
      (user) => user.email === dto.email && user.id !== id,
    );
    if (!user) {
      throw new ApiError("User not found", 404);
    }
    if (indexUsername !== -1) {
      throw new ApiError("User with this username already exists", 409);
    }
    if (indexEmail !== -1) {
      throw new ApiError("User with this email already exists", 409);
    }
    if (dto.username) user.username = dto.username;
    if (dto.age) user.age = dto.age;
    if (dto.email) user.email = dto.email;
    if (dto.password) user.password = dto.password;

    await fsService.write(users);
    return user;
  }

  public async delete(id: number): Promise<void> {
    const users = await fsService.read();
    const index = users.findIndex((user) => user.id === id);
    if (typeof id !== "number" || !Number.isInteger(id) || id <= 0) {
      throw new ApiError("Invalid user ID", 400);
    }
    if (index === -1) {
      throw new ApiError("User not found", 404);
    }
    users.splice(index, 1);
    await fsService.write(users);
  }
}

export const userRepository = new UserRepository();
