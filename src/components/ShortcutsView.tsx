
import React, { useMemo } from 'react';
import { useAppContext } from '@/context/AppContext';
import ShortcutCard from './ShortcutCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ShortcutsView = () => {
  const { state } = useAppContext();
  const { shortcuts, activeSoftware, searchQuery, activeFolder } = state;

  // Filter shortcuts by active software, active folder (if any), and search query
  const filteredShortcuts = useMemo(() => {
    return shortcuts.filter(shortcut => 
      shortcut.softwareId === activeSoftware.id && 
      (activeFolder ? shortcut.folderId === activeFolder.id : true) && 
      (searchQuery === '' || 
        shortcut.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shortcut.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shortcut.keys.some(key => key.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (shortcut.category && shortcut.category.toLowerCase().includes(searchQuery.toLowerCase())))
    );
  }, [shortcuts, activeSoftware, searchQuery, activeFolder]);

  // Get unique categories and count shortcuts per category
  const categories = useMemo(() => {
    const cats = new Map<string, number>();
    cats.set('All', filteredShortcuts.length);
    
    filteredShortcuts.forEach(shortcut => {
      const category = shortcut.category || 'Uncategorized';
      cats.set(category, (cats.get(category) || 0) + 1);
    });
    
    return cats;
  }, [filteredShortcuts]);

  return (
    <div className="animate-fade-in">
      <Tabs defaultValue="All">
        <TabsList className="mb-4">
          {Array.from(categories.entries()).map(([category, count]) => (
            <TabsTrigger key={category} value={category}>
              {category} ({count})
            </TabsTrigger>
          ))}
        </TabsList>
        
        {Array.from(categories.keys()).map(category => (
          <TabsContent key={category} value={category} className="mt-0">
            {filteredShortcuts.length === 0 ? (
              <div className="text-center py-10">
                <h3 className="text-lg font-medium">No shortcuts found</h3>
                <p className="text-muted-foreground mt-1">
                  {searchQuery 
                    ? "Try adjusting your search query" 
                    : activeFolder
                      ? `Add shortcuts to the "${activeFolder.name}" folder by clicking the 'New Shortcut' button`
                      : "Create your first shortcut by clicking the 'New Shortcut' button"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredShortcuts
                  .filter(s => category === 'All' || s.category === category)
                  .map(shortcut => (
                    <ShortcutCard key={shortcut.id} shortcut={shortcut} />
                  ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default ShortcutsView;
