'use client';
import { useGetConditionBookByIdQuery } from "@/redux/api/condition-books";
import {  useCreateBookEntryMutation, useGetBookEntriesByBookIdQuery, } from "@/redux/api/book-entry";
import { useGetFollowUpsByBookIdQuery, useCreateFollowUpMutation } from "@/redux/api/follow-up";

interface ConditionBookViewUIProps {
    bookId?: string;
}


export const useConditionBookViewUI = ({ bookId }: ConditionBookViewUIProps) => {

    const { data: conditionBook, error: conditionBookError, isLoading: conditionBookLoading } = useGetConditionBookByIdQuery(bookId ?? "");
    const { data: bookEntries, error: bookEntriesError, isLoading: bookEntriesLoading } = useGetBookEntriesByBookIdQuery(bookId ?? "");
    const { data: followUps, error: followUpsError, isLoading: followUpsLoading } = useGetFollowUpsByBookIdQuery(bookId ?? "");
    const [createEntry , { isLoading: isCreatingEntry }] = useCreateBookEntryMutation();
    const [createFollowUp, { isLoading: isCreatingFollowUp }] = useCreateFollowUpMutation();

    return {
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
    };
};
