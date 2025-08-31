/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { useState } from "react";
import { useRegisterMutation } from "@/redux/api/authApi";
import { useLoginLogic } from "./login-box/useLoginLogic";
import { CircularProgress } from "@mui/material";

interface SignupBoxProps {
  signRedirectButtonClicked: () => void;
}

const SignupBox: React.FC<SignupBoxProps> = ({ signRedirectButtonClicked }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [register, { isLoading }] = useRegisterMutation();
  const { handleSignUp, isLoading: isLoginLoading } = useLoginLogic();


  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (error) setError("");
    const payload = {
      username: name,
      email: email,
      password: password,
      role: "patient",
      provider: "local",
    };

    register(payload)
      .unwrap()
      .then((res: any) => {
        if (res) {
          console.log("User registered successfully:", res);
          handleSignUp({ email, password });
        } else {
          setError("Registration failed. Please try again.");
        }
      })
      .catch((err: any) => {
        console.error("Error during registration:", err);
        setError("Registration failed. Please try again.");
      });

  };

  if (typeof window !== 'undefined') {
    // client-specific rendering
  }

  if (isLoading || isLoginLoading) {
    return <CircularProgress />;
  }

  return (
    <div className="flex justify-center items-center h-screen ">
      <div className="w-1/2 p-6">
        <h1 className="text-2xl font-bold text-center mb-4">Sign Up</h1>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSignup}>
          {/* Name Field */}
          <div className="mb-4 w-full">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your name"
            />
          </div>

          {/* Email Field */}
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your email"
            />
          </div>

          {/* Password Field */}
          <div className="mb-4">
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
          <p className="text-sm hover:underline text-blue-400 pb-3 text-right hover:cursor-pointer">
            Forgot Password
          </p>

          {/* Submit Button */}
          <button
            type="submit"
            onClick={handleSignup}
            className="w-full text-white py-2 px-4 rounded-lg hover:opacity-90 transition bg-gradient-to-r from-[#42C5E7] to-[#56AAF0]"
          >
            Sign Up
          </button>
        </form>

        <p className="text-sm text-gray-600 mt-4 text-center">
          Already have an account?{" "}
          <a
            className="text-blue-500 hover:underline hover:cursor-pointer"
            onClick={signRedirectButtonClicked}
          >
            Log In
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignupBox;
