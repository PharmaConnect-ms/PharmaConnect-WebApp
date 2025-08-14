import React, { useState } from "react";
import { Button, TextField } from "@mui/material";
import { useManagePatient } from "../../useManagePatient";




const AddPatientModalInfo: React.FC = () => {
    const [patientId, setPatientId] = useState<string | null>(null);
    const { onSelectPatient } = useManagePatient();

    return (
        <div className="flex flex-col space-y-4">
            <TextField
                label="Patient ID"
                value={patientId || ""}
                onChange={(e) => setPatientId(e.target.value)}
            />
            <Button variant="contained" color="primary" onClick={() => onSelectPatient(patientId)}>
                Select Patient
            </Button>
        </div>
    );
};

export default AddPatientModalInfo;