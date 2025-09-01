import React, { useState } from 'react';
import { BookEntryInterface } from '@/types/book-entry-type';
import { FollowUpInterface } from '@/types/follow-ups-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BookEntryCard from '@/components/BookEntryCard';
import FollowUpCard from '@/components/FollowUpCard';
import { CreateBookEntryModal, CreateFollowUpModal } from '@/components/forms';
import { CreateBookEntry, CreateFollowUpRequest } from '@/types';
import { Add, Notes, Schedule, Timeline } from '@mui/icons-material';
import { format, compareDesc } from 'date-fns';

interface TimelineViewProps {
  bookEntries: BookEntryInterface[];
  followUps: FollowUpInterface[];
  onCreateEntry: (data: CreateBookEntry) => Promise<void>;
  onCreateFollowUp: (data: CreateFollowUpRequest) => Promise<void>;
  isCreatingEntry: boolean;
  isCreatingFollowUp: boolean;
  bookId: string;
}

interface TimelineItem {
  id: string;
  type: 'entry' | 'followUp';
  date: string;
  data: BookEntryInterface | FollowUpInterface;
}

const TimelineView: React.FC<TimelineViewProps> = ({
  bookEntries,
  followUps,
  onCreateEntry,
  onCreateFollowUp,
  isCreatingEntry,
  isCreatingFollowUp,
  bookId,
}) => {
  const [activeTab, setActiveTab] = useState<string>('timeline');
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);

  // Combine and sort all items by date
  const timelineItems: TimelineItem[] = React.useMemo(() => {
    const items: TimelineItem[] = [];
    
    // Add book entries
    if (bookEntries) {
      bookEntries.forEach(entry => {
        items.push({
          id: entry.id,
          type: 'entry',
          date: entry.entryDate || entry.createdAt,
          data: entry,
        });
      });
    }
    
    // Add follow-ups
    if (followUps) {
      followUps.forEach(followUp => {
        items.push({
          id: followUp.id,
          type: 'followUp',
          date: followUp.dueAt,
          data: followUp,
        });
      });
    }
    
    // Sort by date (most recent first)
    return items.sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)));
  }, [bookEntries, followUps]);

  const handleCreateEntry = async (data: CreateBookEntry) => {
    await onCreateEntry(data);
    setIsEntryModalOpen(false);
  };

  const handleCreateFollowUp = async (data: CreateFollowUpRequest) => {
    await onCreateFollowUp(data);
    setIsFollowUpModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <Button
          onClick={() => setIsEntryModalOpen(true)}
          className="flex items-center space-x-2"
          disabled={isCreatingEntry}
        >
          <Add className="w-4 h-4" />
          <span>{isCreatingEntry ? 'Creating...' : 'Add Entry'}</span>
        </Button>
        
        <Button
          onClick={() => setIsFollowUpModalOpen(true)}
          variant="outline"
          className="flex items-center space-x-2"
          disabled={isCreatingFollowUp}
        >
          <Schedule className="w-4 h-4" />
          <span>{isCreatingFollowUp ? 'Scheduling...' : 'Schedule Follow-up'}</span>
        </Button>
      </div>

      {/* Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="timeline" className="flex items-center space-x-2">
            <Timeline className="w-4 h-4" />
            <span>Timeline</span>
          </TabsTrigger>
          <TabsTrigger value="entries" className="flex items-center space-x-2">
            <Notes className="w-4 h-4" />
            <span>Entries ({bookEntries?.length || 0})</span>
          </TabsTrigger>
          <TabsTrigger value="followups" className="flex items-center space-x-2">
            <Schedule className="w-4 h-4" />
            <span>Follow-ups ({followUps?.length || 0})</span>
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="flex items-center space-x-2">
            <Schedule className="w-4 h-4" />
            <span>Upcoming</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Timeline className="w-5 h-5" />
                <span>Complete Timeline</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {timelineItems.length === 0 ? (
                <div className="text-center py-12">
                  <Timeline className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Timeline Items</h3>
                  <p className="text-gray-600 mb-4">Start by adding a book entry or scheduling a follow-up.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {timelineItems.map((item, index) => (
                    <div key={item.id} className="relative">
                      {index < timelineItems.length - 1 && (
                        <div className="absolute left-6 top-16 w-px h-12 bg-gray-200"></div>
                      )}
                      
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                          {item.type === 'entry' ? (
                            <Notes className="w-5 h-5 text-blue-600" />
                          ) : (
                            <Schedule className="w-5 h-5 text-green-600" />
                          )}
                        </div>
                        
                        <div className="flex-grow min-w-0">
                          <div className="text-sm text-gray-500 mb-1">
                            {format(new Date(item.date), 'MMM dd, yyyy')}
                          </div>
                          
                          {item.type === 'entry' ? (
                            <BookEntryCard entry={item.data as BookEntryInterface} />
                          ) : (
                            <FollowUpCard followUp={item.data as FollowUpInterface} />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="entries" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Notes className="w-5 h-5" />
                  <span>Book Entries</span>
                </div>
                <Button
                  onClick={() => setIsEntryModalOpen(true)}
                  size="sm"
                  disabled={isCreatingEntry}
                >
                  <Add className="w-4 h-4 mr-1" />
                  Add Entry
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!bookEntries || bookEntries.length === 0 ? (
                <div className="text-center py-12">
                  <Notes className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Entries Yet</h3>
                  <p className="text-gray-600 mb-4">Add your first book entry to start documenting this condition.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookEntries
                    .sort((a, b) => compareDesc(
                      new Date(a.entryDate || a.createdAt),
                      new Date(b.entryDate || b.createdAt)
                    ))
                    .map(entry => (
                      <BookEntryCard key={entry.id} entry={entry} />
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="followups" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Schedule className="w-5 h-5" />
                  <span>Follow-ups</span>
                </div>
                <Button
                  onClick={() => setIsFollowUpModalOpen(true)}
                  size="sm"
                  disabled={isCreatingFollowUp}
                >
                  <Add className="w-4 h-4 mr-1" />
                  Schedule Follow-up
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!followUps || followUps.length === 0 ? (
                <div className="text-center py-12">
                  <Schedule className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Follow-ups Scheduled</h3>
                  <p className="text-gray-600 mb-4">Schedule follow-ups to track patient progress.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {followUps
                    .sort((a, b) => compareDesc(new Date(a.dueAt), new Date(b.dueAt)))
                    .map(followUp => (
                      <FollowUpCard key={followUp.id} followUp={followUp} />
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upcoming" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Schedule className="w-5 h-5" />
                <span>Upcoming Follow-ups</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                const upcomingFollowUps = followUps?.filter(f => f.status === 'upcoming') || [];
                const overdueFollowUps = followUps?.filter(f => f.status === 'upcoming' && new Date(f.dueAt) < new Date()) || [];
                
                return upcomingFollowUps.length === 0 ? (
                  <div className="text-center py-12">
                    <Schedule className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Upcoming Follow-ups</h3>
                    <p className="text-gray-600 mb-4">All follow-ups are completed or none are scheduled.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {overdueFollowUps.length > 0 && (
                      <div>
                        <h4 className="text-lg font-medium text-red-900 mb-3">⚠️ Overdue ({overdueFollowUps.length})</h4>
                        <div className="space-y-4">
                          {overdueFollowUps.map(followUp => (
                            <FollowUpCard key={followUp.id} followUp={followUp} />
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-3">Scheduled</h4>
                      <div className="space-y-4">
                        {upcomingFollowUps
                          .filter(f => new Date(f.dueAt) >= new Date())
                          .sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime())
                          .map(followUp => (
                            <FollowUpCard key={followUp.id} followUp={followUp} />
                          ))}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <CreateBookEntryModal
        isOpen={isEntryModalOpen}
        onClose={() => setIsEntryModalOpen(false)}
        onSubmit={handleCreateEntry}
        bookId={bookId}
        isLoading={isCreatingEntry}
      />

      <CreateFollowUpModal
        isOpen={isFollowUpModalOpen}
        onClose={() => setIsFollowUpModalOpen(false)}
        onSubmit={handleCreateFollowUp}
        bookId={bookId}
        isLoading={isCreatingFollowUp}
      />
    </div>
  );
};

export default TimelineView;
