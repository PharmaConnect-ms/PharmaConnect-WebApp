import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import NotificationsIcon from "@mui/icons-material/Notifications";

const DashboardHead = () => {
  return (
    <div className="flex justify-between items-center p-10 bg-[#56AAF0] rounded-bl-3xl rounded-br-3xl bg-[url('/userDashboardDesign.png')] bg-opacity-80 bg-cover bg-blend-overlay bg-[center_-100px]">
      <h1 className="text-xl text-white pb-5">Profile</h1>
      <div className="flex items-center space-x-4">
        <NotificationsIcon className="text-white" />
        <Avatar className="h-16 w-16">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
};

export default DashboardHead;
