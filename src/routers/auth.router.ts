import { Router } from "express";

import { authController } from "../controllers/auth.controller";
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

export const authRouter = router;
