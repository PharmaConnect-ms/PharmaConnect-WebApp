import React from 'react';
import ConditionBookViewUI from './module/ui/condition-book-view-ui';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ConditionBookViewPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <ConditionBookViewUI bookId={id} />
  );
}
