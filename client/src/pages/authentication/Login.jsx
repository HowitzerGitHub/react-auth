import React, { useState } from "react";
import { assets } from "../../assets/assets";

const Login = () => {
  const [state, setState] = useState("signup"); // login-signup
  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        src={assets.logo}
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      ></img>
      <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm">
        <h2 className="text-3xl font-semibold text-white text-center mb-3">
          {state === "signup" ? "Create Account" : "Login"}
        </h2>
        <p className="text-center text-sm mb-6">
          {state === "signup" ? "Create Your Account" : "Login to your Account"}
        </p>
        <form>
          {state === "signup" && (
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
              <img src={assets.person_icon}></img>
              <input
                className="outline-none bg-transparent"
                type="text"
                placeholder="Full Name"
                required
              ></input>
            </div>
          )}
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.mail_icon}></img>
            <input
              className="outline-none bg-transparent"
              type="email"
              placeholder="E-mail"
              required
            ></input>
          </div>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.lock_icon}></img>
            <input
              className="outline-none bg-transparent"
              type="password"
              placeholder="Password"
              required
            ></input>
          </div>
          <p className="mb-4 text-indigo-500 cursor-pointer">
            Forgot Password?
          </p>
          <button className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium">
            {state === "signup" ? "Sign Up" : "Login"}
          </button>
        </form>
        {state === "signup" ? (
          <p className="text-gray-400 text-center text-xs mt-4">
            Already Have an Account?{" "}
            <span
              onClick={() => {
                setState("login");
              }}
              className="text-blue-400 underline cursor-pointer"
            >
              Login Here!
            </span>
          </p>
        ) : (
          <p className="text-gray-400 text-center text-xs mt-4">
            Dont Have an Accont?{" "}
            <span
              onClick={() => {
                setState("signup");
              }}
              className="text-blue-400 underline cursor-pointer"
            >
              SignUp!
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
