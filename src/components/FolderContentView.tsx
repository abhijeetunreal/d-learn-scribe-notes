
import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import NoteCard from './NoteCard';
import ShortcutCard from './ShortcutCard';

const FolderContentView = () => {
  const { state } = useAppContext();
  const { notes, shortcuts, activeSoftware, searchQuery, activeFolder } = state;

  // Filter notes by active software, active folder, and search query
  const filteredNotes = notes.filter(note => 
    note.softwareId === activeSoftware.id && 
    (activeFolder ? note.folderId === activeFolder.id : true) && 
    (searchQuery === '' || 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  // Filter shortcuts by active software, active folder, and search query
  const filteredShortcuts = shortcuts.filter(shortcut => 
    shortcut.softwareId === activeSoftware.id && 
    (activeFolder ? shortcut.folderId === activeFolder.id : true) && 
    (searchQuery === '' || 
      shortcut.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shortcut.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shortcut.keys.some(key => key.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (shortcut.category && shortcut.category.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  return (
    <div className="animate-fade-in">
      <Tabs defaultValue="notes">
        <TabsList className="mb-4">
          <TabsTrigger value="notes">
            Notes ({filteredNotes.length})
          </TabsTrigger>
          <TabsTrigger value="shortcuts">
            Shortcuts ({filteredShortcuts.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="notes" className="mt-0">
          {filteredNotes.length === 0 ? (
            <div className="text-center py-10">
              <h3 className="text-lg font-medium">No notes found</h3>
              <p className="text-muted-foreground mt-1">
                {searchQuery 
                  ? "Try adjusting your search query" 
                  : `Add notes to the "${activeFolder?.name}" folder by clicking the 'New Note' button`}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredNotes.map(note => (
                <NoteCard key={note.id} note={note} />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="shortcuts" className="mt-0">
          {filteredShortcuts.length === 0 ? (
            <div className="text-center py-10">
              <h3 className="text-lg font-medium">No shortcuts found</h3>
              <p className="text-muted-foreground mt-1">
                {searchQuery 
                  ? "Try adjusting your search query" 
                  : `Add shortcuts to the "${activeFolder?.name}" folder by clicking the 'New Shortcut' button`}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredShortcuts.map(shortcut => (
                <ShortcutCard key={shortcut.id} shortcut={shortcut} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FolderContentView;
