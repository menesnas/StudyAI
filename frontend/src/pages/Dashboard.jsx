import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useOutletContext } from 'react-router-dom';
import { getPlans } from '../redux/features/plans/plansSlice';
import AIChat from '../components/AIChat';
import LearningPlans from '../components/LearningPlans';
import QuickActions from '../components/QuickActions';

function Dashboard() {
  const dispatch = useDispatch();
  const { plans, loading } = useSelector((state) => state.plans);
  const { user } = useSelector((state) => state.auth);
  const { dashboardSessionId, onSessionSelect, onNewChat } = useOutletContext();

  useEffect(() => {
    if (user) {
      dispatch(getPlans(user.id));
    }
  }, [dispatch, user]);

  if (loading) {
    return <div className="p-6 text-white">Yükleniyor...</div>;
  }

  return (
    <div className="h-full flex flex-col">
      {/* Chat Section */}
      <div className="flex-1 min-h-0 p-6">
        <AIChat 
          currentSessionId={dashboardSessionId}
          onSessionSelect={onSessionSelect}
          onNewChat={onNewChat}
        />
      </div>
      
      {/* Other Components */}
      <div className="flex-shrink-0 p-6 pt-0 max-h-96 overflow-y-auto">
        <LearningPlans plans={plans} loading={loading} />
        <QuickActions />
      </div>
    </div>
  );
}

export default Dashboard;