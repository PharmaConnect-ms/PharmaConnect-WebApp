"use client";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import UserInformation from "./userInformation";
import TodaysReminder from "./todaysRemider";
import UserFeatures from "./userFeatures";
import EditProfile from "./editProfile";
import Grid from "@mui/material/Grid2";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useSelector } from 'react-redux';
import { selectAuthUser } from '@/redux/features/authSlice';
import { useGetUserByIdQuery } from "@/redux/api/UserApi";


const DashboardUsercard = () => {
  const user = useSelector(selectAuthUser);
  const userId = user?.userID;
  const [open, setOpen] = useState(false);
  const { data: userData } = useGetUserByIdQuery(userId as string);

  const handleChangeProfile = () => {
    setOpen(false);
  };

  const userName = userData?.username || "UserName";
  const userAge = userData?.age || "";

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{
        paddingTop: { xs: "900px", md: "320px" },
      }}
    >
      <Grid
        container
        direction="column"
        sx={{
          position: "absolute",
          width: "90%",
          borderRadius: "24px",
          backgroundColor: "white",
          height: "auto",
          padding: "32px",
        }}
      >
        <Grid container>
          <Grid size={{ xs: 9 }}>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-xl">{userName}</h1>
                <p className="text-xs">{userAge}</p>
              </div>
            </div>
          </Grid>
          <Grid
            size={{ xs: 3 }}
            sx={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger>
                <Button variant="outline" className="bg-[#56AAF0] text-white">
                  Update Profile
                </Button>
              </DialogTrigger>
              <DialogContent>
                <EditProfile onChangeProfile={handleChangeProfile} userId={userId} />
              </DialogContent>
            </Dialog>
          </Grid>
        </Grid>

        {/* components */}
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 5 }}>
            <UserInformation />
          </Grid>
          <Grid size={{ xs: 12, md: 7 }}>
            <TodaysReminder />
          </Grid>
          <Grid size={{ xs: 12, md: 12 }}>
            <UserFeatures />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default DashboardUsercard;
