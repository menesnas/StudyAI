import React, { useState, useEffect } from 'react';
import { chatHistoryService } from '../services/chatHistoryService';

// JSON yanıtını formatla
const formatAIResponse = (content) => {
  try {
    // JSON olup olmadığını kontrol et
    if (content.trim().startsWith('{') && content.trim().endsWith('}')) {
      const parsed = JSON.parse(content);
      
      // Plan formatı
      if (parsed.plan) {
        const duration = parsed.plan.duration || parsed.plan.targetDuration || parsed.plan.target_duration;
        const durationText = duration ? `${duration} gün` : 'Belirtilmedi';
        
        return `📚 **${parsed.plan.title}**

📝 **Açıklama:** ${parsed.plan.description}

🎯 **Konu:** ${parsed.plan.subject}

⏱️ **Süre:** ${durationText}

📋 **Kategori:** ${parsed.plan.category || 'Genel'}

${parsed.plan.tasks && parsed.plan.tasks.length > 0 ? `
🔹 **Görevler:**
${parsed.plan.tasks.map((task, index) => 
  `${index + 1}. **Gün ${task.day}:** ${task.title}
   - ${task.description}
   - Öncelik: ${task.priority === 'high' ? '🔴 Yüksek' : task.priority === 'medium' ? '🟡 Orta' : '🟢 Düşük'}`
).join('\n\n')}` : ''}`;
      }
      
      
      // Genel nesne formatı
      if (typeof parsed === 'object') {
        return Object.entries(parsed)
          .map(([key, value]) => `**${key}:** ${typeof value === 'object' ? JSON.stringify(value, null, 2) : value}`)
          .join('\n\n');
      }
    }
    
    return content;
  } catch (error) {
    // JSON parse edilemezse orijinal içeriği döndür
    return content;
  }
};

