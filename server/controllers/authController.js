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
  const { userId, OTP } = req.body;

  if (!user || !OTP)
    return res.json({ success: false, message: "Missing details" });

  try {
    const user = await userModel.findById(userId);

    if (!user) return res.json({ sucess: false, message: "User not found" });

    if (user.verfyOtp === "" || user.verfyOtp !== OTP) {
      if (!user) return res.json({ sucess: false, message: "Invalid OTP" });
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
