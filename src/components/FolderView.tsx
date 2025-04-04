
import React, { useMemo, useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Folder, FolderOpen, File, Plus, Edit, Trash } from 'lucide-react';
import { Folder as FolderType } from '@/types';
import FolderForm from './FolderForm';

const FolderView = () => {
  const { state, dispatch } = useAppContext();
  const { folders, activeSoftware, searchQuery } = state;
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<FolderType | null>(null);

  // Filter folders by active software and search query
  const filteredFolders = useMemo(() => {
    return folders.filter(folder => 
      folder.softwareId === activeSoftware.id && 
      (searchQuery === '' || 
        folder.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [folders, activeSoftware, searchQuery]);

  const handleFolderClick = (folder: FolderType) => {
    dispatch({ type: 'SET_ACTIVE_FOLDER', payload: folder });
    dispatch({ type: 'SET_ACTIVE_TAB', payload: 'notes' });
  };

  const handleEditFolder = (folder: FolderType) => {
    setSelectedFolder(folder);
    setEditDialogOpen(true);
  };

  const handleDeleteFolder = (folderId: string) => {
    dispatch({ type: 'DELETE_FOLDER', payload: folderId });
  };

  const handleAddSubItems = (folder: FolderType, itemType: 'notes' | 'shortcuts') => {
    dispatch({ type: 'SET_ACTIVE_FOLDER', payload: folder });
    dispatch({ type: 'SET_ACTIVE_TAB', payload: itemType });
  };

  return (
    <div className="animate-fade-in">
      {filteredFolders.length === 0 ? (
        <div className="text-center py-10">
          <h3 className="text-lg font-medium">No folders found</h3>
          <p className="text-muted-foreground mt-1">
            {searchQuery 
              ? "Try adjusting your search query" 
              : "Create your first folder by clicking the 'New Folder' button"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFolders.map(folder => (
            <Card key={folder.id} className="card-hover h-full flex flex-col">
              <CardHeader className="pb-2 cursor-pointer" onClick={() => handleFolderClick(folder)}>
                <CardTitle className="text-lg font-medium flex items-center">
                  <FolderOpen className="mr-2 h-5 w-5 text-amber-500" />
                  {folder.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="text-sm text-muted-foreground">
                  {new Intl.DateTimeFormat('en-US', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  }).format(new Date(folder.createdAt))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-0">
                <div className="flex space-x-1">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleAddSubItems(folder, 'notes')}
                  >
                    <File className="h-4 w-4 mr-1" />
                    Add Note
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleAddSubItems(folder, 'shortcuts')}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Shortcut
                  </Button>
                </div>
                <div className="flex space-x-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => handleEditFolder(folder)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete the folder "{folder.name}" and all its contents.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteFolder(folder.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Edit Folder</DialogTitle>
          </DialogHeader>
          {selectedFolder && (
            <FolderForm 
              folderId={selectedFolder.id}
              onSuccess={() => {
                setEditDialogOpen(false);
                setSelectedFolder(null);
              }} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FolderView;
