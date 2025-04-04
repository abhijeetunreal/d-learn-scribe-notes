
import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  Plus,
  X,
  FolderPlus,
  ArrowLeft
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import NoteForm from './NoteForm';
import ShortcutForm from './ShortcutForm';
import FolderForm from './FolderForm';

const Header = () => {
  const { state, dispatch } = useAppContext();
  const { activeSoftware, activeTab, searchQuery, activeFolder } = state;
  const [open, setOpen] = React.useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: e.target.value });
  };

  const clearSearch = () => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: '' });
  };

  const handleBackToFolders = () => {
    dispatch({ type: 'SET_ACTIVE_FOLDER', payload: undefined });
    dispatch({ type: 'SET_ACTIVE_TAB', payload: 'folders' });
  };

  const getButtonLabel = () => {
    switch (activeTab) {
      case 'folders':
        return 'New Folder';
      case 'notes':
        return 'New Note';
      case 'shortcuts':
        return 'New Shortcut';
      default:
        return 'New Item';
    }
  };

  const getButtonIcon = () => {
    switch (activeTab) {
      case 'folders':
        return <FolderPlus className="mr-2 h-4 w-4" />;
      default:
        return <Plus className="mr-2 h-4 w-4" />;
    }
  };

  const getDialogTitle = () => {
    switch (activeTab) {
      case 'folders':
        return 'Add New Folder';
      case 'notes':
        return 'Add New Note';
      case 'shortcuts':
        return 'Add New Shortcut';
      default:
        return 'Add New Item';
    }
  };

  const getDialogContent = () => {
    switch (activeTab) {
      case 'folders':
        return <FolderForm onSuccess={() => setOpen(false)} />;
      case 'notes':
        return <NoteForm onSuccess={() => setOpen(false)} />;
      case 'shortcuts':
        return <ShortcutForm onSuccess={() => setOpen(false)} />;
      default:
        return null;
    }
  };

  return (
    <header className="border-b p-4 bg-background flex items-center justify-between">
      <div className="flex items-center gap-4">
        {activeFolder && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleBackToFolders}
            className="mr-1"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <h1 className="text-xl font-bold hidden md:block">
          {activeSoftware.name} {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          {activeFolder && activeTab !== 'folders' ? ` - ${activeFolder.name}` : ''}
        </h1>
        <div className="relative max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search..." 
            value={searchQuery}
            onChange={handleSearch}
            className="pl-8 pr-10 w-[200px] md:w-[300px]"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground hover:text-foreground"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>
            {getButtonIcon()}
            <span>{getButtonLabel()}</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>{getDialogTitle()}</DialogTitle>
          </DialogHeader>
          {getDialogContent()}
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Header;
