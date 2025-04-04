import React from 'react';
import AppLayout from '@/components/AppLayout';
import { useAppContext } from '@/context/AppContext';
import NotesView from '@/components/NotesView';
import ShortcutsView from '@/components/ShortcutsView';
import KeyboardView from '@/components/KeyboardView';
import FolderView from '@/components/FolderView';
import FolderContentView from '@/components/FolderContentView';

const Index = () => {
  const { state } = useAppContext();
  const { activeTab, activeFolder } = state;

  if (activeFolder && (activeTab === 'notes' || activeTab === 'shortcuts')) {
    return (
      <AppLayout>
        <FolderContentView />
      </AppLayout>
    );
  }

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
