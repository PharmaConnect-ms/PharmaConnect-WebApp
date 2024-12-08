import React from 'react'
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';

const UserInformation = () => {
  return (
    <div className="flex flex-col gap-4 mt-8  bg-[#F8F8FB] shadow-md rounded-lg p-6 w-96">
    <div className="text-sm text-gray-600 space-y-3">
      <div className="flex items-center">
        <PersonIcon className="text-gray-800 mr-2" />
        <span>User Full Name</span>
      </div>
      <div className="flex items-center">
        <PhoneIcon className="text-gray-800 mr-2" />
        <span>(123) 456-7890</span>
      </div>
      <div className="flex items-center">
        <HomeIcon className="text-gray-800 mr-2" />
        <span>123 Main St, City, Country</span>
      </div>
      <div className="flex items-center">
        <EmailIcon className="text-gray-800 mr-2" />
        <span>example@example.com</span>
      </div>
      <div className="flex items-center">
        <BadgeIcon className="text-gray-800 mr-2" />
        <span>PatientId</span>
      </div>
    </div>
  </div>
  )
}

export default UserInformation
