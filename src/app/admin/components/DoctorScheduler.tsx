"use client";

import React from "react";
import { useAdminDashBoard } from "../logic/use-admin-dashboard";
import { Button } from "@/components/ui/button";
import Loading from "@/components/ui/loading";
import PharmaModal from "@/components/ui/modal/pharma-modal";
import AddNewDoctorScheduleModal from "./modals/AddNewDoctorSchedule";
import DoctorSchedulesOverview from "./organisms/DoctorSchedulesOverview";



const DoctorSchedules = () => {
    const { doctorsError, doctorsLoading, setAddNewScheduleModalOpen, addNewScheduleModalOpen } = useAdminDashBoard();

    if (doctorsLoading) {
        return <Loading />;
    }

    if (doctorsError) {
        return <div>Error loading doctor data</div>;
    }

    return (
        <>
            <div className="">
                <div className="flex justify-end relative">
                    <Button onClick={() => setAddNewScheduleModalOpen(true)}>Add New Schedule</Button>
                </div>
                <DoctorSchedulesOverview />
            </div>
            <PharmaModal
                open={addNewScheduleModalOpen}
                onClose={() => setAddNewScheduleModalOpen(false)}
            >
                <AddNewDoctorScheduleModal onClose={() => setAddNewScheduleModalOpen(false)} />
            </PharmaModal>
        </>
    );
};

export default DoctorSchedules;
