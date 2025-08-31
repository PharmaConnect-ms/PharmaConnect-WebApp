import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DoctorScheduleType } from '@/types/doctor-schedule';
import { Calendar, Clock, Timer, User, Mail, Phone, MapPin } from 'lucide-react';

interface DoctorScheduleCardProps {
  schedule: DoctorScheduleType;
}

const DoctorScheduleCard: React.FC<DoctorScheduleCardProps> = ({ schedule }) => {
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

  return (
    <Card className={`hover:shadow-lg transition-all duration-300 border-l-4 ${
      isToday() 
        ? 'border-l-yellow-500 bg-yellow-50' 
        : schedule.isActive 
          ? 'border-l-blue-500 hover:border-l-blue-600' 
          : 'border-l-gray-400 bg-gray-50'
    } ${isPast() ? 'opacity-75' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className={`p-2 rounded-full ${
              isToday() ? 'bg-yellow-200' : 'bg-blue-100'
            }`}>
              <User className={`h-4 w-4 ${
                isToday() ? 'text-yellow-700' : 'text-blue-600'
              }`} />
            </div>
            <div>
              <span className="font-semibold text-gray-800 block">
                Dr. {schedule.doctor.username}
              </span>
              <span className="text-sm font-normal text-gray-500 capitalize">
                {schedule.doctor.role}
              </span>
            </div>
          </CardTitle>
          {isToday() && (
            <span className="bg-yellow-200 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">
              Today
            </span>
          )}
        </div>
        
        {/* Doctor Info */}
        <div className="space-y-1 text-xs text-gray-600 mt-2">
          {schedule.doctor.email && (
            <div className="flex items-center gap-2">
              <Mail className="h-3 w-3" />
              <span>{schedule.doctor.email}</span>
            </div>
          )}
          {schedule.doctor.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-3 w-3" />
              <span>{schedule.doctor.phone}</span>
            </div>
          )}
          {schedule.doctor.address && (
            <div className="flex items-center gap-2">
              <MapPin className="h-3 w-3" />
              <span className="truncate">{schedule.doctor.address}</span>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Date */}
        <div className={`flex items-center gap-2 text-sm p-3 rounded-lg ${
          isToday() ? 'bg-yellow-100 border border-yellow-200' : 'bg-gray-50'
        }`}>
          <Calendar className={`h-4 w-4 ${
            isToday() ? 'text-yellow-600' : 'text-green-600'
          }`} />
          <span className="font-medium">{formatDate(schedule.date)}</span>
          {isPast() && (
            <span className="ml-auto text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
              Past
            </span>
          )}
        </div>
        
        {/* Time and Duration */}
        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4 text-orange-600" />
            <div className="flex flex-col">
              <span className="font-medium">
                {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
              </span>
              <span className="text-xs text-gray-500">
                {calculateTotalHours()} hours total
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Timer className="h-4 w-4 text-purple-600" />
            <div className="flex flex-col">
              <span className="font-medium">{schedule.slotDurationMinutes} min slots</span>
              <span className="text-xs text-gray-500">
                ~{Math.floor((parseFloat(calculateTotalHours()) * 60) / schedule.slotDurationMinutes)} appointments possible
              </span>
            </div>
          </div>
        </div>
        
        {/* Status and Provider */}
        <div className="pt-3 border-t border-gray-100 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Status</span>
            <span 
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                schedule.isActive 
                  ? 'bg-green-100 text-green-800 border border-green-200' 
                  : 'bg-red-100 text-red-800 border border-red-200'
              }`}
            >
              {schedule.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
          
        </div>
      </CardContent>
    </Card>
  );
};

export default DoctorScheduleCard;
