
import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import NoteCard from './NoteCard';
import ShortcutCard from './ShortcutCard';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import NoteForm from './NoteForm';
import ShortcutForm from './ShortcutForm';

const FolderContentView = () => {
  const { state } = useAppContext();
  const { notes, shortcuts, activeSoftware, searchQuery, activeFolder } = state;
  const [activeTab, setActiveTab] = useState<string>("notes");
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [shortcutDialogOpen, setShortcutDialogOpen] = useState(false);

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
      <div className="flex justify-between items-center mb-4">
        <Tabs 
          defaultValue="notes" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex-1"
        >
          <TabsList>
            <TabsTrigger value="notes">
              Notes ({filteredNotes.length})
            </TabsTrigger>
            <TabsTrigger value="shortcuts">
              Shortcuts ({filteredShortcuts.length})
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            onClick={() => setNoteDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-1" /> Add Note
          </Button>
          <Button 
            size="sm" 
            onClick={() => setShortcutDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-1" /> Add Shortcut
          </Button>
        </div>
      </div>

      {/* Note Dialog */}
      <Dialog open={noteDialogOpen} onOpenChange={setNoteDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Add New Note</DialogTitle>
          </DialogHeader>
          <NoteForm onSuccess={() => setNoteDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Shortcut Dialog */}
      <Dialog open={shortcutDialogOpen} onOpenChange={setShortcutDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Add New Shortcut</DialogTitle>
          </DialogHeader>
          <ShortcutForm onSuccess={() => setShortcutDialogOpen(false)} />
        </DialogContent>
      </Dialog>
      
      <div className="mt-1">
        {activeTab === "notes" && (
          <>
            {filteredNotes.length === 0 ? (
              <div className="text-center py-10">
                <h3 className="text-lg font-medium">No notes found</h3>
                <p className="text-muted-foreground mt-1">
                  {searchQuery 
                    ? "Try adjusting your search query" 
                    : `Add notes to the "${activeFolder?.name}" folder by clicking the 'Add Note' button`}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredNotes.map(note => (
                  <NoteCard key={note.id} note={note} />
                ))}
              </div>
            )}
          </>
        )}
        
        {activeTab === "shortcuts" && (
          <>
            {filteredShortcuts.length === 0 ? (
              <div className="text-center py-10">
                <h3 className="text-lg font-medium">No shortcuts found</h3>
                <p className="text-muted-foreground mt-1">
                  {searchQuery 
                    ? "Try adjusting your search query" 
                    : `Add shortcuts to the "${activeFolder?.name}" folder by clicking the 'Add Shortcut' button`}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredShortcuts.map(shortcut => (
                  <ShortcutCard key={shortcut.id} shortcut={shortcut} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FolderContentView;
