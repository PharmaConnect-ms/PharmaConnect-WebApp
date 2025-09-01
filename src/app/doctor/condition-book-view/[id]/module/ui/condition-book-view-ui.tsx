'use client'

import React from 'react';
import { useConditionBookViewUI } from "../logic/use-condition-book-view";
import ConditionBookHeader from '../components/ConditionBookHeader';
import TimelineView from '../components/TimelineView';
import QuickStats from '../components/QuickStats';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import { CreateBookEntry, CreateFollowUpRequest } from '@/types';
import { adaptBookEntriesResponse, adaptFollowUpsResponse } from '../utils/typeAdapters';

interface ConditionBookViewUIProps {
    bookId?: string;
}

const ConditionBookViewUI: React.FC<ConditionBookViewUIProps> = ({ bookId }) => {
    const {
        conditionBook,
        bookEntries,
        followUps,
        createEntry,
        createFollowUp,
        isCreatingEntry,
        isCreatingFollowUp,
        conditionBookError,
        bookEntriesError,
        followUpsError,
        conditionBookLoading,
        bookEntriesLoading,
        followUpsLoading
    } = useConditionBookViewUI({ bookId });

    // Handle loading states
    if (conditionBookLoading || bookEntriesLoading || followUpsLoading) {
        return <LoadingState message="Loading condition book details..." />;
    }

    // Handle error states
    if (conditionBookError || bookEntriesError || followUpsError) {
        const errorMessage = conditionBookError 
            ? "Failed to load condition book details"
            : bookEntriesError 
                ? "Failed to load book entries"
                : "Failed to load follow-ups";

        return (
            <ErrorState
                message={errorMessage}
                onRetry={() => window.location.reload()}
                onGoHome={() => window.history.back()}
            />
        );
    }

    // Handle missing condition book
    if (!conditionBook) {
        return (
            <ErrorState
                message="Condition book not found"
                onGoHome={() => window.history.back()}
            />
        );
    }

    const handleCreateEntry = async (data: CreateBookEntry) => {
        try {
            await createEntry(data).unwrap();
        } catch (error) {
            console.error('Failed to create book entry:', error);
            throw error;
        }
    };

    const handleCreateFollowUp = async (data: CreateFollowUpRequest) => {
        try {
            await createFollowUp(data).unwrap();
        } catch (error) {
            console.error('Failed to create follow-up:', error);
            throw error;
        }
    };

    // Prepare adapted data
    const adaptedBookEntries = bookEntries ? adaptBookEntriesResponse(bookEntries) : [];
    const adaptedFollowUps = followUps ? adaptFollowUpsResponse(followUps) : [];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto p-6">
                {/* Header */}
                <ConditionBookHeader conditionBook={conditionBook} />

                {/* Quick Stats */}
                <QuickStats 
                    bookEntries={adaptedBookEntries}
                    followUps={adaptedFollowUps}
                />

                {/* Timeline and Content */}
                <TimelineView
                    bookEntries={adaptedBookEntries}
                    followUps={adaptedFollowUps}
                    onCreateEntry={handleCreateEntry}
                    onCreateFollowUp={handleCreateFollowUp}
                    isCreatingEntry={isCreatingEntry}
                    isCreatingFollowUp={isCreatingFollowUp}
                    bookId={bookId || ''}
                />
            </div>
        </div>
    );
};

export default ConditionBookViewUI;