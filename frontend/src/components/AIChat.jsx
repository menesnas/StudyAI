import React from 'react';
import { GlobeIcon, ChevronDownIcon, PaperClipIcon, AtIcon, SendIcon } from './Icons';

const AIChat = () => {
  return (
    <div className="mb-10">
      <h1 className="text-xl font-bold text-white mb-6 text-center mt-20">
        Öğrenme yolculuğuna devam etmeye hazır mısın?
      </h1>
      
      {/* Chat Input Container */}
      <div className="max-w-4xl mx-auto">
        <div className="relative bg-gray-800 border border-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200">
          {/* Input Area */}
          <div className="flex items-start p-4">
            <div className="flex-1">
              <div className="min-h-[60px] max-h-[240px] overflow-y-auto">
                <textarea
                  placeholder="StudyAI'a sor veya workspace'inizden bir şey bulun..."
                  className="w-full bg-transparent text-white placeholder-gray-400 resize-none border-0 outline-none text-base leading-relaxed"
                  rows="3"
                  style={{ minHeight: '60px' }}
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
              
              <button className="text-gray-400 hover:text-white transition-colors text-sm px-2 py-1">
                Research
              </button>
              <button className="text-gray-400 hover:text-white transition-colors text-sm px-2 py-1">
                Build
              </button>
            </div>
            
            {/* Right Side Controls */}
            <div className="flex items-center space-x-2">
              {/* Web Sources */}
              <button className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors text-sm px-2 py-1 rounded-md hover:bg-gray-700">
                <GlobeIcon />
                <span>Web</span>
                <ChevronDownIcon />
              </button>
              
              {/* Attach File */}
              <button className="text-gray-400 hover:text-white transition-colors p-1 rounded-md hover:bg-gray-700">
                <PaperClipIcon />
              </button>
              
              {/* Mention */}
              <button className="text-gray-400 hover:text-white transition-colors p-1 rounded-md hover:bg-gray-700">
                <AtIcon />
              </button>
              
              {/* Send Button */}
              <button className="bg-gray-600 hover:bg-gray-500 text-white p-2 rounded-full transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed">
                <SendIcon />
              </button>
            </div>
          </div>
        </div>
        
        {/* Quick Suggestions */}
        <div className="flex flex-wrap gap-2 mt-4 justify-center">
          <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-full text-sm text-gray-300 hover:text-white transition-colors duration-200">
            📚 Yeni öğrenme planı oluştur
          </button>
          <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-full text-sm text-gray-300 hover:text-white transition-colors duration-200">
            ✅ Bugünün görevlerini göster
          </button>
          <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-full text-sm text-gray-300 hover:text-white transition-colors duration-200">
            🎯 İlerleme durumumu analiz et
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
