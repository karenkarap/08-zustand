import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import { fetchNotes } from '@/lib/api';
import { NotesClient } from './Notes.client';

interface NotesParams {
  params: Promise<{ slug: string[] }>;
}

async function Notes({ params }: NotesParams) {
  const queryClient = new QueryClient();
  const { slug } = await params;
  const tag = slug[0] === 'All' ? undefined : slug[0];

  await queryClient.prefetchQuery({
    queryKey: ['notes', tag],
    queryFn: () => fetchNotes(1, tag),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}

export default Notes;
