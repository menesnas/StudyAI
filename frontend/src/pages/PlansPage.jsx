import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPlans } from '../redux/features/plans/plansSlice';
import LearningPlans from '../components/LearningPlans';

function PlansPage() {
  const dispatch = useDispatch();
  const { plans, loading } = useSelector((state) => state.plans);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      dispatch(getPlans(user.id));
    }
  }, [dispatch, user]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Öğrenme Planları</h1>
      <LearningPlans plans={plans} loading={loading} />
    </div>
  );
}

export default PlansPage;