'use client';

import NoteForm from '@/components/NoteForm/NoteForm';
import NoteList from '@/components/NoteList/NoteList';
import Pagination from '@/components/Pagination/Pagination';
import SearchBox from '@/components/SearchBox/SearchBox';
import { fetchNotes, noteHttpResponse } from '@/lib/api';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { BeatLoader } from 'react-spinners';
import { useDebouncedCallback } from 'use-debounce';
import css from './NotesClient.module.css';
import Modal from '@/components/Modal/Modal';

interface NotesClientProps {
  tag: string | undefined;
}

export const NotesClient = ({ tag }: NotesClientProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [noteQuery, setNoteQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, isSuccess, isError } = useQuery<noteHttpResponse>({
    queryKey: ['notes', currentPage, noteQuery, tag],
    queryFn: () => fetchNotes(currentPage, noteQuery, tag),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
  });

  useEffect(() => {
    if (isError) {
      toast.error('Ooops... Something went wrong');
    }
  }, [isError]);

  useEffect(() => {
    if (isSuccess && data.notes.length === 0) {
      toast.error('No notes found for your request.');
    }
  }, [data, isSuccess]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSearchQueryChange = useDebouncedCallback((query: string) => {
    setNoteQuery(query);
    setCurrentPage(1);
  }, 300);

  const totalPages = data?.totalPages ?? 0;

  return (
    <div className={css.app}>
      <section className={css.toolbar}>
        <SearchBox setNoteQuery={handleSearchQueryChange} />

        {data && data.totalPages > 1 && (
          <Pagination
            pageCount={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        )}

        <button onClick={openModal} className={css.button}>
          Create note +
        </button>
      </section>
      {isLoading && <BeatLoader color="#0d6efd" size={20} />}

      {isModalOpen && (
        <Modal closeModal={closeModal}>
          <NoteForm closeModal={closeModal} />
        </Modal>
      )}

      {data && data.notes.length > 0 && <NoteList data={data.notes} />}
      <Toaster />
    </div>
  );
};
