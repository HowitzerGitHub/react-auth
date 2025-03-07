import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    default: "",
  },
  verifyOtpExpiredAt: {
    type: Number,
    default: 0,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  resetOtp: {
    type: String,
    default: "",
  },
  resetOtpExpiredAt: {
    type: Number,
    default: 0,
  },
});

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
