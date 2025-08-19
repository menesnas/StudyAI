import React from 'react';

const LearningPlans = ({ plans, loading }) => {
  if (loading) {
    return (
      <div className="mb-8">
        <div className="text-center text-white">Planlar yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Öğrenme Planlarım</h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-200">
          Yeni Plan Ekle
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
        {plans.length === 0 && <EmptyState />}
      </div>
    </div>
  );
};

const PlanCard = ({ plan }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-900 text-green-300';
      case 'completed':
        return 'bg-blue-900 text-blue-300';
      default:
        return 'bg-yellow-900 text-yellow-300';
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow border border-gray-700 hover:border-gray-600 transition-colors duration-200">
      <h3 className="text-xl font-semibold mb-2 text-white">{plan.title}</h3>
      <p className="text-gray-300 mb-4">{plan.description}</p>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-400">
          Günlük: {plan.dailyStudyTime} dk
        </span>
        <span className={`px-2 py-1 rounded text-sm ${getStatusColor(plan.status)}`}>
          {plan.status}
        </span>
      </div>
    </div>
  );
};

const EmptyState = () => (
  <div className="col-span-full bg-gray-800 p-8 rounded-lg text-center border border-gray-700">
    <h3 className="text-lg font-medium text-white mb-2">Henüz plan yok</h3>
    <p className="text-gray-400 mb-4">İlk öğrenme planını oluşturarak başla!</p>
    <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors duration-200">
      Plan Oluştur
    </button>
  </div>
);

export default LearningPlans;
