import React from 'react';
import { useDispatch } from 'react-redux';
import { setSelectedPlan } from '../redux/features/plans/plansSlice';
import { useNavigate } from 'react-router-dom';

const LearningPlans = ({ plans, loading }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handlePlanClick = (plan) => {
    dispatch(setSelectedPlan(plan));
    navigate('/tasks'); // Görevler sayfasına yönlendir
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!plans || plans.length === 0) {
    return (
      <div className="text-center p-8 text-gray-400">
        <p>Henüz öğrenme planınız yok.</p>
        <p className="mt-2">AI'dan yeni bir plan oluşturmasını isteyebilirsiniz.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {plans.map((plan) => (
        <div
          key={plan.id}
          onClick={() => handlePlanClick(plan)}
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
          <div className="mt-4 pt-4 border-t border-gray-700">
            <div className="flex justify-between text-sm text-gray-400">
              <span>Durum: {plan.status}</span>
              {/* İlerleme çubuğu eklenebilir */}
              <div className="w-24 bg-gray-600 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full" 
                  style={{ width: `${plan.progress || 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LearningPlans;
