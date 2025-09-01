import { BookEntryInterface } from '@/types/book-entry-type';
import { FollowUpInterface } from '@/types/follow-ups-types';
import { BookEntryResponse, FollowUpResponse } from '@/types';

/**
 * Convert BookEntryResponse to BookEntryInterface
 */
export const adaptBookEntryResponse = (response: BookEntryResponse): BookEntryInterface => {
  return {
    id: response.id,
    bookId: response.bookId,
    entryDate: response.entryDate instanceof Date 
      ? response.entryDate.toISOString().split('T')[0] 
      : typeof response.entryDate === 'string' 
        ? response.entryDate
        : new Date(response.entryDate).toISOString().split('T')[0],
    type: response.type,
    summary: response.summary,
    details: response.details,
    attachedFileUrl: response.attachedFileUrl,
    tags: response.tags,
    appointmentId: response.appointmentId,
    prescriptionId: response.prescriptionId,
    uploadedBy: response.uploadedBy as 'doctor' | 'patient' | 'admin',
    createdAt: response.createdAt instanceof Date 
      ? response.createdAt.toISOString() 
      : typeof response.createdAt === 'string'
        ? response.createdAt
        : new Date(response.createdAt).toISOString(),
    updatedAt: response.updatedAt instanceof Date 
      ? response.updatedAt.toISOString() 
      : typeof response.updatedAt === 'string'
        ? response.updatedAt
        : new Date(response.updatedAt).toISOString(),
  };
};

/**
 * Convert array of BookEntryResponse to BookEntryInterface
 */
export const adaptBookEntriesResponse = (responses: BookEntryResponse[]): BookEntryInterface[] => {
  return responses.map(adaptBookEntryResponse);
};

/**
 * Convert FollowUpResponse to FollowUpInterface
 */
export const adaptFollowUpResponse = (response: FollowUpResponse): FollowUpInterface => {
  return {
    id: response.id,
    bookId: response.bookId,
    dueAt: response.dueAt,
    kind: response.kind,
    notes: response.notes || undefined,
    status: response.status,
    remindAt1: response.remindAt1 || undefined,
    remindAt2: response.remindAt2 || undefined,
    channel: response.channel,
    createdAt: response.createdAt,
    updatedAt: response.updatedAt,
  };
};

/**
 * Convert array of FollowUpResponse to FollowUpInterface
 */
export const adaptFollowUpsResponse = (responses: FollowUpResponse[]): FollowUpInterface[] => {
  return responses.map(adaptFollowUpResponse);
};
