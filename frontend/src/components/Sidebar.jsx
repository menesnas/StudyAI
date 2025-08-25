import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/features/auth/authSlice';
import { chatHistoryService } from '../services/chatHistoryService';

// Icons (using simple SVG icons)
const HomeIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
  </svg>
);

const AIIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/>
  </svg>
);

const TaskIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
  </svg>
);

const MapIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M12 1.586l-4 4v12.828l4-4V1.586zM3.707 3.293A1 1 0 002 4v10a1 1 0 00.293.707L6 18.414V5.586L3.707 3.293zM17.707 5.293L14 1.586v12.828l2.293 2.293A1 1 0 0018 16V6a1 1 0 00-.293-.707z" clipRule="evenodd"/>
  </svg>
);

const BellIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/>
  </svg>
);

const UserIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
  </svg>
);

const SettingsIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/>
  </svg>
);

const LogoutIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd"/>
  </svg>
);

function Sidebar({ currentSessionId, onSessionSelect, onNewChat }) {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [chatSessions, setChatSessions] = useState([]);
  const [showChatHistory, setShowChatHistory] = useState(false);

  // Chat sessions'ları yükle
  useEffect(() => {
    if (location.pathname === '/dashboard' || location.pathname === '/home') {
      loadChatSessions();
      setShowChatHistory(true);
    } else {
      setShowChatHistory(false);
    }
  }, [location.pathname]);

  const loadChatSessions = () => {
    try {
      const sessions = chatHistoryService.getAllSessions();
      setChatSessions(sessions);
    } catch (error) {
      console.error('Chat sessions yüklenemedi:', error);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleDeleteSession = (sessionId, e) => {
    e.stopPropagation();
    if (window.confirm('Bu sohbeti silmek istediğinizden emin misiniz?')) {
      console.log('Silinen session ID:', sessionId);
      console.log('Silme öncesi sessions:', chatHistoryService.getAllSessions());
      
      // Silme işlemini yap
      chatHistoryService.deleteSession(sessionId);
      
      // Silme sonrası kontrol
      console.log('Silme sonrası sessions:', chatHistoryService.getAllSessions());
      console.log('localStorage kontrol:', localStorage.getItem('studyai_chat_history'));
      
      // State'i güncelle
      loadChatSessions();
      
      // Eğer silinen session aktif session ise, yeni bir tane oluştur
      if (sessionId === currentSessionId && onNewChat) {
        onNewChat();
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('tr-TR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else if (diffInHours < 24 * 7) {
      return date.toLocaleDateString('tr-TR', { 
        weekday: 'short' 
      });
    } else {
      return date.toLocaleDateString('tr-TR', { 
        day: '2-digit', 
        month: '2-digit' 
      });
    }
  };

  const menuItems = [
    { path: '/home', label: 'Ana Sayfa', icon: HomeIcon },
    { path: '/plans', label: 'Planlar', icon: AIIcon },
    { path: '/tasks', label: 'Görevler', icon: TaskIcon },
    { path: '/map', label: 'Çalışma Alanları', icon: MapIcon },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="h-full w-64 text-white flex flex-col border-r border-gray-700">
        {/* Logo/Brand */}
        <div className="border-b border-gray-700 bg-gray-900">
          <Link
            to="/home"
            className="block py-4 px-4 text-xl font-bold text-white hover:bg-gray-700 transition-colors duration-200"
          >
            StudyAI
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 py-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                  isActive(item.path)
                    ? 'bg-gray-700 text-white border-l-4 border-blue-500'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white hover:border-l-4 hover:border-blue-500'
                }`}
              >
                <Icon />
                <span className="ml-3">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Chat History Section */}
        {showChatHistory && (
          <div className="border-t border-gray-700 flex-1 flex flex-col min-h-0">
            <div className="p-4 border-b border-gray-700">
                <h3 className="text-sm font-semibold text-gray-300">Sohbet Geçmişi</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2">
              {chatSessions.length === 0 ? (
                <div className="text-center py-4 text-gray-400 text-sm">
                  <p>Henüz sohbet geçmişi yok</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {chatSessions.map((session) => (
                    <div
                      key={session.id}
                      onClick={() => onSessionSelect && onSessionSelect(session)}
                      className={`
                        group cursor-pointer p-2 rounded transition-colors duration-200 text-sm
                        ${session.id === currentSessionId 
                          ? 'bg-blue-600 text-white' 
                          : 'hover:bg-gray-700 text-gray-300 hover:text-white'
                        }
                      `}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate text-xs">
                            {session.title}
                          </h4>
                          <p className="text-xs opacity-70 mt-1">
                            {session.messages.length} mesaj • {formatDate(session.updatedAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Bottom Section */}
        <div className="border-t border-gray-700 py-3 space-y-1">
          {/* Notifications */}
          <Link
            to="/notifications"
            className={`flex items-center px-4 py-2 text-sm font-medium transition-colors duration-200 ${
              isActive('/notifications')
                ? 'bg-gray-700 text-white border-l-4 border-blue-500'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white hover:border-l-4 hover:border-blue-500'
            }`}
          >
            <BellIcon />
            <span className="ml-3">Bildirimler</span>
          </Link>

          {/* Profile Section */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
            >
              <UserIcon />
              <span className="ml-3">{user?.username || 'Kullanıcı'}</span>
            </button>
            
            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-gray-800 rounded-md shadow-lg border border-gray-600">
                <Link
                  to="/profile"
                  className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
                  onClick={() => setShowProfileMenu(false)}
                >
                  <UserIcon />
                  <span className="ml-3">Profil</span>
                </Link>
                <Link
                  to="/settings"
                  className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
                  onClick={() => setShowProfileMenu(false)}
                >
                  <SettingsIcon />
                  <span className="ml-3">Ayarlar</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
                >
                  <LogoutIcon />
                  <span className="ml-3">Çıkış Yap</span>
                </button>
              </div>
            )}
          </div>
        </div>
    </div>
  );
}

export default Sidebar;
