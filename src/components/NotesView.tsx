
import React, { useMemo } from 'react';
import { useAppContext } from '@/context/AppContext';
import NoteCard from './NoteCard';

const NotesView = () => {
  const { state } = useAppContext();
  const { notes, activeSoftware, searchQuery, activeFolder } = state;

  // Filter notes by active software, active folder (if any), and search query
  const filteredNotes = useMemo(() => {
    return notes.filter(note => 
      note.softwareId === activeSoftware.id && 
      (activeFolder ? note.folderId === activeFolder.id : true) && 
      (searchQuery === '' || 
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
    );
  }, [notes, activeSoftware, searchQuery, activeFolder]);

  return (
    <div className="animate-fade-in">
      {filteredNotes.length === 0 ? (
        <div className="text-center py-10">
          <h3 className="text-lg font-medium">No notes found</h3>
          <p className="text-muted-foreground mt-1">
            {searchQuery 
              ? "Try adjusting your search query" 
              : activeFolder
                ? `Add notes to the "${activeFolder.name}" folder by clicking the 'New Note' button`
                : "Create your first note by clicking the 'New Note' button"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map(note => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      )}
    </div>
  );
};

export default NotesView;
