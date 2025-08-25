import React, { useState, useRef, useEffect } from 'react';
import { GlobeIcon, ChevronDownIcon, PaperClipIcon, AtIcon, SendIcon } from './Icons';
import { sendToAI } from '../api/ai';
import { chatHistoryService } from '../services/chatHistoryService';

const AIChat = ({ currentSessionId, onSessionSelect, onNewChat }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const textareaRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Chat scroll'unu en alta kaydır
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, streamingText]);



  // Messages değiştiğinde session'ı güncelle
  useEffect(() => {
    if (currentSessionId && messages.length > 0) {
      chatHistoryService.updateSession(currentSessionId, { messages });
    }
  }, [messages, currentSessionId]);



  // Props'tan gelen session ID değiştiğinde mesajları yükle
  useEffect(() => {
    if (currentSessionId) {
      const session = chatHistoryService.getSession(currentSessionId);
      if (session) {
        setMessages(session.messages || []);
      }
    } else {
      setMessages([]);
    }
  }, [currentSessionId]);

  const resetTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '60px';
      textareaRef.current.rows = 3;
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    setStreamingText("");
    resetTextareaHeight();
    
    try {
      let finalContent = "";
      const aiResponse = await sendToAI(newMessages, (text) => {
        setStreamingText(text);
        finalContent = text;
      });
      
      // Streaming tamamlandığında mesajları güncelle
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: finalContent || aiResponse.content 
      }]);
      setStreamingText("");
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin." 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    
    const textarea = e.target;
    textarea.style.height = 'auto';
    const newHeight = Math.min(Math.max(textarea.scrollHeight, 60), 240);
    textarea.style.height = newHeight + 'px';
  };

  return (
    <div className="h-full flex flex-col bg-gray-900 rounded-xl border border-gray-700">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">StudyAI Chat</h2>
        <button
          onClick={() => {
            if (window.confirm('Tüm sohbet geçmişini silmek istediğinizden emin misiniz?')) {
              chatHistoryService.clearAllHistory();
              setMessages([]);
              setStreamingText("");
              if (onNewChat) onNewChat();
            }
          }}
          className="text-xs text-red-400 hover:text-red-300 border border-red-400 rounded px-2 py-1 ml-4 transition-colors"
        >
          Sohbet Geçmişini Sil
        </button>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 min-h-0">
        {messages.length === 0 && !streamingText ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-xl font-bold text-white mb-4">
                Öğrenme yolculuğuna devam etmeye hazır mısın?
              </h3>
              <p className="text-gray-400">
                Bir soru sor ve öğrenmeye başla!
              </p>
            </div>
          </div>
        ) : (
          <div 
            ref={chatContainerRef}
            className="h-full overflow-y-auto p-4 space-y-4"
          >
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-4 rounded-lg ${
                  message.role === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-800 text-gray-100'
                }`}>
                  <div className="text-xs opacity-70 mb-1 font-medium">
                    {message.role === 'user' ? 'Sen' : 'StudyAI'}
                  </div>
                  <div className="whitespace-pre-wrap text-base leading-relaxed">
                    {message.content}
                  </div>
                </div>
              </div>
            ))}

            {/* Streaming Text */}
            {streamingText && (
              <div className="flex justify-start">
                <div className="max-w-[90%] p-4 rounded-lg bg-gray-800 text-gray-100">
                  <div className="text-xs opacity-70 mb-1 font-medium">StudyAI</div>
                  <div className="whitespace-pre-wrap text-base leading-relaxed">
                    {streamingText}
                    <span className="inline-block w-1 h-4 ml-1 bg-blue-500 animate-pulse"></span>
                  </div>
                </div>
              </div>
            )}

            {/* Loading Indicator */}
            {loading && !streamingText && (
              <div className="flex justify-start">
                <div className="p-4 rounded-lg bg-gray-800 text-gray-100">
                  <div className="text-xs opacity-70 mb-1 font-medium">StudyAI</div>
                  <div className="flex items-center space-x-2">
                    <div className="animate-pulse text-sm">Yazıyor</div>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Chat Input Container */}
      <div className="border-t border-gray-700 p-4">
        <div className="relative bg-gray-800 border border-gray-600 rounded-lg">
          {/* Input Area */}
          <div className="p-4">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="StudyAI'a sor veya workspace'inizden bir şey bulun..."
              className="w-full bg-transparent text-white placeholder-gray-400 resize-none border-0 outline-none text-base leading-relaxed"
              rows="3"
              style={{ minHeight: '60px', height: '60px' }}
              disabled={loading}
            />
          </div>
          
          {/* Bottom Controls */}
          <div className="flex items-center justify-between px-4 pb-3">
            {/* Left Side Controls */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center bg-gray-700 rounded-lg p-1">
                <button className="px-3 py-1 text-xs font-medium text-white bg-gray-600 rounded-md">
                  Ask
                </button>
              </div>
            </div>
            
            {/* Right Side Controls */}
            <div className="flex items-center space-x-2">          
              <button 
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <SendIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChat;