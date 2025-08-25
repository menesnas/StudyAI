import React, { useState, useRef, useEffect } from 'react';
import { GlobeIcon, ChevronDownIcon, PaperClipIcon, AtIcon, SendIcon } from './Icons';
import { sendToAI } from '../api/ai';

const AIChat = () => {
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
    <div className="mb-10">
      <h1 className="text-xl font-bold text-white mb-6 text-center mt-20">
        Öğrenme yolculuğuna devam etmeye hazır mısın?
      </h1>
      
      {/* Chat Messages */}
      {(messages.length > 0 || streamingText) && (
        <div className="max-w-4xl mx-auto mb-6">
          <div 
            ref={chatContainerRef}
            className="bg-gray-900 border border-gray-700 rounded-xl p-4 max-h-96 overflow-y-auto"
          >
            {messages.map((message, index) => (
              <div key={index} className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                <div className={`inline-block max-w-[80%] p-3 rounded-lg ${
                  message.role === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-gray-100'
                }`}>
                  <div className="text-xs opacity-70 mb-1">
                    {message.role === 'user' ? 'Sen' : 'StudyAI'}
                  </div>
                  <div className="whitespace-pre-wrap">{message.content}</div>
                </div>
              </div>
            ))}

            {/* Streaming Text */}
            {streamingText && (
              <div className="text-left mb-4">
                <div className="inline-block max-w-[80%] p-3 rounded-lg bg-gray-700 text-gray-100">
                  <div className="text-xs opacity-70 mb-1">StudyAI</div>
                  <div className="whitespace-pre-wrap">
                    {streamingText}
                    <span className="inline-block w-1 h-4 ml-1 bg-blue-500 animate-pulse"></span>
                  </div>
                </div>
              </div>
            )}

            {/* Loading Indicator */}
            {loading && !streamingText && (
              <div className="text-left mb-4">
                <div className="inline-block bg-gray-700 text-gray-100 p-3 rounded-lg">
                  <div className="text-xs opacity-70 mb-1">StudyAI</div>
                  <div className="flex items-center space-x-2">
                    <div className="animate-pulse">Yazıyor</div>
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
        </div>
      )}
      
      {/* Chat Input Container */}
      <div className="max-w-4xl mx-auto">
        <div className="relative bg-gray-800 border border-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200">
          {/* Input Area */}
          <div className="flex items-start p-4">
            <div className="flex-1">
              <div className="min-h-[60px] max-h-[240px] overflow-y-auto">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="StudyAI'a sor veya workspace'inizden bir şey bulun..."
                  className="w-full bg-transparent text-white placeholder-gray-400 resize-none border-0 outline-none text-base leading-relaxed transition-all duration-200"
                  rows="3"
                  style={{ minHeight: '60px', height: '60px' }}
                  disabled={loading}
                />
              </div>
            </div>
          </div>
          
          {/* Bottom Controls */}
          <div className="flex items-center justify-between px-4 pb-3 pt-1">
            {/* Left Side Controls */}
            <div className="flex items-center space-x-2">
              {/* Mode Selector */}
              <div className="flex items-center bg-gray-700 rounded-lg p-1">
                <button className="px-3 py-1 text-sm font-medium text-white bg-gray-600 rounded-md">
                  Ask
                </button>
                <button className="px-3 py-1 text-sm font-medium text-gray-400 hover:text-white transition-colors">
                  <ChevronDownIcon className="ml-1" />
                </button>
              </div>
            </div>
            
            {/* Right Side Controls */}
            <div className="flex items-center space-x-2">          
              {/* Send Button */}
              <button 
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="bg-gray-600 hover:bg-gray-500 text-white p-2 rounded-full transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
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