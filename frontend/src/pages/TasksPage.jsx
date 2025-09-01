import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
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
    } else {
      // Eğer hiç plan yoksa planlar sayfasına yönlendir
      navigate('/plans');
    }
  }, [dispatch, selectedPlan, plans, navigate]);

  const handlePlanSelect = (plan) => {
    dispatch(setSelectedPlan(plan));
    setShowPlanSelector(false);
  };

  if (loading) {
    return <div className="p-6 text-white">Yükleniyor...</div>;
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
      <div className="space-y-4">
        {tasks.map((task) => (
          <div key={task.id} className="bg-gray-800 p-4 rounded-lg shadow border border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold text-white">{task.title}</h3>
                <p className="text-gray-300">{task.description}</p>
                <div className="text-sm text-gray-400">
                  Gün: {task.day}
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className={`px-2 py-1 rounded text-sm ${
                  task.priority === 'high' ? 'bg-red-900 text-red-300' :
                  task.priority === 'medium' ? 'bg-yellow-900 text-yellow-300' :
                  'bg-green-900 text-green-300'
                }`}>
                  {task.priority}
                </span>
                <span className={`px-2 py-1 rounded text-sm ${
                  task.status === 'completed' ? 'bg-green-900 text-green-300' :
                  task.status === 'pending' ? 'bg-yellow-900 text-yellow-300' :
                  'bg-red-900 text-red-300'
                }`}>
                  {task.status}
                </span>
                <button 
                  onClick={() => handleGetResources(task.id)}
                  className="px-3 py-1 bg-blue-700 hover:bg-blue-600 text-white rounded text-sm"
                >
                  Kaynaklar
                </button>
              </div>
            </div>
            
            {/* Seçilen görev için kaynakları göster */}
            {selectedTaskId === task.id && currentTaskResources && (
              <div className="mt-4 border-t border-gray-700 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-white font-medium">Önerilen Kaynaklar:</h4>
                  <a 
                    href="/resources" 
                    className="text-blue-400 hover:text-blue-300 text-sm flex items-center"
                  >
                    <span>Tüm kaynakları görüntüle</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
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
                    <a 
                      href="/resources" 
                      className="text-blue-400 hover:text-blue-300 text-sm inline-flex items-center"
                    >
                      <span>Diğer {currentTaskResources.resources.length - 4} kaynağı görüntüle</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        {tasks.length === 0 && (
          <div className="bg-gray-800 p-6 rounded-lg text-center">
            <p className="text-gray-300">Görevler</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TasksPage;