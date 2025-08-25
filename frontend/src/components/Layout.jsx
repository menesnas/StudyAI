import { Outlet, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { chatHistoryService } from '../services/chatHistoryService';

function Layout() {
  const location = useLocation();
  const [dashboardSessionId, setDashboardSessionId] = useState(null);
  
  // Dashboard için session yönetimi
  useEffect(() => {
    if (location.pathname === '/dashboard' || location.pathname === '/home') {
      initializeDashboardChat();
    }
  }, [location.pathname]);

  const initializeDashboardChat = () => {
    const sessions = chatHistoryService.getAllSessions();
    if (sessions.length > 0) {
      const lastSession = sessions[0];
      setDashboardSessionId(lastSession.id);
    } else {
      handleNewChat();
    }
  };

  const handleNewChat = () => {
    const newSession = chatHistoryService.createNewSession();
    setDashboardSessionId(newSession.id);
  };

  const handleSessionSelect = (session) => {
    setDashboardSessionId(session.id);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Sidebar - Ekranın sol kenarına tam bitişik */}
      <div className="fixed left-0 top-0 h-full z-10">
        <Sidebar 
          currentSessionId={dashboardSessionId}
          onSessionSelect={handleSessionSelect}
          onNewChat={handleNewChat}
        />
      </div>

      {/* Main Content - Sidebar'ın yanında */}
      <div className="flex-1 ml-64 bg-gray-900 overflow-hidden">
        <div className="h-full flex justify-center">
          <div className="w-full max-w-5xl px-6 h-full">
            <Outlet context={{ 
              dashboardSessionId, 
              onSessionSelect: handleSessionSelect, 
              onNewChat: handleNewChat 
            }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Layout;