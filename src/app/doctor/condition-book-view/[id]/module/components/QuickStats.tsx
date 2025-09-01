import React from 'react';
import { BookEntryInterface } from '@/types/book-entry-type';
import { FollowUpInterface } from '@/types/follow-ups-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Notes, 
  Schedule, 
  TrendingUp, 
  Warning,
  CheckCircle
} from '@mui/icons-material';

interface QuickStatsProps {
  bookEntries: BookEntryInterface[];
  followUps: FollowUpInterface[];
}

const QuickStats: React.FC<QuickStatsProps> = ({ bookEntries, followUps }) => {
  const totalEntries = bookEntries.length;
  const totalFollowUps = followUps.length;
  const upcomingFollowUps = followUps.filter(f => f.status === 'upcoming').length;
  const overdueFollowUps = followUps.filter(f => 
    f.status === 'upcoming' && new Date(f.dueAt) < new Date()
  ).length;
  const completedFollowUps = followUps.filter(f => f.status === 'completed').length;

  const stats = [
    {
      label: 'Total Entries',
      value: totalEntries,
      icon: <Notes className="w-5 h-5 text-blue-600" />,
      color: 'bg-blue-100 text-blue-800',
    },
    {
      label: 'Follow-ups',
      value: totalFollowUps,
      icon: <Schedule className="w-5 h-5 text-green-600" />,
      color: 'bg-green-100 text-green-800',
    },
    {
      label: 'Upcoming',
      value: upcomingFollowUps,
      icon: <TrendingUp className="w-5 h-5 text-orange-600" />,
      color: 'bg-orange-100 text-orange-800',
    },
    {
      label: 'Overdue',
      value: overdueFollowUps,
      icon: <Warning className="w-5 h-5 text-red-600" />,
      color: 'bg-red-100 text-red-800',
    },
    {
      label: 'Completed',
      value: completedFollowUps,
      icon: <CheckCircle className="w-5 h-5 text-green-600" />,
      color: 'bg-green-100 text-green-800',
    },
  ];

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Quick Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-2">
                {stat.icon}
              </div>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${stat.color}`}>
                {stat.value}
              </div>
              <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickStats;
