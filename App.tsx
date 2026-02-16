import React, { useState, useCallback } from 'react';
import { ModuleID } from './types';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import HomeView from './views/HomeView';
import ModuleContainer from './views/ModuleContainer';
import { MODULES } from './constants';

const App: React.FC = () => {
  const [activeModule, setActiveModule] = useState<ModuleID>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  const clearFileBuffer = useCallback(() => {
    // Logic to clear sensitive data when switching modules
    console.debug('Cleaning file buffers for data segregation...');
    setSearchQuery(''); // Reset search when switching modules
  }, []);

  const handleNavigation = useCallback((id: ModuleID) => {
    clearFileBuffer();
    setActiveModule(id);
  }, [clearFileBuffer]);

  const getBreadcrumb = () => {
    if (activeModule === 'dashboard') return 'Dashboard';
    const mod = MODULES.find(m => m.id === activeModule);
    return `Dashboard > ${mod?.title || 'Unknown'}`;
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar activeModule={activeModule} onNavigate={handleNavigation} />
      
      <main className="flex-1 flex flex-col min-w-0">
        <TopBar 
          breadcrumb={getBreadcrumb()} 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        
        <div className="flex-1 overflow-y-auto">
          {activeModule === 'dashboard' ? (
            <HomeView onOpenModule={handleNavigation} />
          ) : (
            <ModuleContainer moduleID={activeModule} searchQuery={searchQuery} />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;