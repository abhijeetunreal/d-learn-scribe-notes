
import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Edit, Trash } from 'lucide-react';
import { Shortcut } from '@/types';
import ShortcutForm from './ShortcutForm';

interface ShortcutCardProps {
  shortcut: Shortcut;
}

const ShortcutCard = ({ shortcut }: ShortcutCardProps) => {
  const { dispatch } = useAppContext();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  
  const handleDelete = () => {
    dispatch({ type: 'DELETE_SHORTCUT', payload: shortcut.id });
  };

  return (
    <Card className="card-hover h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">{shortcut.action}</h3>
          {shortcut.category && (
            <Badge variant="outline">{shortcut.category}</Badge>
          )}
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          {shortcut.keys.map((key, index) => (
            <kbd key={index} className="kbd">
              {key}
            </kbd>
          ))}
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground">
          {shortcut.description}
        </p>
      </CardContent>
      <CardFooter className="flex justify-end space-x-1 pt-0">
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Edit className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Edit Shortcut</DialogTitle>
            </DialogHeader>
            <ShortcutForm 
              shortcutId={shortcut.id} 
              onSuccess={() => setEditDialogOpen(false)} 
            />
          </DialogContent>
        </Dialog>
        
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
                This will permanently delete the shortcut "{shortcut.action}".
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
};

export default ShortcutCard;
