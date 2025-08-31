"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import useLogout from "@/hooks/useLogout";

interface DoctorHeaderProps {
  name: string;
  profilePicture?: string;
  className?: string;
}

const DoctorHeader: React.FC<DoctorHeaderProps> = ({
  name,
  profilePicture,
  className = "",
}) => {
  const logout = useLogout();

  // Get initials for fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className={`p-6 bg-gradient-to-r from-blue-50 to-indigo-100 border-0 shadow-sm ${className}`}>
      <div className="flex items-center space-x-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="h-16 w-16 ring-2 ring-blue-200 ring-offset-2 cursor-pointer hover:ring-blue-300 transition-all">
              <AvatarImage
                src={profilePicture}
                alt={`Dr. ${name}`}
                className="object-cover"
              />
              <AvatarFallback className="bg-blue-500 text-white text-lg font-semibold">
                {getInitials(name)}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="start">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Dr. {name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  Medical Professional
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {/* <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Calendar className="mr-2 h-4 w-4" />
              <span>My Schedule</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem> */}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
              onClick={logout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">
            Dr. {name}
          </h1>
          <p className="text-gray-600 font-medium">
            Medical Professional
          </p>
        </div>

      </div>
    </Card>
  );
};

export default DoctorHeader;
