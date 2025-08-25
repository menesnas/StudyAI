// Chat geçmişi yönetimi için service
export class ChatHistoryService {
  constructor() {
    this.storageKey = 'studyai_chat_history';
  }

  // Tüm chat sessions'ları getir
  getAllSessions() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Chat geçmişi okunamadı:', error);
      return [];
    }
  }

  // Yeni chat session oluştur
  createNewSession() {
    const sessions = this.getAllSessions();
    const newSession = {
      id: Date.now().toString(),
      title: 'Yeni Sohbet',
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    sessions.unshift(newSession); // En başa ekle
    this.saveSessions(sessions);
    return newSession;
  }

  // Belirli bir session'ı getir
  getSession(sessionId) {
    const sessions = this.getAllSessions();
    return sessions.find(session => session.id === sessionId);
  }

  // Session'ı güncelle
  updateSession(sessionId, updates) {
    const sessions = this.getAllSessions();
    const sessionIndex = sessions.findIndex(session => session.id === sessionId);
    
    if (sessionIndex !== -1) {
      sessions[sessionIndex] = {
        ...sessions[sessionIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      
      // Eğer mesaj eklendiyse ve title hala "Yeni Sohbet" ise, ilk mesajdan title oluştur
      if (updates.messages && sessions[sessionIndex].title === 'Yeni Sohbet') {
        const firstUserMessage = updates.messages.find(msg => msg.role === 'user');
        if (firstUserMessage) {
          sessions[sessionIndex].title = firstUserMessage.content.substring(0, 50) + 
            (firstUserMessage.content.length > 50 ? '...' : '');
        }
      }
      
      this.saveSessions(sessions);
      return sessions[sessionIndex];
    }
    return null;
  }

  // Session'ı sil
  deleteSession(sessionId) {
    console.log('ChatHistoryService.deleteSession çağrıldı, ID:', sessionId);
    const sessions = this.getAllSessions();
    console.log('Mevcut sessions:', sessions);
    
    const filteredSessions = sessions.filter(session => session.id !== sessionId);
    console.log('Filtrelenmiş sessions:', filteredSessions);
    
    this.saveSessions(filteredSessions);
    console.log('Session silindi, localStorage:', localStorage.getItem(this.storageKey));
    
    return filteredSessions;
  }

  // Tüm sessions'ları kaydet
  saveSessions(sessions) {
    try {
      console.log('saveSessions çağrıldı, sessions:', sessions);
      localStorage.setItem(this.storageKey, JSON.stringify(sessions));
      console.log('localStorage güncellendi:', localStorage.getItem(this.storageKey));
    } catch (error) {
      console.error('Chat geçmişi kaydedilemedi:', error);
    }
  }

  // Tüm geçmişi temizle
  clearAllHistory() {
    console.log('clearAllHistory çağrıldı');
    console.log('Silme öncesi localStorage:', localStorage.getItem(this.storageKey));
    localStorage.removeItem(this.storageKey);
    console.log('Silme sonrası localStorage:', localStorage.getItem(this.storageKey));
  }
}

// Singleton instance
export const chatHistoryService = new ChatHistoryService();
