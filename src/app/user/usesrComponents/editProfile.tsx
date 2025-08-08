import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface EditProfileProps {
    onChangeProfile: () => void;
}


const EditProfile: React.FC<EditProfileProps> = ({onChangeProfile}) => {

const updateProfile = () => {
    onChangeProfile()
}

    
  return (
    <Card className="border-none">
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
        <CardDescription>
          Make changes to your profile here. Click save when you&apos;re done.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 py-4">
         
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="username" className="text">
              Username
            </label>
            <Input
              id="username"
              type="text"
              className="col-span-3 focus-visible:ring-[#56AAF0] focus-visible:ring-2 focus-visible:ring-offset-2"
              placeholder="Enter your username"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="username" className="text">
              Number
            </label>
            <Input
              id="username"
              type="number"
              className="col-span-3 focus-visible:ring-[#56AAF0] focus-visible:ring-2 focus-visible:ring-offset-2"
              placeholder="Enter your Phone Number"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="username" className="text">
              Address
            </label>
            <Input
              id="username"
              type="text"
              className="col-span-3 focus-visible:ring-[#56AAF0] focus-visible:ring-2 focus-visible:ring-offset-2"
              placeholder="Enter your Address"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="username" className="text">
              Email
            </label>
            <Input
              id="username"
              type="email"
              className="col-span-3 focus-visible:ring-[#56AAF0] focus-visible:ring-2 focus-visible:ring-offset-2"
              placeholder="Enter your Email"
            />
          </div>
        
        </div>
      </CardContent>
      <CardFooter>
      <button className="bg-[#56AAF0] text-white py-2 px-6 rounded-md flex ml-auto hover:bg-[#f8f8f8] hover:shadow-sm hover:text-black" onClick={updateProfile}>
      Save
        </button>
      </CardFooter>
    </Card>
  );
};

export default EditProfile;
