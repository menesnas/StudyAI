import React from 'react';
import { useDispatch } from 'react-redux';
import { setSelectedPlan, deletePlan } from '../redux/features/plans/plansSlice';
import { useNavigate } from 'react-router-dom';

const LearningPlans = ({ plans, loading }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handlePlanClick = (plan) => {
    dispatch(setSelectedPlan(plan));
    navigate('/tasks'); // Görevler sayfasına yönlendir
  };

  const handleDelete = (e, planId) => {
    e.stopPropagation(); // buton tıklaması karttaki click'i tetiklememeli
    if (!window.confirm('Bu planı gerçekten silmek istiyor musunuz?')) return;
    dispatch(deletePlan(planId));
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
          <div className="mt-4 pt-4 border-t border-gray-700">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Süre:</span>
                <span className="text-blue-400 font-medium">
                  {plan.duration || plan.targetDuration ? `${plan.duration || plan.targetDuration} gün` : 'Belirtilmedi'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Durum:</span>
                <span className={`font-medium ${
                  plan.status === 'active' ? 'text-green-400' : 
                  plan.status === 'completed' ? 'text-blue-400' : 
                  'text-yellow-400'
                }`}>
                  {plan.status === 'active' ? 'aktif' : 
                   plan.status === 'completed' ? 'tamamlandı' : 
                   'duraklatıldı'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Kategori:</span>
                <span className="px-2 py-1 rounded-full bg-blue-500 text-white text-xs">
                  {plan.category || 'Genel'}
                </span>
              </div>
            </div>
            <div className="flex justify-end mt-3">
              <button
                onClick={(e) => handleDelete(e, plan.id)}
                className="text-sm text-red-400 hover:text-red-600 px-3 py-1 rounded"
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LearningPlans;
