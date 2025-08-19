import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPlans } from '../redux/features/plans/plansSlice';
import AIChat from '../components/AIChat';
import LearningPlans from '../components/LearningPlans';
import QuickActions from '../components/QuickActions';

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
    return <div className="p-6 text-white">Yükleniyor...</div>;
  }

  return (
    <div className="p-6">
      <AIChat />
      <LearningPlans plans={plans} loading={loading} />
      <QuickActions />
    </div>
  );
}

export default Dashboard;