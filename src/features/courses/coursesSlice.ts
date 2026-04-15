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

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
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
  categories: Category[];
  currentCourse: Course | null;
  courseContent: Module[];
  loading: boolean;
  error: string | null;
  fullCourseContent: any | null;
}

const initialState: CoursesState = {
  courses: [],
  categories: [],
  currentCourse: null,
  courseContent: [],
  fullCourseContent: null,
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


export const fetchFullCourseContent = createAsyncThunk(
  "courses/fetchFullContent",
  async (courseId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/courses/${courseId}/content`);
      return response.data.data || response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load full course content",
      );
    }
  },
);

export const fetchInstructorCourses = createAsyncThunk(
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

export const updateCourse = createAsyncThunk(
  "courses/update",
  async (
    { id, data }: { id: string; data: Partial<Course> },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.patch(`/courses/${id}`, data);
      return response.data.data || response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update course",
      );
    }
  },
);

export const deleteCourse = createAsyncThunk(
  "courses/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/courses/${id}`);
      return id;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete course",
      );
    }
  },
);

export const publishCourse = createAsyncThunk(
  "courses/publish",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/courses/${id}/publish`);
      return response.data.data || response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to publish course",
      );
    }
  },
);

export const fetchCategories = createAsyncThunk(
  "courses/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/categories");
      return response.data.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load categories",
      );
    }
  },
);

export const createCourse = createAsyncThunk(
  "courses/create",
  async (
    data: {
      title: string;
      description: string;
      price: number;
      categoryId: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.post("/courses", data);
      return response.data.data || response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create course",
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
      .addCase(fetchFullCourseContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
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
      })
      .addCase(updateCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateCourse.fulfilled,
        (state, action: PayloadAction<Course>) => {
          state.loading = false;
          const index = state.courses.findIndex(
            (c) => c.id === action.payload.id,
          );
          if (index !== -1) {
            state.courses[index] = action.payload;
          }
          if (state.currentCourse?.id === action.payload.id) {
            state.currentCourse = action.payload;
          }
        },
      )
      .addCase(updateCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteCourse.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.courses = state.courses.filter((c) => c.id !== action.payload);
          if (state.currentCourse?.id === action.payload) {
            state.currentCourse = null;
          }
        },
      )
      .addCase(deleteCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(publishCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(publishCourse.fulfilled, (state, action: PayloadAction<Course>) => {
        state.loading = false;
        const index = state.courses.findIndex(
          (c) => c.id === action.payload.id,
        );
        if (index !== -1) {
          state.courses[index] = action.payload;
        }
        if (state.currentCourse?.id === action.payload.id) {
          state.currentCourse = action.payload;
        }
      })
      .addCase(publishCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<Category[]>) => {
        state.categories = action.payload;
      })
      .addCase(createCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCourse.fulfilled, (state, action: PayloadAction<Course>) => {
        state.loading = false;
        state.courses.unshift(action.payload);
      })
      .addCase(createCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentCourse } = coursesSlice.actions;
export default coursesSlice.reducer;
