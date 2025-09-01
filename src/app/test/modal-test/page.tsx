'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import CreateFollowUpModal from '@/components/forms/CreateFollowUpModal';
import CreateBookEntryModal from '@/components/forms/CreateBookEntryModal';
import { CreateFollowUpRequest } from '@/types/follow-ups-types';
import { CreateBookEntry } from '@/types/book-entry-type';

const ModalTestPage: React.FC = () => {
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);
  const [showBookEntryModal, setShowBookEntryModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFollowUpSubmit = async (data: CreateFollowUpRequest) => {
    setIsLoading(true);
    console.log('Follow-up data:', data);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    alert('Follow-up created successfully!');
  };

  const handleBookEntrySubmit = async (data: CreateBookEntry) => {
    setIsLoading(true);
    console.log('Book entry data:', data);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    alert('Book entry created successfully!');
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-8">Modal Test Page</h1>
      
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold mb-4">Test Modals</h2>
          <div className="flex gap-4">
            <Button 
              onClick={() => setShowFollowUpModal(true)}
              variant="default"
            >
              Test Follow-Up Modal
            </Button>
            
            <Button 
              onClick={() => setShowBookEntryModal(true)}
              variant="outline"
            >
              Test Book Entry Modal
            </Button>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-md font-medium mb-2">Instructions:</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
            <li>Click the buttons above to test each modal</li>
            <li>Test the date pickers - they should open properly without z-index issues</li>
            <li>Test the dropdown menus - they should display correctly</li>
            <li>Try submitting forms with valid and invalid data</li>
            <li>Check the console for form submission data</li>
          </ul>
        </div>
      </div>

      {/* Follow-Up Modal */}
      <CreateFollowUpModal
        isOpen={showFollowUpModal}
        onClose={() => setShowFollowUpModal(false)}
        onSubmit={handleFollowUpSubmit}
        bookId="test-book-123"
        isLoading={isLoading}
      />

      {/* Book Entry Modal */}
      <CreateBookEntryModal
        isOpen={showBookEntryModal}
        onClose={() => setShowBookEntryModal(false)}
        onSubmit={handleBookEntrySubmit}
        bookId="test-book-123"
        isLoading={isLoading}
      />
    </div>
  );
};

export default ModalTestPage;
