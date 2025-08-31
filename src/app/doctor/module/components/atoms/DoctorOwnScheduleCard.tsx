import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DoctorScheduleType } from '@/types/doctor-schedule';
import { Calendar, Clock, Timer, Activity, Users, CheckCircle, XCircle } from 'lucide-react';

interface DoctorOwnScheduleCardProps {
  schedule: DoctorScheduleType;
  onClickDoctorSchedule: (id: string) => void;
}

const DoctorOwnScheduleCard: React.FC<DoctorOwnScheduleCardProps> = ({ schedule, onClickDoctorSchedule }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    const time = new Date(`1970-01-01T${timeString}`);
    return time.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const calculateTotalHours = () => {
    const start = new Date(`1970-01-01T${schedule.startTime}`);
    const end = new Date(`1970-01-01T${schedule.endTime}`);
    const diffMs = end.getTime() - start.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    return diffHours.toFixed(1);
  };

  const getTotalSlots = () => {
    return Math.floor((parseFloat(calculateTotalHours()) * 60) / schedule.slotDurationMinutes);
  };

  const isToday = () => {
    const today = new Date().toDateString();
    const scheduleDate = new Date(schedule.date).toDateString();
    return today === scheduleDate;
  };

  const isPast = () => {
    const today = new Date();
    const scheduleDate = new Date(schedule.date);
    today.setHours(0, 0, 0, 0);
    scheduleDate.setHours(0, 0, 0, 0);
    return scheduleDate < today;
  };

  const isUpcoming = () => {
    const today = new Date();
    const scheduleDate = new Date(schedule.date);
    today.setHours(0, 0, 0, 0);
    scheduleDate.setHours(0, 0, 0, 0);
    return scheduleDate > today;
  };

  return (
    <Card className={`hover:shadow-lg transition-all duration-300 border-l-4 cursor-pointer ${
      isToday() 
        ? 'border-l-yellow-500 bg-yellow-50 shadow-md' 
        : isUpcoming() && schedule.isActive
          ? 'border-l-blue-500 hover:border-l-blue-600' 
          : isPast()
          ? 'border-l-gray-400 bg-gray-50' 
          : 'border-l-red-400'
    } ${isPast() ? 'opacity-80' : ''}`} onClick={() => onClickDoctorSchedule(schedule.id)} >
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className={`p-2 rounded-full ${
              isToday() ? 'bg-yellow-200' : 
              isUpcoming() ? 'bg-blue-100' : 'bg-gray-100'
            }`}>
              <Calendar className={`h-4 w-4 ${
                isToday() ? 'text-yellow-700' : 
                isUpcoming() ? 'text-blue-600' : 'text-gray-600'
              }`} />
            </div>
            <div>
              <span className="font-semibold text-gray-800 block">
                My Schedule
              </span>
              <span className="text-sm font-normal text-gray-500">
                {formatDate(schedule.date)}
              </span>
            </div>
          </CardTitle>
          <div className="flex flex-col items-end gap-1">
            {isToday() && (
              <span className="bg-yellow-200 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">
                Today
              </span>
            )}
            {isUpcoming() && !isToday() && (
              <span className="bg-blue-200 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                Upcoming
              </span>
            )}
            {isPast() && (
              <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full font-medium">
                Past
              </span>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Time Information */}
        <div className={`p-4 rounded-lg border ${
          isToday() ? 'bg-yellow-50 border-yellow-200' : 
          schedule.isActive ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Clock className={`h-4 w-4 ${
                isToday() ? 'text-yellow-600' : 'text-blue-600'
              }`} />
              <span className="font-medium text-gray-800">Schedule Time</span>
            </div>
            <span className="text-sm text-gray-600">{calculateTotalHours()} hours</span>
          </div>
          
          <div className="text-lg font-semibold text-gray-800 mb-1">
            {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
          </div>
        </div>

        {/* Appointment Details */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg border border-purple-200">
            <Timer className="h-4 w-4 text-purple-600" />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-purple-800">Slot Duration</span>
              <span className="text-lg font-semibold text-purple-700">
                {schedule.slotDurationMinutes} min
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
            <Users className="h-4 w-4 text-green-600" />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-green-800">Max Patients</span>
              <span className="text-lg font-semibold text-green-700">
                {getTotalSlots()}
              </span>
            </div>
          </div>
        </div>
        
        {/* Status Section */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Schedule Status</span>
            </div>
            <div className="flex items-center gap-2">
              {schedule.isActive ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full border border-green-200">
                    Active
                  </span>
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 text-red-600" />
                  <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full border border-red-200">
                    Inactive
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DoctorOwnScheduleCard;
