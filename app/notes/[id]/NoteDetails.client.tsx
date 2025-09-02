'use client';

import { useParams, useRouter } from 'next/navigation';
import css from './NoteDetails.module.css';
import { useQuery } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api';
// import Link from 'next/link';

function NoteDetailsClient() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const {
    data: note,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  if (isLoading) return <p>Loading, please wait...</p>;

  if (error || !note) return <p>Something went wrong.</p>;

  return (
    <div className={css.container}>
      <div className={css.item}>
        <div className={css.header}>
          <h2> {note.title}</h2>
        </div>
        <p className={css.content}>{note.content}</p>
        <div className={css.wrapper}>
          {/* <Link className={css.back} href="/notes">
            Back
          </Link> */}
          <button className={css.back} onClick={router.back}>
            Back
          </button>
          <p className={css.date}>{note.createdAt}</p>
        </div>
      </div>
    </div>
  );
}

export default NoteDetailsClient;
