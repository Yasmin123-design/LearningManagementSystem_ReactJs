import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchQuizByLesson = createAsyncThunk(
    'quiz/fetchByLesson',
    async (lessonId: string, { rejectWithValue }) => {
        try {
            const response = await api.get(`/lessons/${lessonId}/quiz`);
            return response.data.data || response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch quiz');
        }
    }
);

export const createQuiz = createAsyncThunk(
    'quiz/create',
    async ({ lessonId, data }: { lessonId: string, data: any }, { rejectWithValue }) => {
        try {
            const response = await api.post(`/lessons/${lessonId}/quiz`, data);
            return response.data.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to create quiz');
        }
    }
);

export const updateQuiz = createAsyncThunk(
    'quiz/update',
    async ({ quizId, data }: { quizId: string, data: any }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/quizzes/${quizId}`, data);
            return response.data.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to update quiz');
        }
    }
);

export const addQuestion = createAsyncThunk(
    'quiz/addQuestion',
    async ({ quizId, data }: { quizId: string, data: any }, { rejectWithValue }) => {
        try {
            const response = await api.post(`/quizzes/${quizId}/questions`, data);
            return response.data.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to add question');
        }
    }
);

export const deleteQuestion = createAsyncThunk(
    'quiz/deleteQuestion',
    async (id: string, { rejectWithValue }) => {
        try {
            await api.delete(`/quizzes/questions/${id}`);
            return id;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to delete question');
        }
    }
);

export const addOption = createAsyncThunk(
    'quiz/addOption',
    async ({ questionId, data }: { questionId: string, data: any }, { rejectWithValue }) => {
        try {
            const response = await api.post(`/quizzes/questions/${questionId}/options`, data);
            return response.data.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to add option');
        }
    }
);

export const updateOption = createAsyncThunk(
    'quiz/updateOption',
    async ({ optionId, data }: { optionId: string, data: any }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/quizzes/options/${optionId}`, data);
            return response.data.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to update option');
        }
    }
);

export const deleteOption = createAsyncThunk(
    'quiz/deleteOption',
    async (id: string, { rejectWithValue }) => {
        try {
            await api.delete(`/quizzes/options/${id}`);
            return id;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to delete option');
        }
    }
);

const quizSlice = createSlice({
    name: 'quiz',
    initialState: {
        loading: false,
        error: null as string | null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addMatcher(
                (action) => action.type.endsWith('/pending'),
                (state) => { state.loading = true; state.error = null; }
            )
            .addMatcher(
                (action) => action.type.endsWith('/fulfilled'),
                (state) => { state.loading = false; }
            )
            .addMatcher(
                (action: any) => action.type.endsWith('/rejected'),
                (state, action: any) => { state.loading = false; state.error = action.payload as string; }
            );
    }
});

export default quizSlice.reducer;
