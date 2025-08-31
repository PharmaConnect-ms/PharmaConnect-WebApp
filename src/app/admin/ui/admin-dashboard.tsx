/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import AdminHeader from "@/app/admin/components/AdminHeader";
import { useAdminDashBoard } from "../logic/use-admin-dashboard";
import { CircularProgress } from "@mui/material";
import DoctorSchedules from "../components/DoctorScheduler";

const AdminDashboardUI = () => {
    const { userData, userError, userLoading, doctorsError, doctorsLoading } = useAdminDashBoard();

    if (userLoading || doctorsLoading) {
        return <CircularProgress />;
    }

    if (userError || doctorsError) {
        return <div>Error loading data</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <AdminHeader 
                name={userData?.username || "Admin"} 
                className="mb-8"
            />
            <DoctorSchedules />
        </div>
    );
};

export default AdminDashboardUI;
