import { Router } from "express";

import { userController } from "../controllers/user.controller";
import { commonMiddleware } from "../middlewares/common.middleware";
import { UserValidator } from "../validators/user.validators";

const router = Router();

router.get("/", userController.getList);
router.post(
  "/",
  commonMiddleware.isValidCreateDto(UserValidator.createUser),
  userController.create,
);

router.get(
  "/:userId",
  commonMiddleware.isValidId("userId"),
  userController.getOneUser,
);
router.put(
  "/:userId",
  commonMiddleware.isValidId("userId"),
  commonMiddleware.isValidUpdateDto(UserValidator.updateUser, [
    "username",
    "age",
    "email",
    "phone",
  ]),
  userController.update,
);
router.delete(
  "/:userId",
  commonMiddleware.isValidId("userId"),
  userController.deleteById,
);

export const userRouter = router;
