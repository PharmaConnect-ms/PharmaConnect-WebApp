'use client';

import React from 'react';
import { ConditionBooksResponse } from '@/types/condition-book-types';
import { LocalHospital } from '@mui/icons-material';
import BookSpine from './BookSpine';

interface ConditionBooksLibraryProps {
  conditionBooks: ConditionBooksResponse[];
  selectedBookId: string | null;
  onSelectBook: (bookId: string) => void;
}

const ConditionBooksLibrary: React.FC<ConditionBooksLibraryProps> = ({
  conditionBooks,
  selectedBookId,
  onSelectBook,
}) => {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <LocalHospital className="w-6 h-6 text-blue-600" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Medical Library</h2>
            <p className="text-sm text-gray-600">{conditionBooks.length} condition books</p>
          </div>
        </div>

        {/* Books arranged like a bookshelf */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Your Medical Records</h3>
          <div className="grid grid-cols-1 gap-3">
            {conditionBooks.map((book) => (
              <BookSpine
                key={book.id}
                book={book}
                isSelected={selectedBookId === book.id}
                onSelect={() => onSelectBook(book.id)}
              />
            ))}
          </div>
        </div>

        {/* Library footer */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="text-xs text-gray-500 text-center">
            📚 Click on any book to view its details, entries, and follow-ups
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConditionBooksLibrary;
