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
  verifyOtpExpiredAt: {
    type: Number,
    default: 0,
  },
  isAccountVerified: {
    type: Boolean,
    default: false,
  },
  verifyOtp: {
    type: String,
    default: "",
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
