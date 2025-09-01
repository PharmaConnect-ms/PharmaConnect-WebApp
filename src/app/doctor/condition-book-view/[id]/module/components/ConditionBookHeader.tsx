import React from 'react';
import { ConditionBooksResponse } from '@/types/condition-book-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { 
  CalendarToday, 
  Person, 
  TrendingUp, 
  Warning, 
  CheckCircle,
  Cancel,
  LocalHospital
} from '@mui/icons-material';

interface ConditionBookHeaderProps {
  conditionBook: ConditionBooksResponse;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'active':
      return <TrendingUp className="w-5 h-5 text-orange-600" />;
    case 'remission':
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    case 'closed':
      return <Cancel className="w-5 h-5 text-gray-600" />;
    default:
      return <LocalHospital className="w-5 h-5 text-blue-600" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'remission':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'closed':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    default:
      return 'bg-blue-100 text-blue-800 border-blue-200';
  }
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'mild':
      return 'bg-green-100 text-green-800';
    case 'normal':
      return 'bg-yellow-100 text-yellow-800';
    case 'severe':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const ConditionBookHeader: React.FC<ConditionBookHeaderProps> = ({ conditionBook }) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <LocalHospital className="w-8 h-8 text-blue-600" />
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                {conditionBook.title}
              </CardTitle>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <CalendarToday className="w-4 h-4" />
                  <span>Started: {format(new Date(conditionBook.onsetDate), 'MMM dd, yyyy')}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Person className="w-4 h-4" />
                  <span>Patient ID: {conditionBook.patientId}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              {getStatusIcon(conditionBook.status)}
              <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(conditionBook.status)}`}>
                {conditionBook.status.toUpperCase()}
              </span>
            </div>
            
            <div className="flex items-center space-x-1">
              <Warning className="w-4 h-4 text-gray-600" />
              <span className={`px-2 py-1 text-sm rounded-full ${getSeverityColor(conditionBook.severity)}`}>
                {conditionBook.severity.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Instructions</h4>
            <p className="text-gray-700 text-sm leading-relaxed">{conditionBook.instructions}</p>
          </div>
          
          {conditionBook.allergies && conditionBook.allergies.toLowerCase() !== 'no' && (
            <div>
              <h4 className="font-medium text-red-900 mb-2">⚠️ Allergies</h4>
              <p className="text-red-700 text-sm font-medium">{conditionBook.allergies}</p>
            </div>
          )}
          
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Review Interval</h4>
            <p className="text-gray-700 text-sm">Every {conditionBook.reviewIntervalDays} days</p>
          </div>
        </div>
        
        {conditionBook.goals && Object.keys(conditionBook.goals).length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="font-medium text-gray-900 mb-3">Treatment Goals</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(conditionBook.goals).map(([key, value]) => (
                <div key={key} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{key}</p>
                    <p className="text-gray-700 text-sm">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ConditionBookHeader;
