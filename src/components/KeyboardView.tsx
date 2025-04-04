
import React, { useMemo } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shortcut } from '@/types';

// Define keyboard layout
const keyboardRows = [
  ['Esc', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'],
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
  ['Tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\'],
  ['Caps', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'", 'Enter'],
  ['Shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', 'Shift'],
  ['Ctrl', 'Win', 'Alt', 'Space', 'Alt', 'Menu', 'Ctrl'],
];

// Key width mapping (relative units)
const keyWidths: Record<string, number> = {
  'Esc': 1.5,
  'Backspace': 2,
  'Tab': 1.5,
  '\\': 1.5,
  'Caps': 1.75,
  'Enter': 2.25,
  'Shift': 2.25,
  'Ctrl': 1.5,
  'Win': 1.25,
  'Alt': 1.25,
  'Space': 6,
  'Menu': 1.25,
};

const KeyboardView = () => {
  const { state } = useAppContext();
  const { shortcuts, activeSoftware, searchQuery } = state;

  // Filter shortcuts by active software and search query
  const filteredShortcuts = useMemo(() => {
    return shortcuts.filter(shortcut => 
      shortcut.softwareId === activeSoftware.id && 
      (searchQuery === '' || 
        shortcut.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shortcut.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shortcut.keys.some(key => key.toLowerCase().includes(searchQuery.toLowerCase())))
    );
  }, [shortcuts, activeSoftware, searchQuery]);

  // Create a map of keys to shortcuts
  const keyToShortcuts = useMemo(() => {
    const map: Record<string, Shortcut[]> = {};
    
    filteredShortcuts.forEach(shortcut => {
      shortcut.keys.forEach(key => {
        const upperKey = key.toUpperCase();
        if (!map[upperKey]) {
          map[upperKey] = [];
        }
        map[upperKey].push(shortcut);
      });
    });
    
    return map;
  }, [filteredShortcuts]);

  // Render a keyboard key
  const renderKey = (key: string) => {
    const shortcuts = keyToShortcuts[key.toUpperCase()] || [];
    const hasShortcuts = shortcuts.length > 0;
    const width = keyWidths[key] || 1;

    return (
      <div
        key={key}
        className={`relative border rounded p-2 flex items-center justify-center text-sm transition-colors ${
          hasShortcuts 
            ? 'bg-app-teal-100 border-app-teal-300 text-app-teal-800 hover:bg-app-teal-200 cursor-pointer'
            : 'bg-gray-50 border-gray-200 text-gray-700'
        }`}
        style={{ 
          flexBasis: `${width * 4}rem`,
          height: '3rem',
        }}
        title={hasShortcuts ? shortcuts.map(s => s.action).join(', ') : ''}
      >
        {key}
        {hasShortcuts && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-app-teal-500 rounded-full" />
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
        <h2 className="text-xl font-semibold">Keyboard Shortcuts Map</h2>
        <p className="text-sm text-muted-foreground">
          Hover over highlighted keys to see available shortcuts. Click to view details.
        </p>
        <div className="mt-4">
          {keyboardRows.map((row, rowIndex) => (
            <div key={rowIndex} className="flex flex-wrap gap-1 mb-1">
              {row.map(key => renderKey(key))}
            </div>
          ))}
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Active Shortcuts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredShortcuts.length === 0 ? (
              <p className="text-muted-foreground">No shortcuts found for the current filter.</p>
            ) : (
              filteredShortcuts.map(shortcut => (
                <div key={shortcut.id} className="border rounded p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{shortcut.action}</span>
                    <div className="flex gap-1">
                      {shortcut.keys.map((key, index) => (
                        <kbd key={index} className="kbd">
                          {key}
                        </kbd>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{shortcut.description}</p>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KeyboardView;
