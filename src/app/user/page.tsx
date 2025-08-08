"use client";
import { useRole } from "@/hooks/useRole";
import DashboardHead from "./usesrComponents/dashboardHead";
import DashboardUsercard from "./usesrComponents/dashboardUsercard";
import { motion } from "framer-motion";


export default function UserProfile() {
  useRole("user");

  return (
    <motion.div
    initial={{ opacity: 0, x: -100 }} 
    animate={{ opacity: 1, x: 0 }}    
    exit={{ opacity: 0, x: 100 }}   
    transition={{ duration: 0.5 }}  
  >
      <header className="bg-white">
        <DashboardHead />
        <DashboardUsercard />
      </header>
    </motion.div>
  );
}
