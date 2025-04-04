
export interface Software {
  id: string;
  name: string;
  icon: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  softwareId: string;
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
  category?: string;
}

export interface Category {
  id: string;
  name: string;
  softwareId: string;
}

export type TabView = 'notes' | 'shortcuts' | 'keyboard';
