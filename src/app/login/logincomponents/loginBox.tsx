"use client";
import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface LoginBoxProps {
  signupButtonClicked: () => void;
}

const LoginBox: React.FC<LoginBoxProps> = ({ signupButtonClicked }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (email === "admin@pharma.com" && password === "admin123") {
      login("admin", "Admin User", "admin123");
      router.push("/admin");
    } else if (email === "doctor@pharma.com" && password === "doctor123") {
      login("doctor", "Dr. John Doe", "doctor123");
      router.push("/doctor");
    } else if (email === "user@pharma.com" && password === "user123") {
      login("user", "Jane Doe", "user123");
      router.push("/user");
    } else {
      setError("Invalid credentials. Please try again.");
    }
  };

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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
