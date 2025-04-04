
import React from 'react';
import AppLayout from '@/components/AppLayout';
import { useAppContext } from '@/context/AppContext';
import NotesView from '@/components/NotesView';
import ShortcutsView from '@/components/ShortcutsView';
import KeyboardView from '@/components/KeyboardView';
import FolderView from '@/components/FolderView';

const Index = () => {
  const { state } = useAppContext();
  const { activeTab } = state;

  return (
    <AppLayout>
      {activeTab === 'folders' && <FolderView />}
      {activeTab === 'notes' && <NotesView />}
      {activeTab === 'shortcuts' && <ShortcutsView />}
      {activeTab === 'keyboard' && <KeyboardView />}
    </AppLayout>
  );
};

export default Index;
