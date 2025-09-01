import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  fetchPlanTasks, 
  createNewTask, 
  updateTaskDetails, 
  removeTask, 
  markTaskAsCompleted,
  getTaskResources
} from '../../../api/taskService';

// Plana ait görevleri getir
export const getTasks = createAsyncThunk(
  'tasks/getTasks',
  async (planId, { rejectWithValue }) => {
    try {
      return await fetchPlanTasks(planId);
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// Yeni görev oluştur
export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData, { rejectWithValue }) => {
    try {
      return await createNewTask(taskData);
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// Görev güncelle
export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ taskId, taskData }, { rejectWithValue }) => {
    try {
      return await updateTaskDetails(taskId, taskData);
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// Görev sil
export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (taskId, { rejectWithValue }) => {
    try {
      return await removeTask(taskId);
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// Görevi tamamla
export const completeTask = createAsyncThunk(
  'tasks/completeTask',
  async (taskId, { rejectWithValue }) => {
    try {
      return await markTaskAsCompleted(taskId);
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// Görev kaynaklarını getir
export const getTaskResourcesThunk = createAsyncThunk(
  'tasks/getTaskResources',
  async (taskId, { rejectWithValue }) => {
    try {
      return await getTaskResources(taskId);
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

const initialState = {
  tasks: [],
  loading: false,
  error: null,
  success: false,
  currentTaskResources: null,
  selectedTaskWithResources: null,
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    resetSuccess: (state) => {
      state.success = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearTaskResources: (state) => {
      state.currentTaskResources = null;
    },
    setSelectedTaskWithResources: (state, action) => {
      state.selectedTaskWithResources = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // getTasks
      .addCase(getTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(getTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Görevler yüklenirken bir hata oluştu';
      })
      
      // createTask
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.push(action.payload);
        state.success = true;
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Görev oluşturulurken bir hata oluştu';
        state.success = false;
      })
      
      // updateTask
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = state.tasks.map(task => 
          task.id === action.payload.id ? action.payload : task
        );
        state.success = true;
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Görev güncellenirken bir hata oluştu';
        state.success = false;
      })
      
      // deleteTask
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = state.tasks.filter(task => task.id !== action.payload);
        state.success = true;
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Görev silinirken bir hata oluştu';
        state.success = false;
      })
      
      // completeTask
      .addCase(completeTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(completeTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = state.tasks.map(task => 
          task.id === action.payload.id ? action.payload : task
        );
      })
      .addCase(completeTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Görev tamamlanırken bir hata oluştu';
      })
      
      // getTaskResources - görev kaynakları
      .addCase(getTaskResourcesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTaskResourcesThunk.fulfilled, (state, action) => {
        state.loading = false;
        // Kaynaklar state'e eklenir, ancak task nesnesinin içine değil
        // Ayrı bir state alanında tutulur
        state.currentTaskResources = action.payload;
      })
      .addCase(getTaskResourcesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Görev kaynakları yüklenirken bir hata oluştu';
      });
  },
});

export const { resetSuccess, clearError, clearTaskResources, setSelectedTaskWithResources } = tasksSlice.actions;
export default tasksSlice.reducer;