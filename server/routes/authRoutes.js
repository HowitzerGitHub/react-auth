import express from "express";
import { login, logout, register } from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);

// router.get("/", getGoals);

// router.route("/").get(getGoals).post(setGoals);
// router.route("/:id").delete(deleteGoal).put(updateGoals);

export default authRouter;
