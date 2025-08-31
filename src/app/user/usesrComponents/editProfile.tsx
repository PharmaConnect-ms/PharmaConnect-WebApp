import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useUpdateUserMutation } from "@/redux/api/UserApi";
import { useGetUserByIdQuery } from "@/redux/api/UserApi";

interface EditProfileProps {
    onChangeProfile: () => void;
    userId?: string | number; // Add userId prop to identify the user
}

interface FormData {
  username: string;
  phone: string;
  address: string;
  email: string;
  age: number;
}

const EditProfile: React.FC<EditProfileProps> = ({onChangeProfile, userId}) => {
  const [updateUser , {isLoading , isSuccess, isError}] = useUpdateUserMutation();
  const { data: userData } = useGetUserByIdQuery(userId as string);

  const [formData, setFormData] = useState<FormData>({
    username: '',
    phone: '',
    address: '',
    email: '',
    age: 0
  });

  // Initialize form with current user data
  useEffect(() => {
    if (userData) {
      setFormData({
        username: userData.username || '',
        phone: userData.phone || '',
        address: userData.address || '',
        email: userData.email || '',
        age: userData.age || 0
      });
    }
  }, [userData]);

  // Handle successful update
  useEffect(() => {
    if (isSuccess) {
      onChangeProfile();
    }
  }, [isSuccess, onChangeProfile]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateProfile = async () => {
    if (!userId) {
      console.error('User ID is required to update profile');
      return;
    }

    // Basic validation - ensure required fields are not empty
    if (!formData.username.trim()) {
      console.error('Username is required');
      return;
    }

    try {
      // Only send non-empty fields to the API
      const dataToUpdate = Object.entries(formData).reduce((acc, [key, value]) => {
        if (value && value.trim()) {
          acc[key as keyof FormData] = value.trim();
        }
        return acc;
      }, {} as Partial<FormData>);

      await updateUser({
        id: userId,
        data: dataToUpdate
      }).unwrap();
      // onChangeProfile will be called automatically when isSuccess becomes true
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

    
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
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              className="col-span-3 focus-visible:ring-[#56AAF0] focus-visible:ring-2 focus-visible:ring-offset-2"
              placeholder="Enter your username"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="phone" className="text">
              Number
            </label>
            <Input
              id="phone"
              type="text"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="col-span-3 focus-visible:ring-[#56AAF0] focus-visible:ring-2 focus-visible:ring-offset-2"
              placeholder="Enter your Phone Number"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="address" className="text">
              Address
            </label>
            <Input
              id="address"
              type="text"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className="col-span-3 focus-visible:ring-[#56AAF0] focus-visible:ring-2 focus-visible:ring-offset-2"
              placeholder="Enter your Address"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="email" className="text">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="col-span-3 focus-visible:ring-[#56AAF0] focus-visible:ring-2 focus-visible:ring-offset-2"
              placeholder="Enter your Email"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="age" className="text">
              Age
            </label>
            <Input
              id="age"
              type="number"
              value={formData.age}
              onChange={(e) => handleInputChange('age', e.target.value)}
              className="col-span-3 focus-visible:ring-[#56AAF0] focus-visible:ring-2 focus-visible:ring-offset-2"
              placeholder="Enter your Age"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <button 
          className="bg-[#56AAF0] text-white py-2 px-6 rounded-md flex ml-auto hover:bg-[#f8f8f8] hover:shadow-sm hover:text-black disabled:opacity-50 disabled:cursor-not-allowed" 
          onClick={updateProfile}
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : 'Save'}
        </button>
        {isError && (
          <div className="text-red-500 text-sm mt-2">
            Failed to update profile. Please try again.
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default EditProfile;
