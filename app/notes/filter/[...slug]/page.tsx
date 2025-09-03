import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import { fetchNotes } from '@/lib/api';
import { NotesClient } from './Notes.client';
import { Metadata } from 'next';

interface NotesParams {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({ params }: NotesParams): Promise<Metadata> {
  const { slug } = await params;

  return {
    title: `${slug[0]} notes`,
    description: `${slug[0]} notes page`,
    openGraph: {
      title: `${slug[0]} notes`,
      description: `${slug[0]} notes page`,
      url: `https://08-zustand-tau-eight.vercel.app/notes/filter/${slug[0]}`,
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: 'Notes application',
        },
      ],
    },
  };
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
