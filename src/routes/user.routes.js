import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";

const router = Router()

// Register route: POST /api/v1/users/register
router.route("/register").post(registerUser)

export default router;
