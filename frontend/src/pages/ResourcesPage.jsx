import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getTasks, getTaskResourcesThunk } from '../redux/features/tasks/tasksSlice';
import { setSelectedPlan } from '../redux/features/plans/plansSlice';

function ResourcesPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { tasks, loading, currentTaskResources } = useSelector((state) => state.tasks);
  const { plans, selectedPlan } = useSelector((state) => state.plans);
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

  const handleGetResources = (taskId) => {
    setSelectedTaskId(taskId);
    dispatch(getTaskResourcesThunk(taskId));
  };

  if (loading) {
    return <div className="p-6 text-white">Yükleniyor...</div>;
  }
  
  // Plan seçilmemişse ve planlar varsa, plan seçim ekranını göster
  if (!selectedPlan && showPlanSelector) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6 text-white">Kaynakları Görüntülemek İçin Plan Seçin</h1>
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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Önerilen Kaynaklar</h1>
        <a 
          href="/tasks" 
          className="text-blue-400 hover:text-blue-300 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Görevlere Dön</span>
        </a>
      </div>
      
      {!selectedPlan && (
        <div className="bg-gray-800 p-4 rounded-lg shadow border border-gray-700 mb-6">
          <p className="text-gray-300">Lütfen önce bir öğrenme planı seçin.</p>
        </div>
      )}
      
      {selectedPlan && (
        <>
          <div className="bg-gray-800 p-4 rounded-lg shadow border border-gray-700 mb-6">
            <h2 className="text-xl font-semibold text-white mb-2">{selectedPlan.title}</h2>
            <p className="text-gray-300">{selectedPlan.description}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 bg-gray-800 p-4 rounded-lg shadow border border-gray-700">
              <h3 className="font-semibold text-white mb-4">Görevler</h3>
              <div className="space-y-3">
                {tasks.map((task) => (
                  <div 
                    key={task.id} 
                    className={`p-3 rounded-lg cursor-pointer ${
                      selectedTaskId === task.id 
                        ? 'bg-blue-900 border border-blue-700' 
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                    onClick={() => handleGetResources(task.id)}
                  >
                    <h4 className="font-medium text-white">{task.title}</h4>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm text-gray-300">Gün: {task.day}</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        task.priority === 'high' ? 'bg-red-900 text-red-300' :
                        task.priority === 'medium' ? 'bg-yellow-900 text-yellow-300' :
                        'bg-green-900 text-green-300'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                ))}
                {tasks.length === 0 && (
                  <p className="text-gray-400">Bu planda görev bulunmuyor.</p>
                )}
              </div>
            </div>
            
            <div className="md:col-span-2 bg-gray-800 p-4 rounded-lg shadow border border-gray-700">
              <h3 className="font-semibold text-white mb-4">Kaynaklar</h3>
              {selectedTaskId && currentTaskResources ? (
                <>
                  <div className="mb-4 p-4 bg-gray-700 rounded-lg border border-gray-600">
                    <h4 className="text-white font-medium text-lg">{currentTaskResources.title}</h4>
                    {currentTaskResources.taskId && (
                      <div className="mt-2 text-sm text-gray-400">
                        Görev ID: {currentTaskResources.taskId}
                      </div>
                    )}
                  </div>
                  
                  {currentTaskResources.resources && currentTaskResources.resources.length > 0 ? (
                    <div className="space-y-3">
                      {currentTaskResources.resources.map((link, index) => (
                        <div key={index} className="p-4 bg-gray-700 rounded-lg border border-gray-600 hover:border-blue-700 transition-colors">
                          <div className="flex items-start">
                            <div className="mr-3 text-blue-500 mt-1">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                              </svg>
                            </div>
                            <div className="flex-1">
                              <a 
                                href={link} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-blue-400 hover:text-blue-300 block break-all"
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
                    <div className="p-4 bg-gray-700 rounded-lg border border-gray-600 text-center">
                      <p className="text-gray-400">Bu görev için kaynak bulunamadı.</p>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-gray-400">Kaynakları görüntülemek için bir görev seçin.</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ResourcesPage;
