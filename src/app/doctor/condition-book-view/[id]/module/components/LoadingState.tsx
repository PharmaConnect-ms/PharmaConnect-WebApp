import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { CircularProgress } from '@mui/material';
import { LocalHospital } from '@mui/icons-material';

interface LoadingStateProps {
  message?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = "Loading condition book..." 
}) => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Skeleton */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                <div>
                  <div className="w-64 h-8 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="w-48 h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="flex space-x-3">
                <div className="w-20 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="w-16 h-8 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="w-full h-20 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-full h-20 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-full h-20 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </CardContent>
        </Card>

        {/* Loading Center */}
        <Card>
          <CardContent className="py-16">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="relative">
                <LocalHospital className="w-16 h-16 text-blue-600" />
                <div className="absolute -inset-4">
                  <CircularProgress size={64} className="text-blue-600" />
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {message}
                </h3>
                <p className="text-gray-600">
                  Please wait while we fetch the condition book details...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoadingState;
