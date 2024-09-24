import { NextFunction, Request, Response } from "express";

import { IUser } from "../interfaces/user.interface";
import { userService } from "../services/user.service";

class UserController {
  public async getList(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await userService.getList();
      res.json(result);
    } catch (e) {
      next(e);
    }
  }
  public async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.res.locals.jwtPayload.userId as string;
      const result = await userService.getMe(id);
      res.json(result);
    } catch (e) {
      next(e);
    }
  }
  public async getOneUser(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const result = await userService.getOneUser(id);
      res.json(result);
    } catch (e) {
      next(e);
    }
  }
  public async updateMe(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.res.locals.jwtPayload.userId as string;
      const dto = req.body as IUser;
      const result = await userService.updateMe(id, dto);
      res.status(201).json(result);
    } catch (e) {
      next(e);
    }
  }
  public async deleteMe(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.res.locals.jwtPayload.userId as string;
      await userService.deleteMe(id);
      res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  }
}

export const userController = new UserController();
