"use client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import NotificationsIcon from "@mui/icons-material/Notifications";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
} from "@/components/ui/sheet";

const DashboardHead = () => {
  const { logout } = useAuth();
  const Router = useRouter();

  const handleLogout = async () => {
    logout();
    Router.push("/login");
  };

  return (
    <div className="flex justify-between h-[200px] pb-28 items-center p-10 bg-[#56AAF0] rounded-bl-3xl rounded-br-3xl bg-[url('/userDashboardDesign.png')] bg-opacity-80 bg-cover bg-blend-overlay bg-[center_-100px]">
      <div className="flex flex-row justify-center gap-2 pb-5">
        <Sheet>
          <SheetTrigger>
            <MenuIcon sx={{ color: "white ", cursor: "pointer" }} />
          </SheetTrigger>

          <SheetContent
            side={"left"}
            className="w-72 rounded-tr-xl rounded-br-xl pt-10"
          >
            <SheetHeader></SheetHeader>
            <div className="w-full flex flex-col gap-2">
              <span className="text-lg font-semibold rounded-lg p-1 flex items-center justify-center hover:bg-[#56AAF0] hover:text-white hover:shadow-md hover:cursor-pointer">
                My History
              </span>
              <span className="text-lg font-semibold rounded-lg p-1 flex items-center justify-center hover:bg-[#56AAF0] hover:text-white hover:shadow-md hover:cursor-pointer">
                QR
              </span>
            </div>
          </SheetContent>
        </Sheet>

        <h1 className="text-xl text-white">Profile</h1>
      </div>
      <div className="flex items-center space-x-4">
        <motion.div
          whileHover={{
            rotate: [0, -10, 10, -10, 0],
            transition: {
              duration: 0.5,
              repeat: Infinity,
            },
          }}
          className="inline-block"
        >
          <NotificationsIcon className="text-white" />
        </motion.div>{" "}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar className="h-16 w-16">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogoutIcon />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default DashboardHead;
