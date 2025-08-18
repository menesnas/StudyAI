import React from 'react';
import { Link } from 'react-router-dom';
import { 
  HomeIcon, 
  CheckSquareIcon, 
  BookOpenIcon, 
  TargetIcon, 
  FolderIcon, 
  MapPinIcon,
  PlusIcon,
  CalendarIcon,
  TrendingUpIcon
} from 'lucide-react';

function HomePage() {
  const menuItems = [
    { id: 'home', name: 'Ana Sayfa', icon: HomeIcon, path: '/dashboard', color: 'text-blue-600' },
    { id: 'tasks', name: 'Yapılacak Görevler', icon: CheckSquareIcon, path: '/tasks', color: 'text-green-600' },
    { id: 'curriculum', name: 'Müfredat Planı', icon: BookOpenIcon, path: '/plans', color: 'text-purple-600' },
    { id: 'progress', name: 'Hedefe Kalan Yol', icon: TargetIcon, path: '/progress', color: 'text-orange-600' },
    { id: 'resources', name: 'Kaynaklar', icon: FolderIcon, path: '/resources', color: 'text-indigo-600' },
    { id: 'study-places', name: 'Yakındaki Çalışma Yerleri', icon: MapPinIcon, path: '/map', color: 'text-red-600' }
  ];

  const dashboardCards = [
    {
      title: 'Bugün\'ün Görevleri',
      description: '5 görev tamamlanmayı bekliyor',
      icon: CheckSquareIcon,
      color: 'bg-green-50 border-green-200',
      iconColor: 'text-green-600',
      path: '/tasks',
      stats: '3/8 tamamlandı'
    },
    {
      title: 'Aktif Planlarım',
      description: 'JavaScript ve React öğrenme planı devam ediyor',
      icon: BookOpenIcon,
      color: 'bg-purple-50 border-purple-200',
      iconColor: 'text-purple-600',
      path: '/plans',
      stats: '2 aktif plan'
    },
    {
      title: 'İlerleme Durumu',
      description: 'Bu hafta hedefinin %75\'ini tamamladın',
      icon: TrendingUpIcon,
      color: 'bg-blue-50 border-blue-200',
      iconColor: 'text-blue-600',
      path: '/progress',
      stats: '75% tamamlandı'
    },
    {
      title: 'Kaynak Kütüphanem',
      description: '15 video, 8 makale ve 3 kitap eklendi',
      icon: FolderIcon,
      color: 'bg-indigo-50 border-indigo-200',
      iconColor: 'text-indigo-600',
      path: '/resources',
      stats: '26 kaynak'
    },
    {
      title: 'Çalışma Alanları',
      description: 'Yakınındaki kütüphane ve kafeler',
      icon: MapPinIcon,
      color: 'bg-red-50 border-red-200',
      iconColor: 'text-red-600',
      path: '/map',
      stats: '12 mekan bulundu'
    },
    {
      title: 'Hedeflerim',
      description: 'Yıllık ve aylık öğrenme hedeflerin',
      icon: TargetIcon,
      color: 'bg-orange-50 border-orange-200',
      iconColor: 'text-orange-600',
      path: '/progress',
      stats: '3 aktif hedef'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg border-r border-gray-200">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-8">Personal Home</h1>
          
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className="flex items-center p-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200 group"
                >
                  <IconComponent className={`w-5 h-5 mr-3 ${item.color} group-hover:scale-110 transition-transform duration-200`} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <button className="w-full flex items-center p-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              <PlusIcon className="w-5 h-5 mr-3 text-gray-500" />
              <span className="font-medium">Yeni Sayfa</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Hoş geldin! 👋
              </h1>
              <p className="text-gray-600">
                Öğrenme yolculuğuna devam etmeye hazır mısın?
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Bugün</p>
                <p className="font-semibold text-gray-900">
                  {new Date().toLocaleDateString('tr-TR', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
              <CalendarIcon className="w-6 h-6 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Bu Hafta</p>
                <p className="text-2xl font-bold">12 saat</p>
                <p className="text-blue-100 text-sm">çalışma tamamlandı</p>
              </div>
              <TrendingUpIcon className="w-8 h-8 text-blue-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Tamamlanan</p>
                <p className="text-2xl font-bold">24 görev</p>
                <p className="text-green-100 text-sm">bu ay</p>
              </div>
              <CheckSquareIcon className="w-8 h-8 text-green-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Aktif Plan</p>
                <p className="text-2xl font-bold">3 plan</p>
                <p className="text-purple-100 text-sm">devam ediyor</p>
              </div>
              <BookOpenIcon className="w-8 h-8 text-purple-200" />
            </div>
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardCards.map((card) => {
            const IconComponent = card.icon;
            return (
              <Link
                key={card.title}
                to={card.path}
                className={`${card.color} border-2 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 group`}
              >
                <div className="flex items-start justify-between mb-4">
                  <IconComponent className={`w-8 h-8 ${card.iconColor} group-hover:scale-110 transition-transform duration-200`} />
                  <span className="text-xs font-semibold text-gray-500 bg-white px-2 py-1 rounded-full">
                    {card.stats}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-gray-700">
                  {card.title}
                </h3>
                
                <p className="text-gray-600 text-sm leading-relaxed">
                  {card.description}
                </p>
                
                <div className="mt-4 flex items-center text-gray-500 group-hover:text-gray-700">
                  <span className="text-sm font-medium">Detayları gör</span>
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Son Aktiviteler</h2>
          <div className="space-y-4">
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">React Hooks konusunu tamamladın</p>
                <p className="text-xs text-gray-500">2 saat önce</p>
              </div>
            </div>
            
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Yeni öğrenme planı oluşturdun: "JavaScript Temelleri"</p>
                <p className="text-xs text-gray-500">5 saat önce</p>
              </div>
            </div>
            
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">3 yeni kaynak eklendi: "Advanced React Patterns"</p>
                <p className="text-xs text-gray-500">1 gün önce</p>
              </div>
            </div>
          </div>
        </div>

        {/* Motivational Quote */}
        <div className="mt-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">💡 Günün Motivasyonu</h3>
            <p className="text-indigo-100 italic">
              "Öğrenme hiçbir zaman durdurulamaz. Ne yaş, ne de başka bir engel öğrenmeyi durdurabilir." 
            </p>
            <p className="text-indigo-200 text-sm mt-2">- Brian Tracy</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
