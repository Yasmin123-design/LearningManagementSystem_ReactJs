import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";
import { fetchFullCourseContent } from "./coursesSlice";

export interface Lesson {
  id: string;
  title: string;
  content: string;
  videoUrl: string;
  type: string;
  order: number;
  moduleId: string;
}

interface LessonsState {
  lessons: Lesson[];
  loading: boolean;
  error: string | null;
}

const initialState: LessonsState = {
  lessons: [],
  loading: false,
  error: null,
};

export const fetchLessonsByModule = createAsyncThunk(
  "lessons/fetchByModule",
  async (moduleId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/lessons/module/${moduleId}`);
      return response.data.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load lessons",
      );
    }
  },
);

export const createLesson = createAsyncThunk(
  "lessons/create",
  async (
    data: { title: string; content?: string; videoUrl?: string; type: string; order: number; moduleId: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.post("/lessons", data);
      return response.data.data || response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create lesson",
      );
    }
  },
);

export const updateLesson = createAsyncThunk(
  "lessons/update",
  async (
    { id, data }: { id: string; data: Partial<Lesson> },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.patch(`/lessons/${id}`, data);
      return response.data.data || response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update lesson",
      );
    }
  },
);

export const deleteLesson = createAsyncThunk(
  "lessons/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/lessons/${id}`);
      return id;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete lesson",
      );
    }
  },
);

const lessonsSlice = createSlice({
  name: "lessons",
  initialState,
  reducers: {
    clearLessons(state) {
      state.lessons = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLessonsByModule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLessonsByModule.fulfilled, (state, action) => {
        state.loading = false;
        // Merge or replace lessons? Let's replace for now based on current logic
        state.lessons = action.payload;
      })
      .addCase(fetchLessonsByModule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Listen to full course content fetch
      .addCase(fetchFullCourseContent.fulfilled, (state, action) => {
        const data = action.payload;
        let modules = [];
        if (Array.isArray(data)) {
          modules = data;
        } else if (data.modules) {
          modules = data.modules;
        }
        
        // Flatten lessons from all modules
        const allLessons: Lesson[] = [];
        modules.forEach((module: any) => {
          if (module.lessons && Array.isArray(module.lessons)) {
            allLessons.push(...module.lessons);
          }
        });
        state.lessons = allLessons;
      })
      .addCase(createLesson.fulfilled, (state, action) => {
        state.lessons.push(action.payload);
        state.lessons.sort((a, b) => (a.order || 0) - (b.order || 0));
      })
      .addCase(updateLesson.fulfilled, (state, action) => {
        const index = state.lessons.findIndex((l) => l.id === action.payload.id);
        if (index !== -1) {
          state.lessons[index] = { ...state.lessons[index], ...action.payload };
          state.lessons.sort((a, b) => (a.order || 0) - (b.order || 0));
        }
      })
      .addCase(deleteLesson.fulfilled, (state, action) => {
        state.lessons = state.lessons.filter((l) => l.id !== action.payload);
      });
  },
});

export const { clearLessons } = lessonsSlice.actions;
export default lessonsSlice.reducer;
