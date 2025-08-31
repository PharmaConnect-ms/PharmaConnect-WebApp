import { selectAuthUser } from "@/redux/features/authSlice";
import { useSelector } from "react-redux";
import DoctorHeader from "@/components/DoctorHeader";
import DoctorSchedulesView from "../components/organisms/DoctorSchedulesView";


const DoctorDashboard: React.FC = () => {
    const user = useSelector(selectAuthUser);


    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <DoctorHeader 
                name={user?.name || "Unknown"} 
                className="mb-8"
            />
            <DoctorSchedulesView />
        </div>
    );
}

export default DoctorDashboard;


