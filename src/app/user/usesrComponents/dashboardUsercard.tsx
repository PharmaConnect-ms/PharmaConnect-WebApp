import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import UserInformation from "./userInformation";

const DashboardUsercard = () => {
  return (
    <div className="flex items-center justify-center pt-24">
      <div className="bg-white flex flex-col absolute w-[90%] rounded-3xl h-auto p-8">
        <div className="flex items-center relative gap-5 w-full">
          <Avatar className="h-16 w-16">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-xl">UserName</h1>
            <p className="text-xs">Age</p>
          </div>
          <div className="absolute right-0 h-full">
            <Button variant="outline" className="bg-[#56AAF0] text-white">
              Edit Profile
            </Button>
          </div>
        </div>

        <div className="flex flex-row w-full gap-4 ">
          <UserInformation />
        </div>
      </div>
    </div>
  );
};

export default DashboardUsercard;
