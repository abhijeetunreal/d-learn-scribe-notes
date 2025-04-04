
import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ShortcutFormProps {
  shortcutId?: string;
  onSuccess?: () => void;
}

const CATEGORIES = ['Selection', 'Transform', 'Modeling', 'Editing', 'Navigation', 'Rendering', 'Animation', 'Other'];

const ShortcutForm = ({ shortcutId, onSuccess }: ShortcutFormProps) => {
  const { state, dispatch } = useAppContext();
  const { activeSoftware, shortcuts, activeFolder } = state;
  
  const existingShortcut = shortcutId 
    ? shortcuts.find(shortcut => shortcut.id === shortcutId) 
    : undefined;

  const [action, setAction] = useState(existingShortcut?.action || '');
  const [keys, setKeys] = useState(existingShortcut?.keys.join(' + ') || '');
  const [description, setDescription] = useState(existingShortcut?.description || '');
  const [category, setCategory] = useState(existingShortcut?.category || 'Other');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const keyArray = keys
      .split('+')
      .map(key => key.trim())
      .filter(key => key.length > 0);
    
    if (existingShortcut) {
      dispatch({
        type: 'UPDATE_SHORTCUT',
        payload: {
          ...existingShortcut,
          action,
          keys: keyArray,
          description,
          category,
        },
      });
    } else {
      dispatch({
        type: 'ADD_SHORTCUT',
        payload: {
          action,
          keys: keyArray,
          description,
          softwareId: activeSoftware.id,
          folderId: activeFolder?.id,
          category,
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
        <Label htmlFor="action">Action</Label>
        <Input
          id="action"
          value={action}
          onChange={(e) => setAction(e.target.value)}
          placeholder="e.g., Select All"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="keys">Keys (separate with +)</Label>
        <Input
          id="keys"
          value={keys}
          onChange={(e) => setKeys(e.target.value)}
          placeholder="e.g., Ctrl + A"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe what this shortcut does..."
          rows={3}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select 
          value={category} 
          onValueChange={(value) => setCategory(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
        <Button type="submit">
          {existingShortcut ? 'Update' : 'Create'} Shortcut
        </Button>
      </div>
    </form>
  );
};

export default ShortcutForm;
