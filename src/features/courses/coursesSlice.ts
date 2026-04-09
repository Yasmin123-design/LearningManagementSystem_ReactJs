import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import api from "../../services/api";

export interface Course {
  id: string;
  title: string;
  description: string;
  price?: string | number;
  isPremium: boolean;
  averageRating: string;
  instructorId: string;
  instructor?: {
    id: string;
    email: string;
    role: string;
    avatar: string;
  };
  thumbnail?: string | null;
  categoryId?: string;
  category?: {
    name: string;
  };
  reviewsCount?: number;
  progress?: number;
  isPublished?: boolean;
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  videoUrl: string;
  type: string;
  order: number;
  moduleId: string;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  order: number;
  courseId: string;
  lessons?: Lesson[];
  createdAt?: string;
  updatedAt?: string;
}

interface CoursesState {
  courses: Course[];
  currentCourse: Course | null;
  courseContent: Module[];
  loading: boolean;
  error: string | null;
}

const initialState: CoursesState = {
  courses: [],
  currentCourse: null,
  courseContent: [],
  loading: false,
  error: null,
};

export const fetchCourses = createAsyncThunk(
  "courses/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/courses");
      return response.data.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load courses",
      );
    }
  },
);

export const fetchCourseDetails = createAsyncThunk(
  "courses/fetchDetails",
  async (courseId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/courses/${courseId}`);
      return response.data.data || response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load course details",
      );
    }
  },
);

export const fetchModulesByCourse = createAsyncThunk(
  "courses/fetchModules",
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

export const fetchLessonsByModule = createAsyncThunk(
  "courses/fetchLessons",
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
);export const fetchInstructorCourses = createAsyncThunk(
  "courses/fetchInstructor",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/courses/instructor/me");
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load instructor courses",
      );
    }
  },
);

const coursesSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    clearCurrentCourse(state) {
      state.currentCourse = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCourses.fulfilled,
        (state, action: PayloadAction<Course[]>) => {
          state.loading = false;
          state.courses = action.payload;
        },
      )
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchCourseDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCourseDetails.fulfilled,
        (state, action: PayloadAction<Course>) => {
          state.loading = false;
          state.currentCourse = action.payload;
        },
      )
      .addCase(fetchCourseDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchModulesByCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchModulesByCourse.fulfilled,
        (state, action: PayloadAction<Module[]>) => {
          state.loading = false;
          state.courseContent = action.payload;
        },
      )
      .addCase(fetchModulesByCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(
        fetchLessonsByModule.fulfilled,
        (state, action: PayloadAction<Lesson[]>) => {
          // Find the module and add lessons to it
          if (action.payload.length > 0) {
            const moduleId = action.payload[0].moduleId;
            const module = state.courseContent.find((m) => m.id === moduleId);
            if (module) {
              module.lessons = action.payload;
            }
          }
        },
      )
      .addCase(fetchInstructorCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchInstructorCourses.fulfilled,
        (state, action: PayloadAction<{ data: Course[] }>) => {
          state.loading = false;
          state.courses = action.payload.data;
        },
      )
      .addCase(fetchInstructorCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentCourse } = coursesSlice.actions;
export default coursesSlice.reducer;
