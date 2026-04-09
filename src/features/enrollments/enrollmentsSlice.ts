import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import api from "../../services/api";
import type { Course } from "../courses/coursesSlice";

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  course: Course;
  isPaid: boolean;
  progress: number;
  enrolledAt: string;
}

interface EnrollmentsState {
  enrollments: Enrollment[];
  loading: boolean;
  error: string | null;
}

const initialState: EnrollmentsState = {
  enrollments: [],
  loading: false,
  error: null,
};

export const fetchMyEnrollments = createAsyncThunk(
  "enrollments/fetchMe",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/enrollments/me");
      return response.data.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load enrollments",
      );
    }
  },
);

export const enrollInCourse = createAsyncThunk(
  "enrollments/enroll",
  async (courseId: string, { rejectWithValue }) => {
    try {
      const response = await api.post("/enrollments", { courseId });
      return response.data.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to enroll in course",
      );
    }
  },
);

export const getPaymentUrl = createAsyncThunk(
  "enrollments/getPaymentUrl",
  async (
    { courseId, successUrl }: { courseId: string; successUrl?: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.post("/payments", { courseId, successUrl });
      return response.data.data.url;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to get payment URL",
      );
    }
  },
);

const enrollmentsSlice = createSlice({
  name: "enrollments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyEnrollments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchMyEnrollments.fulfilled,
        (state, action: PayloadAction<Enrollment[]>) => {
          state.loading = false;
          state.enrollments = action.payload;
        },
      )
      .addCase(fetchMyEnrollments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(enrollInCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        enrollInCourse.fulfilled,
        (state, action: PayloadAction<Enrollment>) => {
          state.loading = false;
          state.enrollments.push(action.payload);
        },
      )
      .addCase(enrollInCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default enrollmentsSlice.reducer;
