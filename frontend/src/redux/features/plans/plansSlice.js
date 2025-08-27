import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  fetchUserPlans, 
  createNewPlan, 
  fetchPlanDetails, 
  updatePlanDetails, 
  removePlan 
} from '../../../api/planService';

// Kullanıcının planlarını getir
export const getPlans = createAsyncThunk(
  'plans/getPlans',
  async (userId, { rejectWithValue }) => {
    try {
      return await fetchUserPlans(userId);
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// Normal plan oluşturma
export const createPlan = createAsyncThunk(
  'plans/createPlan',
  async (planData, { rejectWithValue }) => {
    try {
      return await createNewPlan(planData);
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// AI ile plan oluşturma
export const createAIPlan = createAsyncThunk(
  'plans/createAIPlan',
  async (message, thunkAPI) => {
    try {
      const response = await axios.post('/api/ai/ask', { message });
      const { plans, tasks } = response.data;
      
      // Her plan için veritabanına kaydet
      const savedPlans = await Promise.all(
        plans.map(plan => axios.post('/api/plans', plan))
      );
      
      // Her görev için veritabanına kaydet
      const savedTasks = await Promise.all(
        tasks.map(task => axios.post('/api/tasks', task))
      );
      
      return { plans: savedPlans.data, tasks: savedTasks.data };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Plan detayını getir
export const getPlanById = createAsyncThunk(
  'plans/getPlanById',
  async (planId, { rejectWithValue }) => {
    try {
      return await fetchPlanDetails(planId);
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// Plan güncelle
export const updatePlan = createAsyncThunk(
  'plans/updatePlan',
  async ({ planId, planData }, { rejectWithValue }) => {
    try {
      return await updatePlanDetails(planId, planData);
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// Plan sil
export const deletePlan = createAsyncThunk(
  'plans/deletePlan',
  async (planId, { rejectWithValue }) => {
    try {
      return await removePlan(planId);
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

const initialState = {
  plans: [],
  selectedPlan: null,
  loading: false,
  error: null,
  success: false,
};

const plansSlice = createSlice({
  name: 'plans',
  initialState,
  reducers: {
    resetSuccess: (state) => {
      state.success = false;
    },
    setSelectedPlan: (state, action) => {
      state.selectedPlan = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // getPlans
      .addCase(getPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.plans = action.payload;
      })
      .addCase(getPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Planlar yüklenirken bir hata oluştu';
      })
      
      // createPlan
      .addCase(createPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.plans.push(action.payload);
        state.success = true;
      })
      .addCase(createPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Plan oluşturulurken bir hata oluştu';
        state.success = false;
      })
      
      // createAIPlan
      .addCase(createAIPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createAIPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.plans.push(...action.payload.plans);
        state.success = true;
      })
      .addCase(createAIPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'AI plan oluşturulurken bir hata oluştu';
        state.success = false;
      })
      
      // getPlanById
      .addCase(getPlanById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPlanById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedPlan = action.payload;
      })
      .addCase(getPlanById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Plan detayı yüklenirken bir hata oluştu';
      })
      
      // updatePlan
      .addCase(updatePlan.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updatePlan.fulfilled, (state, action) => {
        state.loading = false;
        state.plans = state.plans.map(plan => 
          plan.id === action.payload.id ? action.payload : plan
        );
        state.selectedPlan = action.payload;
        state.success = true;
      })
      .addCase(updatePlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Plan güncellenirken bir hata oluştu';
        state.success = false;
      })
      
      // deletePlan
      .addCase(deletePlan.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deletePlan.fulfilled, (state, action) => {
        state.loading = false;
        state.plans = state.plans.filter(plan => plan.id !== action.payload);
        if (state.selectedPlan && state.selectedPlan.id === action.payload) {
          state.selectedPlan = null;
        }
        state.success = true;
      })
      .addCase(deletePlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Plan silinirken bir hata oluştu';
        state.success = false;
      });
  },
});

export const { resetSuccess, setSelectedPlan, clearError } = plansSlice.actions;
export default plansSlice.reducer;