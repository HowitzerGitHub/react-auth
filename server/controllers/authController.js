import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import transporter from "../config/nodemailer.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!(name && email && password))
    return res.status(200).json({ success: false, message: "Missing Details" });
  try {
    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.json({ success: false, message: "User Already exists" });
    }

    const hasedPassword = await bcrypt.hash(password, 5);

    const user = new userModel({ name, email, password: hasedPassword });

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV == "production",
      sameSite: process.env.NODE_ENV == "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    //sending welcome email

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "You are onboarded",
      text: `Welcome, you are onboarded, your account with email id ${email} has been created`,
    };
    await transporter.sendMail(mailOptions);

    return res.json({ success: true });
  } catch (error) {
    return res.status(400).json({ suceess: false, message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!(email && password))
    return res
      .status(400)
      .json({ success: "False", Message: "Email and Password are required" });

  try {
    const user = await userModel.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ suceess: false, message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res
        .status(400)
        .json({ suceess: false, message: "Password Incorrect" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV == "production",
      sameSite: process.env.NODE_ENV == "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.json({ success: true });
  } catch (error) {
    return res.status(400).json({ suceess: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV == "production",
      sameSite: process.env.NODE_ENV == "production" ? "none" : "strict",
    });

    return res.json({ success: true, message: "Logged Out" });
  } catch (error) {
    return res.status(400).json({ suceess: false, message: error.message });
  }
};

export const sendVerificationOtp = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await userModel.findById(userId);

    if (user.isAccountVerified)
      res.json({ success: false, message: "Account Already Verified" });

    const OTP = String(Math.floor(100000 + Math.random() * 900000));

    user.verfyOtp = OTP;
    user.verifyOtpExpiredAt = Date.now() + 24 * 60 * 60 * 1000;

    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Account verification OTP",
      text: `Please verify your account ${user.email} , OTP is ${OTP}`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "Verification OTP sent on email" });
  } catch (error) {
    return res.status(400).json({ suceess: false, message: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  const { userId, otp } = req.body;

  if (!userId || !otp)
    return res.json({ success: false, message: "Missing details" });

  try {
    const user = await userModel.findById(userId);

    if (!user) return res.json({ sucess: false, message: "User not found" });

    if (user.verfyOtp === "" || user.verfyOtp !== otp) {
      return res.json({ sucess: false, message: "Invalid OTP, resend OTP" });
    }

    if (user.verifyOtpExpiredAt < Date.now()) {
      if (!user) return res.json({ sucess: false, message: "OTP Expired" });
    }
    user.isAccountVerified = true;

    user.verifyOtp = "";
    user.verifyOtpExpiredAt = 0;

    await user.save();

    return res.json({ success: true, message: "Email Verified Successfully" });
  } catch (error) {
    return res.json({ success: false, message: "Missing details" });
  }
};

export const isAuthenticated = async (req, res) => {
  try {
    //automatically authenticated using middleware
    return res.json({ success: true });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

//send password reset OTP
export const sendResetOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.json({ success: false, message: "Email is required" });
  try {
    const user = await userModel.findOne({ email });
    if (!user)
      return res.json({ success: false, message: "User not registered" });

    const OTP = String(Math.floor(100000 + Math.random() * 900000));

    user.resetOtp = OTP;
    user.resetOtpExpiredAt = Date.now() + 24 * 60 * 60 * 1000;

    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Reset Password OTP",
      text: `Please, OTP is ${OTP}`,
    };

    await transporter.sendMail(mailOptions);
    return res.json({
      success: true,
      message: "Reset password OTP sent to your email",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!(email && otp && newPassword))
    return res.json({
      success: false,
      message: "Email, otp and password are required",
    });

  try {
    const user = await userModel.findOne({ email });
    if (!user) return res.json({ success: false, message: "User not found" });
    if (user.resetOtp == "" || user.resetOtp !== otp)
      return res.json({ success: false, message: "Invalid otp" });
    if (user.resetOtpExpiredAt < Date.now())
      return res.json({ success: false, message: "Otp expired" });
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetOtp = "";
    user.resetOtpExpiredAt = 0;
    user.save();
    return res.json({ success: true, message: "Password Updated" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
