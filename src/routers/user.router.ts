import { Router } from "express";

import { userController } from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { commonMiddleware } from "../middlewares/common.middleware";
import { UserValidator } from "../validators/user.validators";
import {fileMiddleware} from "../middlewares/file.middleware";
import {avatarConfig} from "../constants/image.constant";

const router = Router();

router.get("/", userController.getList);

router.get("/me", authMiddleware.checkAccessToken, userController.getMe);
router.put(
  "/:id",
  authMiddleware.checkAccessToken,
  commonMiddleware.isValidUpdateDto(UserValidator.updateUser, [
    "username",
    "age",
    "email",
    "phone",
  ]),
  userController.updateMe,
);
router.delete("/me", authMiddleware.checkAccessToken, userController.deleteMe);
router.get("/:id", commonMiddleware.isValidId("id"), userController.getOneUser);
router.post(
  "/me/avatar",
  authMiddleware.checkAccessToken,
  fileMiddleware.isFileValid("avatar", avatarConfig),
  userController.uploadAvatar,
);
router.delete(
  "/me/avatar",
  authMiddleware.checkAccessToken,
  userController.deleteAvatar,
);

export const userRouter = router;
