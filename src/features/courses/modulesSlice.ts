import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";
import { fetchFullCourseContent } from "./coursesSlice";

export interface Module {
  id: string;
  title: string;
  description: string;
  order: number;
  courseId: string;
  lessons?: any[];
  createdAt?: string;
  updatedAt?: string;
}

interface ModulesState {
  modules: Module[];
  loading: boolean;
  error: string | null;
}

const initialState: ModulesState = {
  modules: [],
  loading: false,
  error: null,
};

export const fetchModulesByCourse = createAsyncThunk(
  "modules/fetchByCourse",
  async (courseId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/modules/course/${courseId}`);
      return response.data.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load modules",
      );
    }
  },
);

export const createModule = createAsyncThunk(
  "modules/create",
  async (
    data: { title: string; description?: string; order: number; courseId: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.post("/modules", data);
      return response.data.data || response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create module",
      );
    }
  },
);

export const updateModule = createAsyncThunk(
  "modules/update",
  async (
    { id, data }: { id: string; data: Partial<{ title: string; description: string; order: number }> },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.patch(`/modules/${id}`, data);
      return response.data.data || response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update module",
      );
    }
  },
);

export const deleteModule = createAsyncThunk(
  "modules/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/modules/${id}`);
      return id;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete module",
      );
    }
  },
);

const modulesSlice = createSlice({
  name: "modules",
  initialState,
  reducers: {
    clearModules(state) {
      state.modules = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchModulesByCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchModulesByCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.modules = action.payload;
      })
      .addCase(fetchModulesByCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Listen to full course content fetch
      .addCase(fetchFullCourseContent.fulfilled, (state, action) => {
        const data = action.payload;
        if (Array.isArray(data)) {
          state.modules = data;
        } else if (data.modules) {
          state.modules = data.modules;
        }
      })
      .addCase(createModule.fulfilled, (state, action) => {
        state.modules.push({ ...action.payload, lessons: [] });
        state.modules.sort((a, b) => (a.order || 0) - (b.order || 0));
      })
      .addCase(updateModule.fulfilled, (state, action) => {
        const index = state.modules.findIndex((m) => m.id === action.payload.id);
        if (index !== -1) {
          state.modules[index] = { ...state.modules[index], ...action.payload };
          state.modules.sort((a, b) => (a.order || 0) - (b.order || 0));
        }
      })
      .addCase(deleteModule.fulfilled, (state, action) => {
        state.modules = state.modules.filter((m) => m.id !== action.payload);
      });
  },
});

export const { clearModules } = modulesSlice.actions;
export default modulesSlice.reducer;
