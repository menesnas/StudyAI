import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTasks } from '../redux/features/tasks/tasksSlice';

function TasksPage() {
  const dispatch = useDispatch();
  const { tasks, loading } = useSelector((state) => state.tasks);
  const { selectedPlan } = useSelector((state) => state.plans);

  useEffect(() => {
    if (selectedPlan) {
      dispatch(getTasks(selectedPlan.id));
    }
  }, [dispatch, selectedPlan]);

  if (loading) {
    return <div className="p-6 text-white">Yükleniyor...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-white">Görevlerim</h1>
      <div className="space-y-4">
        {tasks.map((task) => (
          <div key={task.id} className="bg-gray-800 p-4 rounded-lg shadow border border-gray-700 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-white">sdfgdsg {task.title}</h3>
              <p className="text-gray-300">{task.description}</p>
              <div className="text-sm text-gray-400">
                Bitiş: {new Date(task.dueDate).toLocaleDateString()}
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
            </div>
          </div>
        ))}
        {tasks.length === 0 && (
          <div className="bg-gray-800 p-6 rounded-lg text-center">
            <p className="text-gray-300">Henüz göreviniz bulunmuyor.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TasksPage;