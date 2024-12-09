"use client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import UserInformation from "./userInformation";
import TodaysReminder from "./todaysRemider";
import UserFeatures from "./userFeatures";
import EditProfile from "./editProfile";
import Grid from "@mui/material/Grid2";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const DashboardUsercard = () => {
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
                <h1 className="text-xl">UserName</h1>
                <p className="text-xs">Age</p>
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
            <Dialog>
              <DialogTrigger>
                <Button variant="outline" className="bg-[#56AAF0] text-white">
                  Edit Profile
                </Button>
              </DialogTrigger>
              <DialogContent>
                <EditProfile />
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
