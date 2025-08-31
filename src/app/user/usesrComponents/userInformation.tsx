import React from "react";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import HomeIcon from "@mui/icons-material/Home";
import EmailIcon from "@mui/icons-material/Email";
import BadgeIcon from "@mui/icons-material/Badge";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
//import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import { useSelector } from 'react-redux';
import { selectAuthUser } from '@/redux/features/authSlice';
import { useGetUserByIdQuery } from "@/redux/api/UserApi";

const UserInformation = () => {
  const user = useSelector(selectAuthUser);
  const { data: userData } = useGetUserByIdQuery(user?.userID ?? "");



  // Helper function to display field value or placeholder
  const displayField = (value: string | undefined | null, placeholder: string = "Please update your profile") => {
    return value && value.trim() !== "" ? value : placeholder;
  };

  const userName = displayField(userData?.username, "UserName");
  const userAge = displayField(userData?.age !== undefined && userData?.age !== null ? String(userData.age) : undefined);
  const userPhone = displayField(userData?.phone);
  const userAddress = displayField(userData?.address);
  const userEmail = displayField(userData?.email);
  const userRole = displayField(userData?.role);
  


  return (
    <div className="flex flex-col gap-6 mt-8 bg-white shadow-lg rounded-xl p-8 pt-3 w-full max-h-96 overflow-y-auto">
      <h2 className="text-lg font-semibold text-gray-800">
        User Information
      </h2>
      <div className="text-sm text-gray-600 space-y-4">
        {/* Name */}
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
            <PersonIcon />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 mb-1">Full Name</span>
            <span className={`font-medium ${userData?.username ? 'text-gray-700' : 'text-orange-500 italic'}`}>
              {userName}
            </span>
          </div>
        </div>

        {/* Role */}
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-teal-100 text-teal-600 mr-4">
            <AccountCircleIcon />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 mb-1">Role</span>
            <span className={`font-medium capitalize ${userData?.role ? 'text-gray-700' : 'text-orange-500 italic'}`}>
              {userRole}
            </span>
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
            <PhoneIcon />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 mb-1">Phone Number</span>
            <span className={`font-medium ${userData?.phone ? 'text-gray-700' : 'text-orange-500 italic'}`}>
              {userPhone}
            </span>
          </div>
        </div>

        {/* Email */}
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
            <EmailIcon />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 mb-1">Email Address</span>
            <span className={`font-medium ${userData?.email ? 'text-gray-700' : 'text-orange-500 italic'}`}>
              {userEmail}
            </span>
          </div>
        </div>

        {/* Address */}
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
            <HomeIcon />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 mb-1">Home Address</span>
            <span className={`font-medium ${userData?.address ? 'text-gray-700' : 'text-orange-500 italic'}`}>
              {userAddress}
            </span>
          </div>
        </div>

        {/* Age */}
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
            <BadgeIcon />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 mb-1">Age</span>
            <span className={`font-medium ${userData?.age ? 'text-gray-700' : 'text-orange-500 italic'}`}>
              {userAge}
            </span>
          </div>
        </div>
      </div>
      
      {/* Update Profile Reminder */}
      {(!userData?.age || !userData?.phone || !userData?.address || !userData?.email) && (
        <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <p className="text-sm text-orange-700">
            <span className="font-semibold">Incomplete Profile:</span> Please update your missing information for a complete profile experience.
          </p>
        </div>
      )}
    </div>
  );
};

export default UserInformation;
