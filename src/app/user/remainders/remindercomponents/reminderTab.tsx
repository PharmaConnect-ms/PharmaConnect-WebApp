"use client";
import React, { useState } from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { motion } from "framer-motion";

const RemainderTab = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Generate an array of 11 days (-5 to +5 from the currentDate)
  const generateDateRange = (centerDate: string | number | Date) => {
    const dates = [];
    for (let i = -5; i <= 5; i++) {
      const newDate = new Date(centerDate);
      newDate.setDate(new Date(centerDate).getDate() + i);
      dates.push(newDate);
    }
    return dates;
  };

  interface MoveDateRangeProps {
    direction: number;
  }

  const moveDateRange = (direction: MoveDateRangeProps["direction"]) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + direction * 1);
    setCurrentDate(newDate);
  };

  const dateRange = generateDateRange(currentDate);

  return (
    <motion.div
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col items-center gap-4 w-full">
        {/* Navigation Buttons */}
        <div className="flex justify-center w-full mb-4">
          <div className="flex justify-center items-center  h-100">
            <motion.button
              onClick={() => moveDateRange(-1)}
              whileTap={{ scale: 0.9 }}
              className="p-4 pr-3 mr-4 rounded-2xl h-1/2 flex items-center justify-center  hover:shadow-md hover:shadow-[#42C5E7] group"
            >
              <ArrowBackIosIcon
                sx={{
                  fontSize: 20,
                  transition: "color", // Smooth color transition
                }}
                className="group-hover:text-[#56AAF0]"
              />
            </motion.button>
          </div>

          {/* Date Range Display */}
          <div className="flex gap-2 overflow-x-auto overflow-y-hidden md:overflow-hidden scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-10">
            {dateRange.map((date) => {
              const isSelected =
                date.toDateString() === selectedDate.toDateString();
              const istoday = date.toDateString() === new Date().toDateString();
              const ispreviousday = date < new Date();
              return (
                <motion.div
                  key={date.toISOString()}
                  initial={{ scale: 1, opacity: 0.7 }}
                  animate={
                    isSelected
                      ? { scale: 1, opacity: 1 }
                      : { scale: 1, opacity: 0.7 }
                  }
                  transition={{ duration: 0.3 }}
                  className={`p-4 rounded border cursor-pointer text-center ${
                    isSelected
                      ? "bg-[#56AAF0] text-white font-bold w-36 mr-1 ml-1 rounded-lg"
                      : istoday
                      ? "bg-[#f8f8f8] hover:bg-gray-200 w-16 text-[#00618A]"
                      : ispreviousday ? "bg-[#f8f8f8] hover:bg-gray-200 w-16 text-[#FF0000]"
                      : "bg-[#f8f8f8] hover:bg-gray-200 w-16"
                  }`}
                  onClick={() => setSelectedDate(date)}
                >
                  <div className="text-sm font-semibold">
                    {date.toLocaleString("default", { month: "short" })}
                  </div>
                  <div className="text-lg">{date.getDate()}</div>
                </motion.div>
              );
            })}
          </div>

          <div className="flex justify-center items-center  h-100">
            <motion.button
              onClick={() => moveDateRange(1)}
              whileTap={{ scale: 0.9 }}
              className="p-4 pr-3 ml-4 rounded-2xl h-1/2 flex items-center justify-center  hover:shadow-md hover:shadow-[#42C5E7] group"
            >
              <ArrowForwardIosIcon
                sx={{
                  fontSize: 20,
                  transition: "color", // Smooth color transition
                }}
                className="group-hover:text-[#56AAF0]"
              />
            </motion.button>
          </div>

         
        </div>

        {/* Selected Date */}
        <motion.div
          key={selectedDate.toISOString()}
          className="text-lg font-bold"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          Selected Date: {selectedDate.toDateString()}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default RemainderTab;
