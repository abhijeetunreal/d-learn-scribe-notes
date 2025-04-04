
import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface NoteFormProps {
  noteId?: string;
  onSuccess?: () => void;
}

const NoteForm = ({ noteId, onSuccess }: NoteFormProps) => {
  const { state, dispatch } = useAppContext();
  const { activeSoftware, notes, activeFolder } = state;
  
  const existingNote = noteId 
    ? notes.find(note => note.id === noteId) 
    : undefined;

  const [title, setTitle] = useState(existingNote?.title || '');
  const [content, setContent] = useState(existingNote?.content || '');
  const [tags, setTags] = useState(existingNote?.tags.join(', ') || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const tagArray = tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
    
    if (existingNote) {
      dispatch({
        type: 'UPDATE_NOTE',
        payload: {
          ...existingNote,
          title,
          content,
          tags: tagArray,
        },
      });
    } else {
      dispatch({
        type: 'ADD_NOTE',
        payload: {
          title,
          content,
          softwareId: activeSoftware.id,
          folderId: activeFolder?.id,
          tags: tagArray,
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
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your note here..."
          rows={6}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="beginner, interface, modeling"
        />
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
        <Button type="submit">
          {existingNote ? 'Update' : 'Create'} Note
        </Button>
      </div>
    </form>
  );
};

export default NoteForm;
