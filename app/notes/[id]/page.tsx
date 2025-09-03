import { fetchNoteById } from '@/lib/api';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import NoteDetailsClient from './NoteDetails.client';

interface NoteDetailsProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: NoteDetailsProps) {
  const { id } = await params;
  const note = await fetchNoteById(id);

  return {
    title: `Note ${note.title}`,
    description: note.content.slice(0, 30),
    openGraph: {
      title: `Note ${note.title}`,
      description: note.content.slice(0, 30),
      url: `https://07-routing-nextjs-gtgrhbyik-kars-projects-50dfc61a.vercel.app/notes/${id}`,
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: 'Note',
        },
      ],
    },
  };
}

async function NoteDetails({ params }: NoteDetailsProps) {
  const { id } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({ queryKey: ['note', id], queryFn: () => fetchNoteById(id) });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}

export default NoteDetails;
