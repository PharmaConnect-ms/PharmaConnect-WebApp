'use client';

import React, { useState, useMemo } from 'react';
import { FollowUpDto } from '@/types/follow-ups-types';
import { BookEntryResponse } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BookEntryCard from '@/components/BookEntryCard';
import FollowUpCard from '@/components/FollowUpCard';
import BookHeaderCard from './BookHeaderCard';
import { 
  Timeline,
  Notes, 
  Schedule,
  TrendingUp,
  CalendarToday
} from '@mui/icons-material';
import { format } from 'date-fns';
import { adaptBookEntriesResponse, adaptFollowUpsResponse } from '@/app/doctor/condition-book-view/[id]/module/utils/typeAdapters';
import { BookEntryInterface } from '@/types/book-entry-type';
import { FollowUpInterface } from '@/types/follow-ups-types';
import { useGetConditionBookByIdQuery } from '@/redux/api/condition-books';

interface ConditionBookDetailsProps {
  bookId: string;
  followUps?: FollowUpDto[];
  bookEntries?: BookEntryResponse[];
  isLoadingFollowUps: boolean;
  isLoadingBookEntries: boolean;
}

interface TimelineItem {
  id: string;
  type: 'entry' | 'followUp';
  date: string;
  data: BookEntryInterface | FollowUpInterface;
}

const ConditionBookDetails: React.FC<ConditionBookDetailsProps> = ({
  bookId,
  followUps,
  bookEntries,
  isLoadingFollowUps,
  isLoadingBookEntries,
}) => {
  const [activeTab, setActiveTab] = useState('timeline');

  // Get condition book data
  const { data: conditionBook, isLoading: isLoadingConditionBook } = useGetConditionBookByIdQuery(bookId);

  // Adapt data to required interfaces
  const adaptedBookEntries = useMemo(() => {
    return bookEntries ? adaptBookEntriesResponse(bookEntries) : [];
  }, [bookEntries]);

  const adaptedFollowUps = useMemo(() => {
    return followUps ? adaptFollowUpsResponse(followUps) : [];
  }, [followUps]);

  // Create timeline items
  const timelineItems: TimelineItem[] = useMemo(() => {
    const items: TimelineItem[] = [];
    
    // Add book entries
    if (adaptedBookEntries) {
      adaptedBookEntries.forEach(entry => {
        items.push({
          id: entry.id,
          type: 'entry',
          date: entry.entryDate || entry.createdAt,
          data: entry,
        });
      });
    }
    
    // Add follow-ups
    if (adaptedFollowUps) {
      adaptedFollowUps.forEach(followUp => {
        items.push({
          id: followUp.id,
          type: 'followUp',
          date: followUp.dueAt,
          data: followUp,
        });
      });
    }
    
    // Sort by date (most recent first)
    return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [adaptedBookEntries, adaptedFollowUps]);

  if (isLoadingFollowUps || isLoadingBookEntries || isLoadingConditionBook) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading book details...</p>
        </div>
      </div>
    );
  }

  if (!conditionBook) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <p className="text-gray-600">Condition book not found.</p>
      </div>
    );
  }

  const upcomingFollowUps = adaptedFollowUps.filter(f => f.status === 'upcoming');

  return (
    <div className="space-y-6">
      {/* Book Header */}
      <BookHeaderCard conditionBook={conditionBook} />

      {/* Book Overview Stats */}
      <Card className="bg-white shadow-sm border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Timeline className="w-5 h-5 text-blue-600" />
            <span>Book Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <Notes className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-blue-600">{adaptedBookEntries.length}</p>
              <p className="text-sm text-gray-600">Total Entries</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <Schedule className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-green-600">{adaptedFollowUps.length}</p>
              <p className="text-sm text-gray-600">Follow-ups</p>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="w-5 h-5 text-orange-600" />
              </div>
              <p className="text-2xl font-bold text-orange-600">{upcomingFollowUps.length}</p>
              <p className="text-sm text-gray-600">Upcoming</p>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <CalendarToday className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-purple-600">
                {adaptedFollowUps.filter(f => f.status === 'completed').length}
              </p>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabbed Content */}
      <Card className="bg-white shadow-sm border border-gray-200">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <CardHeader className="pb-4">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="timeline" className="flex items-center space-x-2">
                <Timeline className="w-4 h-4" />
                <span className="hidden sm:inline">Timeline</span>
              </TabsTrigger>
              <TabsTrigger value="entries" className="flex items-center space-x-2">
                <Notes className="w-4 h-4" />
                <span className="hidden sm:inline">Entries</span>
              </TabsTrigger>
              <TabsTrigger value="followups" className="flex items-center space-x-2">
                <Schedule className="w-4 h-4" />
                <span className="hidden sm:inline">Follow-ups</span>
              </TabsTrigger>
              <TabsTrigger value="upcoming" className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4" />
                <span className="hidden sm:inline">Upcoming</span>
              </TabsTrigger>
            </TabsList>
          </CardHeader>

          <CardContent className="max-h-[600px] overflow-y-auto">
            <TabsContent value="timeline" className="space-y-4">
              {timelineItems.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Timeline className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No entries or follow-ups recorded yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {timelineItems.map((item) => (
                    <div key={item.id} className="relative">
                      {/* Timeline indicator */}
                      <div className="absolute left-0 top-4 w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-sm"></div>
                      <div className="ml-6 pl-4 border-l-2 border-gray-200 pb-4">
                        <div className="text-xs text-gray-500 mb-2">
                          {format(new Date(item.date), 'MMM dd, yyyy • h:mm a')}
                        </div>
                        {item.type === 'entry' ? (
                          <BookEntryCard entry={item.data as BookEntryInterface} />
                        ) : (
                          <FollowUpCard followUp={item.data as FollowUpInterface} />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="entries" className="space-y-4">
              {adaptedBookEntries.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Notes className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No book entries recorded yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {adaptedBookEntries.map((entry) => (
                    <BookEntryCard key={entry.id} entry={entry} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="followups" className="space-y-4">
              {adaptedFollowUps.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Schedule className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No follow-ups scheduled yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {adaptedFollowUps.map((followUp) => (
                    <FollowUpCard key={followUp.id} followUp={followUp} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="upcoming" className="space-y-4">
              {upcomingFollowUps.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <TrendingUp className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No upcoming follow-ups</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingFollowUps.map((followUp) => (
                    <FollowUpCard key={followUp.id} followUp={followUp} />
                  ))}
                </div>
              )}
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default ConditionBookDetails;
