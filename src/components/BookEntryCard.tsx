import React from 'react';
import { BookEntryInterface, BookEntryType } from '@/types/book-entry-type';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { format } from 'date-fns';
import { 
  LocalHospital, 
  Notes, 
  Science, 
  Favorite, 
  MedicalServices, 
  CameraAlt,
  AttachFile 
} from '@mui/icons-material';

interface BookEntryCardProps {
  entry: BookEntryInterface;
  onEdit?: (entry: BookEntryInterface) => void;
  onDelete?: (entryId: string) => void;
}

const getEntryIcon = (type: BookEntryType) => {
  switch (type) {
    case 'visit':
      return <LocalHospital className="w-5 h-5 text-blue-600" />;
    case 'note':
      return <Notes className="w-5 h-5 text-green-600" />;
    case 'lab':
      return <Science className="w-5 h-5 text-purple-600" />;
    case 'vitals':
      return <Favorite className="w-5 h-5 text-red-600" />;
    case 'med_change':
      return <MedicalServices className="w-5 h-5 text-orange-600" />;
    case 'imaging':
      return <CameraAlt className="w-5 h-5 text-indigo-600" />;
    case 'attachment':
      return <AttachFile className="w-5 h-5 text-gray-600" />;
    default:
      return <Notes className="w-5 h-5 text-gray-600" />;
  }
};

const getEntryTypeColor = (type: BookEntryType) => {
  switch (type) {
    case 'visit':
      return 'bg-blue-100 text-blue-800';
    case 'note':
      return 'bg-green-100 text-green-800';
    case 'lab':
      return 'bg-purple-100 text-purple-800';
    case 'vitals':
      return 'bg-red-100 text-red-800';
    case 'med_change':
      return 'bg-orange-100 text-orange-800';
    case 'imaging':
      return 'bg-indigo-100 text-indigo-800';
    case 'attachment':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const BookEntryCard: React.FC<BookEntryCardProps> = ({ entry }) => {
  return (
    <Card className="mb-4 hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getEntryIcon(entry.type)}
            <div>
              <h4 className="font-medium text-gray-900">{entry.summary}</h4>
              <p className="text-sm text-gray-500">
                {format(new Date(entry.entryDate), 'MMM dd, yyyy')} • By {entry.uploadedBy}
              </p>
            </div>
          </div>
          <span 
            className={`px-2 py-1 text-xs rounded-full ${getEntryTypeColor(entry.type)}`}
          >
            {entry.type.replace('_', ' ').toUpperCase()}
          </span>
        </div>
      </CardHeader>
      
      {entry.details && (
        <CardContent className="pt-0">
          <p className="text-gray-700 text-sm leading-relaxed">{entry.details}</p>
          
          {entry.tags && (
            <div className="mt-3 flex flex-wrap gap-2">
              {entry.tags.split(',').map((tag, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                >
                  {tag.trim()}
                </span>
              ))}
            </div>
          )}
          
          {entry.attachedFileUrl && (
            <div className="mt-3">
              <a 
                href={entry.attachedFileUrl}
                className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 text-sm"
                target="_blank"
                rel="noopener noreferrer"
              >
                <AttachFile className="w-4 h-4" />
                <span>View Attachment</span>
              </a>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};

export default BookEntryCard;
