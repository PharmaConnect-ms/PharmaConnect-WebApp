import { selectAuthUser } from "@/redux/features/authSlice";
import { useSelector } from "react-redux";
import { Button } from "@mui/material";
import { useDoctorDashboard } from "./useDoctorDashboard";


const DoctorDashboard: React.FC = () => {
    const user = useSelector(selectAuthUser);
    const { onClickManagePatient } = useDoctorDashboard();


    return (
        <div>
            <h1>Welcome, Dr. {user?.name}</h1>
            <p>This is the Doctor Dashboard</p>
            <Button variant="contained" color="primary" onClick={onClickManagePatient}>
                Manage Patient

            </Button>
        </div>
    );
}

export default DoctorDashboard;


