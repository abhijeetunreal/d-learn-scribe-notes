
import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  Plus,
  X
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import NoteForm from './NoteForm';
import ShortcutForm from './ShortcutForm';

const Header = () => {
  const { state, dispatch } = useAppContext();
  const { activeSoftware, activeTab, searchQuery } = state;
  const [open, setOpen] = React.useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: e.target.value });
  };

  const clearSearch = () => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: '' });
  };

  return (
    <header className="border-b p-4 bg-background flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold hidden md:block">
          {activeSoftware.name} {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
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
            <Plus className="mr-2 h-4 w-4" />
            <span>New {activeTab === 'notes' ? 'Note' : activeTab === 'shortcuts' ? 'Shortcut' : 'Item'}</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Add New {activeTab === 'notes' ? 'Note' : 'Shortcut'}</DialogTitle>
          </DialogHeader>
          {activeTab === 'notes' ? (
            <NoteForm onSuccess={() => setOpen(false)} />
          ) : activeTab === 'shortcuts' ? (
            <ShortcutForm onSuccess={() => setOpen(false)} />
          ) : null}
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Header;
