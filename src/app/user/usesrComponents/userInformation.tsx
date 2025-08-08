import React from "react";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import HomeIcon from "@mui/icons-material/Home";
import EmailIcon from "@mui/icons-material/Email";
import BadgeIcon from "@mui/icons-material/Badge";

const UserInformation = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = user.username || "UserName";
  const userPhone = user.phone || "-";
  const userEmail = user.email || "-"
    const userId = user.id || "-";

  return (
    <div className="flex flex-col gap-6 mt-8 h-96 bg-white shadow-lg rounded-xl p-8 pt-3 w-full">
      <h2 className="text-lg font-semibold text-gray-800">
        User Information
      </h2>
      <div className="text-sm text-gray-600 space-y-4">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
            <PersonIcon />
          </div>
          <span className="font-medium text-gray-700">{userName}</span>
        </div>
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
            <PhoneIcon />
          </div>
          <span className="font-medium text-gray-700">{userPhone}</span>
        </div>
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
            <HomeIcon />
          </div>
          <span className="font-medium text-gray-700">
           {userPhone}
          </span>
        </div>
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
            <EmailIcon />
          </div>
          <span className="font-medium text-gray-700">
            {userEmail}
          </span>
        </div>
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
            <BadgeIcon />
          </div>
          <span className="font-medium text-gray-700">{userId}</span>
        </div>
      </div>
    </div>
  );
};

export default UserInformation;
