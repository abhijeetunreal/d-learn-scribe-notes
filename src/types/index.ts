
export interface Software {
  id: string;
  name: string;
  icon: string;
}

export interface Folder {
  id: string;
  name: string;
  softwareId: string;
  createdAt: Date;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  softwareId: string;
  folderId?: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
}

export interface Shortcut {
  id: string;
  action: string;
  keys: string[];
  description: string;
  softwareId: string;
  folderId?: string;
  category?: string;
}

export interface Category {
  id: string;
  name: string;
  softwareId: string;
}

export type TabView = 'folders' | 'notes' | 'shortcuts' | 'keyboard';
