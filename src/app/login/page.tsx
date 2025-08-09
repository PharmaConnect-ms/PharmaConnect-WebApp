"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoginBox from "./logincomponents/login-box/login-box";
import ImageBox from "./logincomponents/imageBox";
import SignupBox from "./logincomponents/signupBox";

export default function LoginPage() {
  const [isSignup, setIsSignup] = useState(true);

  function onSignupButtonClicked() {
    setIsSignup(true);
  }

  function onSignRedirectButtonClicked() {
    setIsSignup(false);
  }

  useEffect(() => {
    setIsSignup(false);
  }, []);

  if (typeof window !== 'undefined') {
    // client-specific rendering
  }
  
  return (
    <div className="flex bg-white justify-between h-screen overflow-hidden relative">
      {/* Form Section */}
      <div className="w-full bg-white relative md:w-1/2">
        <AnimatePresence mode="wait">
          {isSignup ? (
            <motion.div
              key="signup"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="absolute w-full"
            >
              <SignupBox
                signRedirectButtonClicked={onSignRedirectButtonClicked}
              />
            </motion.div>
          ) : (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="absolute w-full"
            >
              <LoginBox signupButtonClicked={onSignupButtonClicked} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Image Section */}
      <div className="hidden md:block w-[50%] bg-white">
        <motion.div
          key="Image"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <ImageBox />
        </motion.div>
      </div>
    </div>
  );
}