function ChatPage() {
  const [chatSessions, setChatSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChatSessions();
  }, []);

  const loadChatSessions = () => {
    setLoading(true);
    try {
      const sessions = chatHistoryService.getAllSessions();
      setChatSessions(sessions);
      if (sessions.length > 0) {
        setSelectedSession(sessions[0]);
      }
    } catch (error) {
      console.error('Chat sessions yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSession = (sessionId, e) => {
    e.stopPropagation();
    if (window.confirm('Bu sohbeti silmek istediğinizden emin misiniz?')) {
      chatHistoryService.deleteSession(sessionId);
      loadChatSessions();
      
      // Eğer silinen session aktif session ise, başka bir tane seç
      if (selectedSession?.id === sessionId) {
        const remainingSessions = chatSessions.filter(s => s.id !== sessionId);
        setSelectedSession(remainingSessions.length > 0 ? remainingSessions[0] : null);
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const clearAllHistory = () => {
    if (window.confirm('Tüm sohbet geçmişini silmek istediğinizden emin misiniz?')) {
      chatHistoryService.clearAllHistory();
      setChatSessions([]);
      setSelectedSession(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex bg-gray-950">
      {/* Chat Sessions List */}
      <div className="w-80 border-r border-gray-700 bg-gray-900 flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Sohbet Geçmişi</h2>
            {chatSessions.length > 0 && (
              <button
                onClick={clearAllHistory}
                className="text-xs text-red-400 hover:text-red-300 transition-colors"
              >
                Tümünü Sil
              </button>
            )}
          </div>
          <p className="text-sm text-gray-400">
            {chatSessions.length} sohbet bulundu
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          {chatSessions.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <div className="mb-4">
                <svg className="w-16 h-16 mx-auto opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-lg mb-2">Henüz sohbet geçmişi yok</p>
              <p className="text-sm">Ana sayfada AI ile konuşmaya başlayın!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {chatSessions.map((session) => (
                <div
                  key={session.id}
                  onClick={() => setSelectedSession(session)}
                  className={`
                    group cursor-pointer p-3 rounded-lg transition-colors duration-200
                    ${session.id === selectedSession?.id 
                      ? 'bg-blue-600 text-white' 
                      : 'hover:bg-gray-800 text-gray-300 hover:text-white'
                    }
                  `}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate text-sm mb-1">
                        {session.title}
                      </h3>
                      <p className="text-xs opacity-70 mb-2">
                        {session.messages.length} mesaj
                      </p>
                      <p className="text-xs opacity-60">
                        {formatDate(session.updatedAt)}
                      </p>
                    </div>
                    
                    {/* Silme Butonu */}
                    <button
                      onClick={(e) => handleDeleteSession(session.id, e)}
                      className={`
                        opacity-0 group-hover:opacity-100 transition-opacity duration-200
                        ml-2 p-1 rounded hover:bg-red-600 hover:bg-opacity-20
                        ${session.id === selectedSession?.id ? 'text-white' : 'text-gray-400 hover:text-red-400'}
                      `}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat Messages Display */}
      <div className="flex-1 flex flex-col">
        {selectedSession ? (
          <>
            {/* Chat Header */}
            <div className="bg-gray-900 border-b border-gray-700 p-4">
              <h3 className="text-lg font-semibold text-white truncate">
                {selectedSession.title}
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                {selectedSession.messages.length} mesaj • {formatDate(selectedSession.updatedAt)}
              </p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-950">
              {selectedSession.messages.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <p>Bu sohbette henüz mesaj yok</p>
                </div>
              ) : (
                <div className="max-w-4xl mx-auto space-y-4">
                  {selectedSession.messages.map((message, index) => (
                    <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`
                        max-w-[80%] p-4 rounded-lg
                        ${message.role === 'user' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-800 text-gray-100'
                        }
                      `}>
                        <div className="text-xs opacity-70 mb-2 font-medium">
                          {message.role === 'user' ? 'Sen' : 'StudyAI'}
                        </div>
                        <div className="whitespace-pre-wrap text-sm leading-relaxed">
                          {message.content.split('\n').map((line, lineIndex) => {
                            // Markdown benzeri formatları işle
                            if (line.startsWith('**') && line.endsWith('**')) {
                              return (
                                <div key={lineIndex} className="font-bold mb-2">
                                  {line.replace(/\*\*/g, '')}
                                </div>
                              );
                            } else if (line.includes('**')) {
                              // Satır içi bold metinleri işle
                              const parts = line.split(/(\*\*.*?\*\*)/g);
                              return (
                                <div key={lineIndex} className="mb-1">
                                  {parts.map((part, partIndex) => 
                                    part.startsWith('**') && part.endsWith('**') ? (
                                      <span key={partIndex} className="font-semibold">
                                        {part.replace(/\*\*/g, '')}
                                      </span>
                                    ) : (
                                      <span key={partIndex}>{part}</span>
                                    )
                                  )}
                                </div>
                              );
                            } else if (line.match(/^\d+\./)) {
                              // Numaralı listeler
                              return (
                                <div key={lineIndex} className="ml-4 mb-1">
                                  {line}
                                </div>
                              );
                            } else if (line.startsWith('   - ')) {
                              // Alt listeler
                              return (
                                <div key={lineIndex} className="ml-8 mb-1 text-gray-300">
                                  {line}
                                </div>
                              );
                            } else if (line.startsWith('🔗 [')) {
                              // Link formatı
                              const linkMatch = line.match(/🔗 \[(.*?)\]\((.*?)\)/);
                              if (linkMatch) {
                                return (
                                  <div key={lineIndex} className="mb-1">
                                    🔗 <a href={linkMatch[2]} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">
                                      {linkMatch[1]}
                                    </a>
                                  </div>
                                );
                              }
                            }
                            return (
                              <div key={lineIndex} className={line.trim() === '' ? 'mb-2' : 'mb-1'}>
                                {line}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-950">
            <div className="text-center text-gray-400">
              <svg className="w-20 h-20 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <h3 className="text-xl font-semibold mb-2">Sohbet Seçin</h3>
              <p>Görüntülemek için sol taraftan bir sohbet seçin</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatPage;
