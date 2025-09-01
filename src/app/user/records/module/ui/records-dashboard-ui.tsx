'use client';

import React from 'react';
import { useRecordDashboard } from "../logic/useRecordDashboard";
import ConditionBooksLibrary from '../components/ConditionBooksLibrary';
import ConditionBookDetails from '../components/ConditionBookDetails';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const RecordsDashboardUI: React.FC = () => {
  const {
    conditionBooks,
    isLoadingConditionBooks,
    followUps,
    isLoadingFollowUps,
    bookEntries,
    isLoadingBookEntries,
    setSelectedBookId,
    selectedBookId
  } = useRecordDashboard();

  if (isLoadingConditionBooks) {
    return <LoadingSpinner message="Loading your medical records..." />;
  }

  if (!conditionBooks || conditionBooks.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <EmptyState 
            title="No Medical Records Found"
            description="Your medical records will appear here once your doctor creates condition books for you."
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Medical Records</h1>
          <p className="text-gray-600">
            Your comprehensive medical history and condition tracking books
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Panel - Books Library */}
          <div className="xl:col-span-1">
            <div className="sticky top-8">
              <ConditionBooksLibrary
                conditionBooks={conditionBooks}
                selectedBookId={selectedBookId}
                onSelectBook={setSelectedBookId}
              />
            </div>
          </div>

          {/* Right Panel - Book Details */}
          <div className="xl:col-span-2">
            {selectedBookId ? (
              <ConditionBookDetails
                bookId={selectedBookId}
                followUps={followUps}
                bookEntries={bookEntries}
                isLoadingFollowUps={isLoadingFollowUps}
                isLoadingBookEntries={isLoadingBookEntries}
              />
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Medical Book</h3>
                <p className="text-gray-600">Choose a condition book from the library to view its details, follow-ups, and entries.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecordsDashboardUI;