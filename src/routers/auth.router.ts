import { Router } from "express";

import { authController } from "../controllers/auth.controller";
import { ActionTokenTypeEnum } from "../enums/action-token-type.enum";
import { authMiddleware } from "../middlewares/auth.middleware";
import { commonMiddleware } from "../middlewares/common.middleware";
import { UserValidator } from "../validators/user.validators";

const router = Router();

router.post(
  "/sign-up",
  commonMiddleware.isValidCreateDto(UserValidator.createUser),
  authController.signUp,
);
router.post(
  "/sign-in",
  commonMiddleware.isValidCreateDto(UserValidator.loginUser),
  authController.signIn,
);
router.post(
  "/refresh",
  authMiddleware.checkRefreshToken,
  authController.refreshToken,
);
router.post("/logout", authMiddleware.checkAccessToken, authController.logout);
router.post(
  "/logout-all",
  authMiddleware.checkAccessToken,
  authController.logoutAll,
);
router.post(
  "/forgot-password",
  commonMiddleware.isBodyValid(UserValidator.forgotPassword),
  authController.forgotPassword,
);
router.put(
  "/forgot-password",
  commonMiddleware.isBodyValid(UserValidator.forgotPasswordSet),
  authMiddleware.checkActionToken(ActionTokenTypeEnum.FORGOT_PASSWORD),
  authController.forgotPasswordSet,
);
router.post(
  "/verify",
  authMiddleware.checkActionToken(ActionTokenTypeEnum.VERIFY_EMAIL),
  authController.verifyEmail,
);
router.post(
  "/change-password",
  authMiddleware.checkAccessToken,
  commonMiddleware.isBodyValid(UserValidator.changePassword),
  authController.changePassword,
);

export const authRouter = router;
