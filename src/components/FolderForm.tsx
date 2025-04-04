
import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FolderFormProps {
  folderId?: string;
  onSuccess?: () => void;
}

const FolderForm = ({ folderId, onSuccess }: FolderFormProps) => {
  const { state, dispatch } = useAppContext();
  const { activeSoftware, folders } = state;
  
  const existingFolder = folderId 
    ? folders.find(folder => folder.id === folderId) 
    : undefined;

  const [name, setName] = useState(existingFolder?.name || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (existingFolder) {
      dispatch({
        type: 'UPDATE_FOLDER',
        payload: {
          ...existingFolder,
          name,
        },
      });
    } else {
      dispatch({
        type: 'ADD_FOLDER',
        payload: {
          name,
          softwareId: activeSoftware.id,
        },
      });
    }
    
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Folder Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter folder name"
          required
        />
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
        <Button type="submit">
          {existingFolder ? 'Update' : 'Create'} Folder
        </Button>
      </div>
    </form>
  );
};

export default FolderForm;
