import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser, registerUser } from '../../../api/authService';

export const login = createAsyncThunk('auth/login', async (userData, { rejectWithValue }) => {
  try {
    const data = await loginUser(userData);
    return data; // localStorage'a kaydetme işlemi authService içinde yapılıyor
  } catch (error) {
    return rejectWithValue(error.response?.data);
  }
});

export const register = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const data = await registerUser(userData);
    return data; // localStorage'a kaydetme işlemi authService içinde yapılıyor
  } catch (error) {
    return rejectWithValue(error.response?.data);
  }
});

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('user');
      state.user = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Giriş yapılırken bir hata oluştu';
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Kayıt olurken bir hata oluştu';
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;