'use client';

import React from 'react';
import { ConditionBooksResponse, BookStatus, SeverityLevel } from '@/types/condition-book-types';
import { format } from 'date-fns';
import { 
  LocalHospital, 
  Warning, 
  CheckCircle, 
  Schedule,
  Circle 
} from '@mui/icons-material';

interface BookSpineProps {
  book: ConditionBooksResponse;
  isSelected: boolean;
  onSelect: () => void;
}

const getStatusColor = (status: BookStatus) => {
  switch (status) {
    case 'active':
      return '#ef4444'; // red-500
    case 'remission':
      return '#f59e0b'; // amber-500
    case 'closed':
      return '#10b981'; // emerald-500
    default:
      return '#6b7280'; // gray-500
  }
};

const getSeverityColor = (severity: SeverityLevel) => {
  switch (severity) {
    case 'mild':
      return '#10b981'; // green-500
    case 'normal':
      return '#3b82f6'; // blue-500
    case 'severe':
      return '#ef4444'; // red-500
    default:
      return '#6b7280'; // gray-500
  }
};

const BookSpine: React.FC<BookSpineProps> = ({ book, isSelected, onSelect }) => {
  const statusColor = getStatusColor(book.status);
  const severityColor = getSeverityColor(book.severity);

  return (
    <div
      className={`
        relative h-48 w-full cursor-pointer transition-all duration-300 transform hover:scale-105
        ${isSelected ? 'shadow-lg ring-2 ring-blue-500' : 'hover:shadow-md'}
      `}
      onClick={onSelect}
      style={{
        background: `linear-gradient(135deg, ${statusColor}15 0%, ${severityColor}15 100%)`,
        borderLeft: `6px solid ${statusColor}`,
        borderRadius: '0 8px 8px 0',
      }}
    >
      {/* Book spine effect */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-white/20 to-black/20"
        style={{ backgroundColor: statusColor }}
      />
      
      {/* Main content */}
      <div className="p-4 h-full flex flex-col justify-between bg-white/90 backdrop-blur-sm rounded-r-lg">
        {/* Top section */}
        <div>
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-bold text-gray-900 text-lg leading-tight truncate pr-2">
              {book.title}
            </h3>
            <div className="flex-shrink-0">
              {book.status === 'active' && <Circle className="w-4 h-4 text-red-500" />}
              {book.status === 'remission' && <Schedule className="w-4 h-4 text-yellow-500" />}
              {book.status === 'closed' && <CheckCircle className="w-4 h-4 text-green-500" />}
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mb-2">
            Since: {format(new Date(book.onsetDate), 'MMM yyyy')}
          </p>
          
          <div className="flex flex-wrap gap-1 mb-2">
            <span 
              className="px-2 py-1 text-xs font-medium rounded-full text-white"
              style={{ backgroundColor: statusColor }}
            >
              {book.status.toUpperCase()}
            </span>
            <span 
              className="px-2 py-1 text-xs font-medium rounded-full text-white"
              style={{ backgroundColor: severityColor }}
            >
              {book.severity.toUpperCase()}
            </span>
          </div>

          {/* Allergies warning */}
          {book.allergies && book.allergies.toLowerCase() !== 'no' && (
            <div className="flex items-center space-x-1 bg-red-50 text-red-700 px-2 py-1 rounded text-xs mb-2">
              <Warning className="w-3 h-3" />
              <span className="truncate">Allergies: {book.allergies}</span>
            </div>
          )}
        </div>

        {/* Bottom section - Book spine details */}
        <div>
          <div className="border-t border-gray-200 pt-2">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Review: {book.reviewIntervalDays}d</span>
              <LocalHospital className="w-4 h-4" />
            </div>
          </div>
          
          {/* Book spine lines for aesthetic */}
          <div className="flex justify-end space-x-1 mt-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="w-1 h-6 rounded"
                style={{ 
                  background: `linear-gradient(to bottom, ${statusColor}60, ${severityColor}60)` 
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Selection indicator */}
      {isSelected && (
        <div 
          className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-16 rounded-l"
          style={{ backgroundColor: statusColor }}
        />
      )}
    </div>
  );
};

export default BookSpine;
