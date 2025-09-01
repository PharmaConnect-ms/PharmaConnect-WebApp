import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Warning, Refresh, Home } from '@mui/icons-material';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  onGoHome?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  message = "Failed to load condition book",
  onRetry,
  onGoHome
}) => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <Card className="mt-20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-600">
              <Warning className="w-6 h-6" />
              <span>Error Loading Condition Book</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center py-8">
            <Warning className="w-20 h-20 text-red-400 mx-auto mb-6" />
            
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Oops! Something went wrong
            </h3>
            
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {message}. This might be due to a network issue or the condition book might not exist.
            </p>
            
            <div className="flex justify-center space-x-4">
              {onRetry && (
                <Button
                  onClick={onRetry}
                  className="flex items-center space-x-2"
                >
                  <Refresh className="w-4 h-4" />
                  <span>Try Again</span>
                </Button>
              )}
              
              {onGoHome && (
                <Button
                  onClick={onGoHome}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <Home className="w-4 h-4" />
                  <span>Go Home</span>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ErrorState;
