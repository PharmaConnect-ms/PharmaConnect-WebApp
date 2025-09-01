import React from 'react';
import { FollowUpInterface, FollowUpKind, FollowUpStatus } from '@/types/follow-ups-types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { format } from 'date-fns';
import { 
  Schedule, 
  Science, 
  LocalPharmacy, 
  MedicalServices,
  CheckCircle,
  Schedule as ScheduleIcon,
  Cancel,
  Warning
} from '@mui/icons-material';

interface FollowUpCardProps {
  followUp: FollowUpInterface;
  onStatusChange?: (followUpId: string, status: FollowUpStatus) => void;
  onReschedule?: (followUp: FollowUpInterface) => void;
}

const getFollowUpIcon = (kind: FollowUpKind) => {
  switch (kind) {
    case 'review':
      return <Schedule className="w-5 h-5 text-blue-600" />;
    case 'lab_review':
      return <Science className="w-5 h-5 text-purple-600" />;
    case 'repeat_rx':
      return <LocalPharmacy className="w-5 h-5 text-green-600" />;
    case 'procedure':
      return <MedicalServices className="w-5 h-5 text-orange-600" />;
    default:
      return <Schedule className="w-5 h-5 text-gray-600" />;
  }
};

const getStatusIcon = (status: FollowUpStatus) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    case 'upcoming':
      return <ScheduleIcon className="w-4 h-4 text-blue-600" />;
    case 'missed':
      return <Warning className="w-4 h-4 text-red-600" />;
    case 'cancelled':
      return <Cancel className="w-4 h-4 text-gray-600" />;
    default:
      return <ScheduleIcon className="w-4 h-4 text-gray-600" />;
  }
};

const getStatusColor = (status: FollowUpStatus) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'upcoming':
      return 'bg-blue-100 text-blue-800';
    case 'missed':
      return 'bg-red-100 text-red-800';
    case 'cancelled':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getKindColor = (kind: FollowUpKind) => {
  switch (kind) {
    case 'review':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'lab_review':
      return 'bg-purple-50 text-purple-700 border-purple-200';
    case 'repeat_rx':
      return 'bg-green-50 text-green-700 border-green-200';
    case 'procedure':
      return 'bg-orange-50 text-orange-700 border-orange-200';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200';
  }
};

const FollowUpCard: React.FC<FollowUpCardProps> = ({ followUp }) => {
  const isOverdue = followUp.status === 'upcoming' && new Date(followUp.dueAt) < new Date();
  
  return (
    <Card className={`mb-4 hover:shadow-md transition-shadow duration-200 ${isOverdue ? 'border-red-200 bg-red-50' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getFollowUpIcon(followUp.kind)}
            <div>
              <h4 className="font-medium text-gray-900 capitalize">
                {followUp.kind.replace('_', ' ')} Follow-up
              </h4>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span>Due: {format(new Date(followUp.dueAt), 'MMM dd, yyyy')}</span>
                {isOverdue && (
                  <span className="text-red-600 font-medium">• Overdue</span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span 
              className={`px-2 py-1 text-xs rounded-full border ${getKindColor(followUp.kind)}`}
            >
              {followUp.kind.replace('_', ' ').toUpperCase()}
            </span>
            
            <div className="flex items-center space-x-1">
              {getStatusIcon(followUp.status)}
              <span 
                className={`px-2 py-1 text-xs rounded-full ${getStatusColor(followUp.status)}`}
              >
                {followUp.status.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      {followUp.notes && (
        <CardContent className="pt-0">
          <p className="text-gray-700 text-sm leading-relaxed mb-3">
            {followUp.notes}
          </p>
          
          {(followUp.remindAt1 || followUp.remindAt2) && (
            <div className="text-xs text-gray-500">
              <p>Reminders:</p>
              {followUp.remindAt1 && (
                <p>• {format(new Date(followUp.remindAt1), 'MMM dd, yyyy hh:mm a')}</p>
              )}
              {followUp.remindAt2 && (
                <p>• {format(new Date(followUp.remindAt2), 'MMM dd, yyyy hh:mm a')}</p>
              )}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};

export default FollowUpCard;
