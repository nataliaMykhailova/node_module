import { Router } from "express";

import { userController } from "../controllers/user.controller";

const router = Router();

router.get("/", userController.getList);
router.post("/", userController.create);

router.get("/:id", userController.getOneUser);
router.put("/:id", userController.update);
router.delete("/:id", userController.delete);

export const userRouter = router;
