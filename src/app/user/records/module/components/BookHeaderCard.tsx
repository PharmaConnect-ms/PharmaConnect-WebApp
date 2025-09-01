'use client';

import React from 'react';
import { ConditionBooksResponse } from '@/types/condition-book-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format, differenceInDays } from 'date-fns';
import { 
  LocalHospital,
  Warning,
  CheckCircle,
  Schedule,
  Person,
  CalendarToday,
  MedicalServices,
  Assignment,
  Info
} from '@mui/icons-material';

interface BookHeaderCardProps {
  conditionBook: ConditionBooksResponse;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'active':
      return <LocalHospital className="w-5 h-5 text-red-600" />;
    case 'remission':
      return <Schedule className="w-5 h-5 text-yellow-600" />;
    case 'closed':
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    default:
      return <LocalHospital className="w-5 h-5 text-gray-600" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'remission':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'closed':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'mild':
      return 'bg-green-100 text-green-800';
    case 'normal':
      return 'bg-blue-100 text-blue-800';
    case 'severe':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const BookHeaderCard: React.FC<BookHeaderCardProps> = ({ conditionBook }) => {
  const daysSinceOnset = differenceInDays(new Date(), new Date(conditionBook.onsetDate));
  
  return (
    <Card className="mb-6 border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-white">
      <CardHeader>
        <CardTitle className="flex items-center space-x-3">
          {getStatusIcon(conditionBook.status)}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{conditionBook.title}</h1>
            <p className="text-sm text-gray-600 font-normal">Medical Condition Book</p>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Status and Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span 
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(conditionBook.status)}`}
              >
                {conditionBook.status.toUpperCase()}
              </span>
              <span 
                className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(conditionBook.severity)}`}
              >
                {conditionBook.severity.toUpperCase()}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-gray-600">
            <CalendarToday className="w-4 h-4" />
            <div>
              <p className="text-sm font-medium">Onset Date</p>
              <p className="text-sm">{format(new Date(conditionBook.onsetDate), 'MMM dd, yyyy')}</p>
              <p className="text-xs text-gray-500">({daysSinceOnset} days ago)</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-gray-600">
            <MedicalServices className="w-4 h-4" />
            <div>
              <p className="text-sm font-medium">Review Interval</p>
              <p className="text-sm">Every {conditionBook.reviewIntervalDays} days</p>
            </div>
          </div>
        </div>

        {/* Allergies Warning */}
        {conditionBook.allergies && conditionBook.allergies.toLowerCase() !== 'no' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Warning className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-800">Allergies Alert</h4>
                <p className="text-sm text-red-700">{conditionBook.allergies}</p>
              </div>
            </div>
          </div>
        )}

        {/* Goals Section */}
        {conditionBook.goals && Object.keys(conditionBook.goals).length > 0 && (
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Assignment className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-blue-800 mb-3">Treatment Goals</h4>
                <div className="space-y-2">
                  {Object.entries(conditionBook.goals).map(([key, value]) => (
                    <div key={key} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium text-blue-800">{key}:</p>
                        <p className="text-sm text-blue-700">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        {conditionBook.instructions && (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-gray-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Instructions</h4>
                <p className="text-sm text-gray-700 leading-relaxed">{conditionBook.instructions}</p>
              </div>
            </div>
          </div>
        )}

        {/* Patient Info */}
        <div className="border-t pt-4">
          <div className="flex items-center space-x-2 text-gray-600">
            <Person className="w-4 h-4" />
            <div className="text-sm">
              <span className="font-medium">Patient ID:</span> {conditionBook.patientId}
              <span className="ml-4 font-medium">Primary Doctor:</span> {conditionBook.primaryDoctorId}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookHeaderCard;
