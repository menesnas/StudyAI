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
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Görevlerim</h1>
      <div className="space-y-4">
        {tasks.map((task) => (
          <div key={task.id} className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
            <div>
              <h3 className="font-semibold">{task.title}</h3>
              <p className="text-gray-600">{task.description}</p>
              <div className="text-sm text-gray-500">
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`px-2 py-1 rounded text-sm ${
                task.priority === 'high' ? 'bg-red-100 text-red-800' :
                task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {task.priority}
              </span>
              <span className={`px-2 py-1 rounded text-sm ${
                task.status === 'completed' ? 'bg-green-100 text-green-800' :
                task.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {task.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TasksPage;