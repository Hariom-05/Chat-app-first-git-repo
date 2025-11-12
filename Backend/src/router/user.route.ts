import { Router } from "express";
import type { Request, Response } from "express";
import { userLogin, userRegister, userLogout, getAllUsers } from "../controllers/user.controller";
import { authUser } from "../middlewares/auth.middleware";
const router: Router = Router();

router.post("/login", (req: Request, res: Response) => userLogin(req, res));
router.post("/register", (req: Request, res: Response) => userRegister(req, res));
router.post("/logout", (req: Request, res: Response) => userLogout(req, res));
router.get("/getusers", authUser, (req: Request, res: Response) => getAllUsers(req, res));


export default router;
