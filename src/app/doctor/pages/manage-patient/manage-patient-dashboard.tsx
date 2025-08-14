'use client';
import React from "react";
import { useManagePatient } from "./useManagePatient";
import PharmaModal from "@/components/ui/modal/pharma-modal";
import AddPatientModalInfo from "./components/modals/add-patients-modal";
import ManagePatientUI from "./components/UI/manage-patient-ui";

const ManagePatientDashboard: React.FC = () => {
    const { isPatientDataLoaded, setIsPatientDataLoaded } = useManagePatient();

    return (
        <div>
            <ManagePatientUI />
            <PharmaModal
                open={!isPatientDataLoaded}
                onClose={() => setIsPatientDataLoaded(true)}
                doesCloseOnBgClickAutomatically={false}
            >
                <AddPatientModalInfo />
            </PharmaModal>
        </div>
    );
};

export default ManagePatientDashboard;
