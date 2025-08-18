import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPlans } from '../redux/features/plans/plansSlice';

function Dashboard() {
  const dispatch = useDispatch();
  const { plans, loading } = useSelector((state) => state.plans);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      dispatch(getPlans(user.id));
    }
  }, [dispatch, user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Öğrenme Planlarım</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div key={plan.id} className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">{plan.title}</h2>
            <p className="text-gray-600 mb-4">{plan.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                Günlük Çalışma: {plan.dailyStudyTime} dakika
              </span>
              <span className={`px-2 py-1 rounded text-sm ${
                plan.status === 'active' ? 'bg-green-100 text-green-800' :
                plan.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {plan.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;