"use client";
import React from "react";
import { useLoginLogic } from "./useLoginLogic";


interface LoginBoxProps {
  signupButtonClicked: () => void;
}

const LoginBox: React.FC<LoginBoxProps> = ({ signupButtonClicked }) => {
  const { emailOrUsername, setEmailOrUsername, password, setPassword, error, isLoading, handleLogin } = useLoginLogic();

  return (
    <div className="flex justify-center items-center h-screen ">
      <div className="w-1/2">
        <h1 className="text-2xl font-bold text-center mb-4">
          Login to PharmaConnect
        </h1>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>} 
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700" 
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full text-white py-2 px-4 rounded-lg hover:opacity-90 transition bg-gradient-to-r from-[#42C5E7] to-[#56AAF0]"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-gray-600 mt-4 text-center">
          New To PharmaConnect ?{" "}
          <a
            className="text-blue-400 hover:underline hover:cursor-pointer"
            onClick={signupButtonClicked}
          >
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginBox;
