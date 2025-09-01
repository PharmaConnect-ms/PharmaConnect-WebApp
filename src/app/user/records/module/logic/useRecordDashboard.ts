'use client';


import { useState } from "react";
import { selectAuthUser } from "@/redux/features/authSlice";
import { useSelector } from "react-redux";
import { useGetAllConditionBooksByPatientIdQuery } from "@/redux/api/condition-books";
import { useGetFollowUpsByBookIdQuery } from "@/redux/api/follow-up";
import { useGetBookEntriesByBookIdQuery } from "@/redux/api/book-entry";



export const useRecordDashboard = () => {
  const user = useSelector(selectAuthUser);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const { data: conditionBooks , isLoading: isLoadingConditionBooks } = useGetAllConditionBooksByPatientIdQuery(user?.userID ?? "");
  const { data: followUps , isLoading: isLoadingFollowUps } = useGetFollowUpsByBookIdQuery(selectedBookId ?? "" , {skip: !selectedBookId});
  const { data: bookEntries , isLoading: isLoadingBookEntries } = useGetBookEntriesByBookIdQuery(selectedBookId ?? "" , {skip: !selectedBookId});

  return {
    conditionBooks,
    isLoadingConditionBooks,
    followUps,
    isLoadingFollowUps,
    bookEntries,
    isLoadingBookEntries,
    setSelectedBookId,
    selectedBookId
  };
};
