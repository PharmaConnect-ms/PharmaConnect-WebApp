import React from 'react';
import { Book } from '@mui/icons-material';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  title, 
  description, 
  icon 
}) => {
  return (
    <div className="text-center py-16">
      <div className="text-gray-400 mb-6">
        {icon || <Book sx={{ fontSize: 64 }} />}
      </div>
      <h3 className="text-2xl font-semibold text-gray-900 mb-4">{title}</h3>
      <p className="text-gray-600 max-w-md mx-auto">{description}</p>
    </div>
  );
};

export default EmptyState;
