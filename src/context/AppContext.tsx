
import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Note, Shortcut, Software, TabView, Folder } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// Sample initial data
const softwareList: Software[] = [
  { id: 'blender', name: 'Blender', icon: '🧊' },
  { id: 'maya', name: 'Maya', icon: '🎭' },
  { id: 'cinema4d', name: 'Cinema 4D', icon: '🎬' },
  { id: 'zbrush', name: 'ZBrush', icon: '🗿' },
  { id: 'substance', name: 'Substance Painter', icon: '🎨' },
  { id: 'rhino', name: 'Rhino', icon: '🦏' },
];

// Sample folders
const sampleFolders: Folder[] = [
  {
    id: '1',
    name: 'Modeling Basics',
    softwareId: 'blender',
    createdAt: new Date('2023-01-10'),
  },
  {
    id: '2',
    name: 'Animation',
    softwareId: 'blender',
    createdAt: new Date('2023-02-15'),
  },
];

// Sample shortcuts for Blender
const sampleShortcuts: Shortcut[] = [
  {
    id: '1',
    action: 'Select All',
    keys: ['A'],
    description: 'Select all objects in the scene',
    softwareId: 'blender',
    category: 'Selection',
    folderId: '1',
  },
  {
    id: '2',
    action: 'Delete',
    keys: ['X'],
    description: 'Delete selected objects',
    softwareId: 'blender',
    category: 'Editing',
    folderId: '1',
  },
  {
    id: '3',
    action: 'Extrude',
    keys: ['E'],
    description: 'Extrude selected vertices, edges, or faces',
    softwareId: 'blender',
    category: 'Modeling',
  },
  {
    id: '4',
    action: 'Grab/Move',
    keys: ['G'],
    description: 'Move selected objects or components',
    softwareId: 'blender',
    category: 'Transform',
  },
  {
    id: '5',
    action: 'Rotate',
    keys: ['R'],
    description: 'Rotate selected objects or components',
    softwareId: 'blender',
    category: 'Transform',
  }
];

// Sample notes
const sampleNotes: Note[] = [
  {
    id: '1',
    title: 'Getting Started with Blender Interface',
    content: 'The Blender interface is divided into editors, which can be customized for different workflows. Right-click to select objects by default.',
    softwareId: 'blender',
    folderId: '1',
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-01-15'),
    tags: ['beginner', 'interface'],
  },
  {
    id: '2',
    title: 'Modeling Workflow Tips',
    content: 'Start with basic shapes and refine. Use the modifier stack for non-destructive editing. Mirror modifier is great for symmetrical objects.',
    softwareId: 'blender',
    folderId: '2',
    createdAt: new Date('2023-02-10'),
    updatedAt: new Date('2023-02-12'),
    tags: ['modeling', 'workflow'],
  },
];

// Types
type AppState = {
  activeTab: TabView;
  activeSoftware: Software;
  activeFolder?: Folder;
  software: Software[];
  folders: Folder[];
  notes: Note[];
  shortcuts: Shortcut[];
  searchQuery: string;
};

type Action =
  | { type: 'SET_ACTIVE_TAB'; payload: TabView }
  | { type: 'SET_ACTIVE_SOFTWARE'; payload: Software }
  | { type: 'SET_ACTIVE_FOLDER'; payload: Folder | undefined }
  | { type: 'ADD_FOLDER'; payload: Omit<Folder, 'id' | 'createdAt'> }
  | { type: 'UPDATE_FOLDER'; payload: Folder }
  | { type: 'DELETE_FOLDER'; payload: string }
  | { type: 'ADD_NOTE'; payload: Omit<Note, 'id' | 'createdAt' | 'updatedAt'> }
  | { type: 'UPDATE_NOTE'; payload: Note }
  | { type: 'DELETE_NOTE'; payload: string }
  | { type: 'ADD_SHORTCUT'; payload: Omit<Shortcut, 'id'> }
  | { type: 'UPDATE_SHORTCUT'; payload: Shortcut }
  | { type: 'DELETE_SHORTCUT'; payload: string }
  | { type: 'SET_SEARCH_QUERY'; payload: string };

// Initial state
const initialState: AppState = {
  activeTab: 'folders',
  activeSoftware: softwareList[0],
  software: softwareList,
  folders: sampleFolders,
  notes: sampleNotes,
  shortcuts: sampleShortcuts,
  searchQuery: '',
};

// Reducer function
const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'SET_ACTIVE_TAB':
      return {
        ...state,
        activeTab: action.payload,
      };
    case 'SET_ACTIVE_SOFTWARE':
      return {
        ...state,
        activeSoftware: action.payload,
        activeFolder: undefined,
      };
    case 'SET_ACTIVE_FOLDER':
      return {
        ...state,
        activeFolder: action.payload,
      };
    case 'ADD_FOLDER': {
      const newFolder: Folder = {
        id: uuidv4(),
        ...action.payload,
        createdAt: new Date(),
      };
      return {
        ...state,
        folders: [...state.folders, newFolder],
      };
    }
    case 'UPDATE_FOLDER':
      return {
        ...state,
        folders: state.folders.map((folder) =>
          folder.id === action.payload.id ? action.payload : folder
        ),
        activeFolder: state.activeFolder?.id === action.payload.id 
          ? action.payload 
          : state.activeFolder,
      };
    case 'DELETE_FOLDER': {
      // When deleting a folder, also remove its notes and shortcuts or make them folderless
      const deletedFolderId = action.payload;
      return {
        ...state,
        folders: state.folders.filter((folder) => folder.id !== deletedFolderId),
        notes: state.notes.filter((note) => note.folderId !== deletedFolderId),
        shortcuts: state.shortcuts.filter((shortcut) => shortcut.folderId !== deletedFolderId),
        activeFolder: state.activeFolder?.id === deletedFolderId ? undefined : state.activeFolder,
      };
    }
    case 'ADD_NOTE': {
      const newNote: Note = {
        id: uuidv4(),
        ...action.payload,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      return {
        ...state,
        notes: [...state.notes, newNote],
      };
    }
    case 'UPDATE_NOTE':
      return {
        ...state,
        notes: state.notes.map((note) =>
          note.id === action.payload.id ? { ...action.payload, updatedAt: new Date() } : note
        ),
      };
    case 'DELETE_NOTE':
      return {
        ...state,
        notes: state.notes.filter((note) => note.id !== action.payload),
      };
    case 'ADD_SHORTCUT': {
      const newShortcut: Shortcut = {
        id: uuidv4(),
        ...action.payload,
      };
      return {
        ...state,
        shortcuts: [...state.shortcuts, newShortcut],
      };
    }
    case 'UPDATE_SHORTCUT':
      return {
        ...state,
        shortcuts: state.shortcuts.map((shortcut) =>
          shortcut.id === action.payload.id ? action.payload : shortcut
        ),
      };
    case 'DELETE_SHORTCUT':
      return {
        ...state,
        shortcuts: state.shortcuts.filter((shortcut) => shortcut.id !== action.payload),
      };
    case 'SET_SEARCH_QUERY':
      return {
        ...state,
        searchQuery: action.payload,
      };
    default:
      return state;
  }
};

// Create context
type AppContextType = {
  state: AppState;
  dispatch: React.Dispatch<Action>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
