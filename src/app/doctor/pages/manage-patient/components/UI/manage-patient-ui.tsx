import React from "react";
import { usePatientStore } from "../../patient-store";
import { Button } from "@mui/material";
import { useManagePatient } from "../../useManagePatient";
import PharmaModal from "@/components/ui/modal/pharma-modal";
import AddPrescriptionModal from "../modals/add-prescription-modal";

const ManagePatientUI: React.FC = () => {
    const { data , clearPatientData } = usePatientStore();
    const { onAddPrescription , isAddPrescriptionModalOpen , setIsAddPrescriptionModalOpen } = useManagePatient();

    return (
        <div>
            <h1>Manage Patient UI</h1>
            <p>This is the Manage Patient UI component.</p>
            <p>Selected Patient ID: {data.patientId}</p>
            <p>Selected Patient Name: {data.name}</p>
                {/*  these has to be replaced with actual components not as a buttons */}
            <div>
            {/*  Add the summery pf the patient*/}

            </div>
            <div className="flex items-center justify-center space-x-4 mt-10">
                <Button
                    variant="contained"
                    color="primary"
                    onClick={onAddPrescription}
                >
                    Add Prescription
                </Button>
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => alert("Clear Patient Data Clicked")}
                >
                   Add follow up record
                </Button>
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => clearPatientData()}
                >
                    Clear Patient Data
                </Button>
            </div>
            <PharmaModal
                open={isAddPrescriptionModalOpen}
                onClose={() => setIsAddPrescriptionModalOpen(false)}
            >
                <AddPrescriptionModal />
            </PharmaModal>
        </div>
    );
}

export default ManagePatientUI;
