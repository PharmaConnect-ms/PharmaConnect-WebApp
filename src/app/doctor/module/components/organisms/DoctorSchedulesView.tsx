"use client";
import React, { useState, useMemo } from "react";
import { useDoctorDashboard } from "../../logic/useDoctorDashboard";
import DoctorOwnScheduleCard from "../atoms/DoctorOwnScheduleCard";
import ScheduleErrorBoundary from "../atoms/ScheduleErrorBoundary";
import Loading from "@/components/ui/loading";
import { DoctorScheduleType } from "@/types/doctor-schedule";
import { 
  Calendar, 
  Clock, 
  Users, 
  Activity, 
  Filter, 
  Search, 
  CalendarDays,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

const DoctorSchedulesView = () => {
    const { schedules, loadingSchedules, onClickDoctorSchedule } = useDoctorDashboard();
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
    const [sortBy, setSortBy] = useState<'date' | 'status'>('date');

    const filteredAndSortedSchedules = useMemo(() => {
        if (!schedules || schedules.length === 0) return [];
        
        try {
            // Create a shallow copy to avoid mutating the original array
            let filtered = [...schedules];
            
            // Filter by status
            if (filterStatus === 'active') {
                filtered = filtered.filter(schedule => schedule?.isActive === true);
            } else if (filterStatus === 'inactive') {
                filtered = filtered.filter(schedule => schedule?.isActive === false);
            }
            
            // Sort schedules with error handling
            filtered = filtered.sort((a, b) => {
                if (sortBy === 'date') {
                    // Ensure date strings are valid before parsing
                    const dateA = a?.date ? new Date(a.date) : new Date(0);
                    const dateB = b?.date ? new Date(b.date) : new Date(0);
                    
                    // Check for invalid dates
                    if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
                        return 0;
                    }
                    
                    return dateA.getTime() - dateB.getTime();
                } else {
                    // Sort by status (active first)
                    if (a?.isActive === b?.isActive) return 0;
                    return a?.isActive ? -1 : 1;
                }
            });
            
            return filtered;
        } catch (error) {
            console.error('Error in filteredAndSortedSchedules:', error);
            return [];
        }
    }, [schedules, filterStatus, sortBy]);

    const scheduleStats = useMemo(() => {
        if (!schedules || schedules.length === 0) {
            return { total: 0, active: 0, inactive: 0, upcoming: 0, past: 0, today: 0 };
        }
        
        try {
            const today = new Date();
            const todayString = today.toDateString();
            today.setHours(0, 0, 0, 0);
            
            const stats = {
                total: schedules.length,
                active: 0,
                inactive: 0,
                upcoming: 0,
                past: 0,
                today: 0
            };
            
            schedules.forEach(schedule => {
                if (!schedule) return;
                
                // Count active/inactive
                if (schedule.isActive === true) {
                    stats.active++;
                } else {
                    stats.inactive++;
                }
                
                // Count date-based stats
                if (schedule.date) {
                    const scheduleDate = new Date(schedule.date);
                    
                    // Check if date is valid
                    if (!isNaN(scheduleDate.getTime())) {
                        const scheduleDateString = scheduleDate.toDateString();
                        
                        if (scheduleDateString === todayString) {
                            stats.today++;
                        } else {
                            scheduleDate.setHours(0, 0, 0, 0);
                            if (scheduleDate > today) {
                                stats.upcoming++;
                            } else if (scheduleDate < today) {
                                stats.past++;
                            }
                        }
                    }
                }
            });
            
            return stats;
        } catch (error) {
            console.error('Error calculating schedule stats:', error);
            return { total: 0, active: 0, inactive: 0, upcoming: 0, past: 0, today: 0 };
        }
    }, [schedules]);

    if (loadingSchedules) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loading />
            </div>
        );
    }

    // Debug logging
    if (schedules) {
        console.log("Doctor schedules data:", {
            count: schedules.length,
            sample: schedules[0],
            filterStatus,
            sortBy,
            filteredCount: filteredAndSortedSchedules.length
        });
    }

    if (!schedules || schedules.length === 0) {
        return (
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                    <CalendarDays className="h-8 w-8 text-blue-600" />
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">My Schedules</h2>
                        <p className="text-gray-600 mt-1">View and manage your appointment schedules</p>
                    </div>
                </div>

                {/* Empty State */}
                <div className="flex items-center justify-center p-12">
                    <div className="text-center max-w-md">
                        <div className="bg-blue-50 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                            <Calendar className="h-12 w-12 text-blue-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No schedules available</h3>
                        <p className="text-gray-600 mb-6">
                            You don&apos;t have any schedules set up yet. Contact your administrator to create your first schedule.
                        </p>
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                                <div className="text-sm">
                                    <p className="text-yellow-800 font-medium">Need help?</p>
                                    <p className="text-yellow-700">
                                        Reach out to your admin to set up your appointment schedules.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <ScheduleErrorBoundary>
            <div className="p-6 space-y-6">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <CalendarDays className="h-8 w-8 text-blue-600" />
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">My Schedules</h2>
                            <p className="text-gray-600 mt-1">View and manage your appointment schedules</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
                            <span className="text-blue-700 font-medium">{schedules.length} Total Schedules</span>
                        </div>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {/* Today's Schedules */}
                    <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 rounded-lg border border-yellow-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-yellow-600 text-sm font-medium">Today</p>
                                <p className="text-2xl font-bold text-yellow-700">
                                    {scheduleStats.today}
                                </p>
                            </div>
                            <div className="bg-yellow-200 p-2 rounded-full">
                                <Clock className="h-4 w-4 text-yellow-700" />
                            </div>
                        </div>
                    </div>

                    {/* Upcoming Schedules */}
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-600 text-sm font-medium">Upcoming</p>
                                <p className="text-2xl font-bold text-blue-700">
                                    {scheduleStats.upcoming}
                                </p>
                            </div>
                            <div className="bg-blue-200 p-2 rounded-full">
                                <TrendingUp className="h-4 w-4 text-blue-700" />
                            </div>
                        </div>
                    </div>
                    
                    {/* Active Schedules */}
                    <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-600 text-sm font-medium">Active</p>
                                <p className="text-2xl font-bold text-green-700">
                                    {scheduleStats.active}
                                </p>
                            </div>
                            <div className="bg-green-200 p-2 rounded-full">
                                <Activity className="h-4 w-4 text-green-700" />
                            </div>
                        </div>
                    </div>
                    
                    {/* Inactive Schedules */}
                    <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-red-600 text-sm font-medium">Inactive</p>
                                <p className="text-2xl font-bold text-red-700">
                                    {scheduleStats.inactive}
                                </p>
                            </div>
                            <div className="bg-red-200 p-2 rounded-full">
                                <AlertCircle className="h-4 w-4 text-red-700" />
                            </div>
                        </div>
                    </div>

                    {/* Past Schedules */}
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Past</p>
                                <p className="text-2xl font-bold text-gray-700">
                                    {scheduleStats.past}
                                </p>
                            </div>
                            <div className="bg-gray-200 p-2 rounded-full">
                                <Calendar className="h-4 w-4 text-gray-700" />
                            </div>
                        </div>
                    </div>

                    {/* Total Schedules */}
                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-600 text-sm font-medium">Total</p>
                                <p className="text-2xl font-bold text-purple-700">
                                    {scheduleStats.total}
                                </p>
                            </div>
                            <div className="bg-purple-200 p-2 rounded-full">
                                <Users className="h-4 w-4 text-purple-700" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters and Controls */}
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-gray-50 p-4 rounded-lg border">
                    <div className="flex flex-wrap gap-4 items-center">
                        {/* Status Filter */}
                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4 text-gray-600" />
                            <select 
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="all">All Status</option>
                                <option value="active">Active Only</option>
                                <option value="inactive">Inactive Only</option>
                            </select>
                        </div>

                        {/* Sort Options */}
                        <div className="flex items-center gap-2">
                            <Search className="h-4 w-4 text-gray-600" />
                            <select 
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as 'date' | 'status')}
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="date">Sort by Date</option>
                                <option value="status">Sort by Status</option>
                            </select>
                        </div>
                    </div>

                    <div className="text-sm text-gray-600">
                        Showing {filteredAndSortedSchedules.length} of {schedules.length} schedules
                    </div>
                </div>

                {/* Schedules Grid */}
                {filteredAndSortedSchedules.length === 0 ? (
                    <div className="flex items-center justify-center p-12">
                        <div className="text-center">
                            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-medium text-gray-900 mb-2">No schedules match your filters</h3>
                            <p className="text-gray-500">Try adjusting your filter settings to see more results.</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredAndSortedSchedules.map((schedule: DoctorScheduleType, index: number) => {
                            // Additional safety check to prevent rendering invalid data
                            if (!schedule || !schedule.id) {
                                console.warn(`Invalid schedule at index ${index}:`, schedule);
                                return null;
                            }
                            
                            return (
                                <DoctorOwnScheduleCard 
                                    key={`schedule-${schedule.id}-${index}`} 
                                    schedule={schedule} 
                                    onClickDoctorSchedule={onClickDoctorSchedule}
                                />
                            );
                        })}
                    </div>
                )}
            </div>
        </ScheduleErrorBoundary>
    );
};

export default DoctorSchedulesView;
