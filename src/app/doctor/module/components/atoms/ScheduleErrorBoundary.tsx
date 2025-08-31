"use client";
import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ScheduleErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
    errorInfo: React.ErrorInfo | null;
}

interface ScheduleErrorBoundaryProps {
    children: React.ReactNode;
}

class ScheduleErrorBoundary extends React.Component<ScheduleErrorBoundaryProps, ScheduleErrorBoundaryState> {
    constructor(props: ScheduleErrorBoundaryProps) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error: Error): ScheduleErrorBoundaryState {
        return {
            hasError: true,
            error,
            errorInfo: null
        };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('ScheduleErrorBoundary caught an error:', error, errorInfo);
        this.setState({
            error,
            errorInfo
        });
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null
        });
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-6 space-y-6">
                    <div className="flex items-center justify-center p-12">
                        <div className="text-center max-w-md">
                            <div className="bg-red-50 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                                <AlertTriangle className="h-12 w-12 text-red-500" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h3>
                            <p className="text-gray-600 mb-6">
                                There was an error displaying your schedules. Please try refreshing the page.
                            </p>
                            
                            <div className="space-y-4">
                                <button
                                    onClick={this.handleReset}
                                    className="flex items-center gap-2 mx-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <RefreshCw className="h-4 w-4" />
                                    Try Again
                                </button>
                                
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-left">
                                    <div className="text-sm">
                                        <p className="text-red-800 font-medium mb-2">Technical Details:</p>
                                        <p className="text-red-700 text-xs font-mono">
                                            {this.state.error?.message || 'Unknown error'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ScheduleErrorBoundary;
