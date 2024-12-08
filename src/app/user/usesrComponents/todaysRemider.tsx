import React from "react";

const TodaysReminder = () => {
  const reminders = [
    {
      title: "Take your medication",
      time: "10:00 AM",
      hasDone: false,
    },
    {
      title: "Doctor appointment",
      time: "11:00 AM",
      hasDone: true,
    },
    {
      title: "Take your medication",
      time: "12:00 PM",
      hasDone: false,
    },
    {
      title: "Take your medication",
      time: "1:00 PM",
      hasDone: true,
    },
  ];

  const getRandomLightColor = () => {
    const r = Math.floor(Math.random() * 156) + 100; // 100–255 for a lighter red
    const g = Math.floor(Math.random() * 156) + 100; // 100–255 for a lighter green
    const b = Math.floor(Math.random() * 156) + 100; // 100–255 for a lighter blue
    return `rgb(${r}, ${g}, ${b})`;
  };

  return (
    <div className="bg-white mt-8 shadow-lg rounded-lg h-96  [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:bg-gray-300
  dark:[&::-webkit-scrollbar-track]:bg-neutral-700
  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500  overflow-y-scroll w-full">
      <div className="p-6">
        <h1 className="text-lg font-semibold">Today&apos;s Reminder</h1>
        <div className="flex flex-col gap-4 mt-4">
          {reminders.map((reminder, index) => (
            <div
              key={index}
              className="flex justify-between items-center bg-[#f8f8f8] p-4 rounded-lg shadow"
            >
              <div className="flex flex-row relative">
                <div
                  className="w-2 h-full absolute rounded-l-lg"
                  style={{ backgroundColor: getRandomLightColor() }}
                ></div>
                <div className="pl-4">
                  <h1 className="text-sm font-semibold">{reminder.title}</h1>
                  <p className="text-xs text-gray-500">{reminder.time}</p>
                </div>
              </div>
              <div>
                <input
                  type="checkbox"
                  checked={reminder.hasDone}
                  className="cursor-pointer"
                  
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TodaysReminder;
