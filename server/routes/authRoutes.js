import express from "express";
import {
  login,
  logout,
  register,
  sendVerificationOtp,
  verifyEmail,
} from "../controllers/authController.js";
import userAuth from "../middleware/userAuth.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.post("/send-verify-otp", userAuth, sendVerificationOtp);
authRouter.post("/verify-account", userAuth, verifyEmail);

// router.get("/", getGoals);

// router.route("/").get(getGoals).post(setGoals);
// router.route("/:id").delete(deleteGoal).put(updateGoals);

export default authRouter;
