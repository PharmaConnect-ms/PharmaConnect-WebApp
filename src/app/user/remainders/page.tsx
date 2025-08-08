"use client";
import React from "react";
import { useRole } from "@/hooks/useRole";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RemainderTab from "./remindercomponents/reminderTab";

const Remainders = () => {
  useRole("user");
  return (
    <motion.div
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-center">
        <div className="flex flex-col gap-4 w-full p-8">
          <Tabs
            defaultValue="reminders"
            className=" flex flex-col w-full justify-center"
          >
            <TabsList className="justify-center items-center bg-white">
              <TabsTrigger value="reminders">Reminders</TabsTrigger>
              <TabsTrigger value="calender">Calender</TabsTrigger>
            </TabsList>
            <TabsContent value="reminders">
              <RemainderTab />
            </TabsContent>
            <TabsContent value="calender">
              Change your password here.
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </motion.div>
  );
};

export default Remainders;
