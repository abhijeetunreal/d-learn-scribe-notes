
import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { BookOpen, Keyboard, LucideIcon, BookText, Plus } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { Software, TabView } from '@/types';

const AppSidebar = () => {
  const { state, dispatch } = useAppContext();
  const { activeSoftware, software, activeTab } = state;

  const handleTabChange = (tab: TabView) => {
    dispatch({ type: 'SET_ACTIVE_TAB', payload: tab });
  };

  const handleSoftwareChange = (software: Software) => {
    dispatch({ type: 'SET_ACTIVE_SOFTWARE', payload: software });
  };

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">🎓</span>
          <span className="font-bold text-lg">3D-Learn</span>
        </div>
        <SidebarTrigger />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Views</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={() => handleTabChange('notes')}
                  className={activeTab === 'notes' ? 'bg-sidebar-accent' : ''}
                >
                  <BookOpen size={18} />
                  <span>Notes</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={() => handleTabChange('shortcuts')}
                  className={activeTab === 'shortcuts' ? 'bg-sidebar-accent' : ''}
                >
                  <BookText size={18} />
                  <span>Shortcuts</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={() => handleTabChange('keyboard')}
                  className={activeTab === 'keyboard' ? 'bg-sidebar-accent' : ''}
                >
                  <Keyboard size={18} />
                  <span>Keyboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Software</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {software.map((sw) => (
                <SidebarMenuItem key={sw.id}>
                  <SidebarMenuButton 
                    onClick={() => handleSoftwareChange(sw)}
                    className={activeSoftware.id === sw.id ? 'bg-sidebar-accent' : ''}
                  >
                    <span className="text-lg mr-2">{sw.icon}</span>
                    <span>{sw.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
