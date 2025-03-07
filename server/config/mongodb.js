import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log(
        `MongoDB connected : ${mongoose.connection.host}`.cyan.underline
      );
    });
    await mongoose.connect(`${process.env.MONGODB_URL}mern-auth`);
  } catch (error) {
    console.log("Mongo not connecting", error);
    process.exit(1);
  }
};

export default connectDB;
