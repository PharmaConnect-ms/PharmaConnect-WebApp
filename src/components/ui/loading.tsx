import React from 'react';

interface LoadingProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
}

const Loading: React.FC<LoadingProps> = ({ 
  message = 'Loading...', 
  size = 'medium' 
}) => {
  const sizeClasses = {
    small: 'h-4 w-4 border-2',
    medium: 'h-8 w-8 border-2',
    large: 'h-12 w-12 border-4'
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className={`animate-spin rounded-full ${sizeClasses[size]} border-blue-600 border-t-transparent`}></div>
      <p className="mt-4 text-gray-600 text-sm">{message}</p>
    </div>
  );
};

export default Loading;
