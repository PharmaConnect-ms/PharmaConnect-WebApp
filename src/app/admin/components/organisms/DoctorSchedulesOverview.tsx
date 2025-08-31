/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import Loading from "@/components/ui/loading";
import { useAdminDashBoard } from "../../logic/use-admin-dashboard";
import DoctorScheduleCard from "./DoctorScheduleCard";
import { DoctorScheduleType } from "@/types/doctor-schedule";
import { Calendar, Search, Filter } from 'lucide-react';

const DoctorSchedulesOverview = () => {
    const { doctorSchedulesData, doctorSchedulesError, doctorSchedulesLoading } = useAdminDashBoard();

    if (doctorSchedulesLoading) {
        return <Loading />;
    }

    if (doctorSchedulesError) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-center">
                    <div className="text-red-500 text-lg font-medium">Error loading doctor schedules</div>
                    <p className="text-gray-500 mt-2">Please try refreshing the page</p>
                </div>
            </div>
        );
    }

    const schedules: DoctorScheduleType[] = doctorSchedulesData || [];

    return (
        <div className="p-6 space-y-6">
            {/* Header Section */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Calendar className="h-8 w-8 text-blue-600" />
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">Doctor Schedules Overview</h2>
                        <p className="text-gray-600 mt-1">Manage and view all doctor schedules</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-blue-50 px-4 py-2 rounded-lg">
                        <span className="text-blue-700 font-medium">{schedules.length} Schedules</span>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-600 text-sm font-medium">Active Schedules</p>
                            <p className="text-2xl font-bold text-green-700">
                                {schedules.filter(s => s.isActive).length}
                            </p>
                        </div>
                        <div className="bg-green-200 p-2 rounded-full">
                            <Calendar className="h-5 w-5 text-green-700" />
                        </div>
                    </div>
                </div>
                
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-orange-600 text-sm font-medium">Inactive Schedules</p>
                            <p className="text-2xl font-bold text-orange-700">
                                {schedules.filter(s => !s.isActive).length}
                            </p>
                        </div>
                        <div className="bg-orange-200 p-2 rounded-full">
                            <Filter className="h-5 w-5 text-orange-700" />
                        </div>
                    </div>
                </div>
                
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-600 text-sm font-medium">Total Doctors</p>
                            <p className="text-2xl font-bold text-purple-700">
                                {new Set(schedules.map(s => s.doctor.id)).size}
                            </p>
                        </div>
                        <div className="bg-purple-200 p-2 rounded-full">
                            <Search className="h-5 w-5 text-purple-700" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Schedules Grid */}
            {schedules.length === 0 ? (
                <div className="flex items-center justify-center p-12">
                    <div className="text-center">
                        <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-gray-900 mb-2">No schedules available</h3>
                        <p className="text-gray-500">There are currently no doctor schedules to display.</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {schedules.map((schedule) => (
                        <DoctorScheduleCard key={schedule.id} schedule={schedule} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default DoctorSchedulesOverview;
