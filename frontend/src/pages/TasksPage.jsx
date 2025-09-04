import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { getTasks, getTaskResourcesThunk, setSelectedTaskWithResources } from '../redux/features/tasks/tasksSlice';
import { setSelectedPlan } from '../redux/features/plans/plansSlice';

function TasksPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tasks, loading, currentTaskResources } = useSelector((state) => state.tasks);
  const { selectedPlan, plans } = useSelector((state) => state.plans);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [showPlanSelector, setShowPlanSelector] = useState(false);

  useEffect(() => {
    if (selectedPlan) {
      dispatch(getTasks(selectedPlan.id));
    } else if (plans && plans.length > 0) {
      setShowPlanSelector(true);
    }
    // Plan yoksa da sayfayı göster, kullanıcı plan oluşturabilsin
  }, [dispatch, selectedPlan, plans]);

  const handlePlanSelect = (plan) => {
    dispatch(setSelectedPlan(plan));
    setShowPlanSelector(false);
  };

  if (loading) {
    return <div className="p-6 text-white">Yükleniyor...</div>;
  }

  // Hiç plan yoksa plan oluşturma ekranı göster
  if (!plans || plans.length === 0) {
    return (
      <div className="p-6">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
            <div className="mb-6">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-4">Henüz Görev Yok</h2>
            <p className="text-gray-400 mb-6">
              Görevlerinizi görüntülemek için önce bir öğrenme planı oluşturmanız gerekiyor.
            </p>
            <Link
              to="/plans"
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Plan Oluştur
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  // Plan seçilmemişse ve planlar varsa, plan seçim ekranını göster
  if (!selectedPlan && showPlanSelector) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6 text-white">Görevleri Görüntülemek İçin Plan Seçin</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              onClick={() => handlePlanSelect(plan)}
              className="bg-gray-800 rounded-lg p-6 cursor-pointer hover:bg-gray-700 transition-colors duration-200"
            >
              <h3 className="text-xl font-semibold text-white mb-2">{plan.title}</h3>
              <p className="text-gray-400 mb-4">{plan.description}</p>
              <div className="flex justify-between items-center text-sm">
                <span className="text-blue-400">
                  Süre: {plan.duration}
                </span>
                <span className="px-3 py-1 rounded-full bg-blue-500 text-white">
                  {plan.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Görev kaynaklarını getir
  const handleGetResources = (taskId) => {
    setSelectedTaskId(taskId);
    // Seçilen görevi bul
    const selectedTask = tasks.find(task => task.id === taskId);
    if (selectedTask) {
      // Redux store'a seçilen görevi kaydet
      dispatch(setSelectedTaskWithResources(selectedTask));
    }
    // Kaynakları getir
    dispatch(getTaskResourcesThunk(taskId));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-white">Görevlerim</h1>
      <div className="space-y-6">
        {tasks.map((task) => (
          <div key={task.id} className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
            {/* Görev Başlığı ve Gün Bilgisi */}
            <div className="bg-gray-700 px-6 py-4 border-b border-gray-600">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-1">{task.title}</h3>
                  <div className="text-sm text-gray-400">
                    Gün: {task.day}
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    task.priority === 'high' ? 'bg-red-600 text-white' :
                    task.priority === 'medium' ? 'bg-yellow-600 text-white' :
                    'bg-green-600 text-white'
                  }`}>
                    {task.priority === 'high' ? 'Yüksek' : task.priority === 'medium' ? 'Orta' : 'Düşük'}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    task.status === 'completed' ? 'bg-green-600 text-white' :
                    task.status === 'pending' ? 'bg-yellow-600 text-white' :
                    'bg-blue-600 text-white'
                  }`}>
                    {task.status === 'completed' ? 'Tamamlandı' : 
                     task.status === 'pending' ? 'Beklemede' : 
                     'Devam Ediyor'}
                  </span>
                </div>
              </div>
            </div>

            {/* Görev İçeriği */}
            <div className="px-6 py-4">
              <p className="text-gray-300 leading-relaxed mb-4">{task.description}</p>
              
              <div className="flex justify-end">
                <button 
                  onClick={() => handleGetResources(task.id)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Kaynakları Görüntüle
                </button>
              </div>
            </div>
            
            {/* Seçilen görev için kaynakları göster */}
            {selectedTaskId === task.id && currentTaskResources && (
              <div className="mt-4 border-t border-gray-700 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-white font-medium">Önerilen Kaynaklar:</h4>
                  <Link 
                    to="/resources" 
                    className="text-blue-400 hover:text-blue-300 text-sm flex items-center"
                  >
                    <span>Tüm kaynakları görüntüle</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
                
                {currentTaskResources.resources && currentTaskResources.resources.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {currentTaskResources.resources.slice(0, 4).map((link, index) => (
                      <div key={index} className="p-3 bg-gray-700 rounded-lg border border-gray-600 hover:border-blue-700 transition-colors">
                        <div className="flex items-start">
                          <div className="mr-2 text-blue-500 mt-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <a 
                              href={link} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-blue-400 hover:text-blue-300 text-sm block truncate"
                            >
                              {link}
                            </a>
                            <div className="text-xs text-gray-400 mt-1">
                              {new URL(link).hostname}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-gray-700 rounded-lg text-center">
                    <p className="text-gray-400">Kaynak bulunamadı.</p>
                  </div>
                )}
                
                {currentTaskResources.resources && currentTaskResources.resources.length > 4 && (
                  <div className="mt-3 text-center">
                    <Link 
                      to="/resources" 
                      className="text-blue-400 hover:text-blue-300 text-sm inline-flex items-center"
                    >
                      <span>Diğer {currentTaskResources.resources.length - 4} kaynağı görüntüle</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        {tasks.length === 0 && selectedPlan && (
          <div className="bg-gray-800 p-6 rounded-lg text-center border border-gray-700">
            <div className="mb-4">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Bu Planda Henüz Görev Yok</h3>
            <p className="text-gray-400 mb-4">Seçili planda henüz görev bulunmuyor. Yeni bir plan oluşturabilirsiniz.</p>
            <Link
              to="/plans"
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Yeni Plan Oluştur
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default TasksPage;