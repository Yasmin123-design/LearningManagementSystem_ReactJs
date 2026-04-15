import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import api from "../../services/api";

export interface User {
  id: string;
  email: string;
  role: string;
  isVerified: boolean;
  name: string;
  bio?: string | null;
  avatar?: string | null;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isInitialized: boolean;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("token") || null,
  loading: false,
  error: null,
  isInitialized: false,
};

export const login = createAsyncThunk(
  "auth/login",
  async (
    credentials: Record<string, string>,
    { dispatch, rejectWithValue },
  ) => {
    try {
      const response = await api.post("/auth/login", credentials);
      const data = response.data.data;

      // Update tokens in state and localStorage immediately
      dispatch(
        setToken({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        }),
      );

      // Fetch user profile immediately after login
      await dispatch(fetchProfile()).unwrap();

      return data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  },
);

export const register = createAsyncThunk(
  "auth/register",
  async (userData: Record<string, string>, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/register", userData);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Registration failed",
      );
    }
  },
);

export const fetchProfile = createAsyncThunk(
  "auth/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/users/me");
      return response.data.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch profile",
      );
    }
  },
);

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (userData: Partial<User>, { rejectWithValue }) => {
    try {
      const response = await api.patch("/users/me", userData);
      return response.data.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update profile",
      );
    }
  },
);

export const updateAvatar = createAsyncThunk(
  "auth/updateAvatar",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await api.patch("/users/me/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update avatar",
      );
    }
  },
);

export const getGoogleAuthUrl = createAsyncThunk(
  "auth/getGoogleUrl",
  async () => {
    return `${api.defaults.baseURL}/auth/google`;
  },
);

export const getLinkedInAuthUrl = createAsyncThunk(
  "auth/getLinkedInUrl",
  async () => {
    return `${api.defaults.baseURL}/auth/linkedin`;
  },
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/forgot-password", { email });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to send reset email",
      );
    }
  },
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (data: { token: string; newPassword: string }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/reset-password", data);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to reset password",
      );
    }
  },
);

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (
    data: { oldPassword: string; newPassword: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.patch("/users/me/change-password", data);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to change password",
      );
    }
  },
);

export const initializeAuth = createAsyncThunk(
  "auth/initializeAuth",
  async (_, { dispatch, rejectWithValue }) => {
    const token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refreshToken");

    if (!token && !refreshToken) {
      return rejectWithValue("No tokens found");
    }

    try {
      // If we have an access token, try to fetch the profile.
      // If the access token is expired, the interceptor in services/api.ts
      // will automatically attempt to refresh it.
      await dispatch(fetchProfile()).unwrap();

      // Sync the new token (if it was refreshed) back to Redux state
      const newToken = localStorage.getItem("token");
      if (newToken) {
        dispatch(setToken({ accessToken: newToken }));
      }

      return true;
    } catch (error) {
      return rejectWithValue("Authentication failed");
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
    },
    setToken(
      state,
      action: PayloadAction<{ accessToken: string; refreshToken?: string }>,
    ) {
      state.token = action.payload.accessToken;
      localStorage.setItem("token", action.payload.accessToken);
      if (action.payload.refreshToken) {
        localStorage.setItem("refreshToken", action.payload.refreshToken);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        login.fulfilled,
        (
          state,
          action: PayloadAction<{
            accessToken: string;
            refreshToken?: string;
            user?: User;
          }>,
        ) => {
          state.loading = false;
          state.token = action.payload.accessToken;
          localStorage.setItem("token", action.payload.accessToken);
          if (action.payload.refreshToken) {
            localStorage.setItem("refreshToken", action.payload.refreshToken);
          }
        },
      )
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProfile.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.token = null;
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        updateProfile.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.loading = false;
          state.user = action.payload;
        },
      )
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateAvatar.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateAvatar.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateAvatar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(initializeAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(initializeAuth.fulfilled, (state) => {
        state.loading = false;
        state.isInitialized = true;
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.loading = false;
        state.isInitialized = true;
      });
  },
});

export const { logout, setToken } = authSlice.actions;
export default authSlice.reducer;
