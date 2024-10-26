import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from "../axios";

interface AuthState {
    user: any;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    isAuthenticated: !!localStorage.getItem('token'),
    loading: false,
    error: null,
};

export const login = createAsyncThunk(
    'auth/login',
    async (credentials: { email: string; password: string }, { rejectWithValue }) => {
        try {
            const response = await apiClient.post('/auth/login', credentials);
            localStorage.setItem('token', response.data.token);
            return response.data;
        } catch (error) {
            // @ts-ignore
            return rejectWithValue(error.response.data);
        }
    }
);

export const register = createAsyncThunk(
    'auth/register',
    async (userData: { name: string; email: string; password: string }, { rejectWithValue }) => {
        try {
            const response = await apiClient.post('/auth/register', userData);
            localStorage.setItem('token', response.data.token);
            return response.data;
        } catch (error) {
            // @ts-ignore
            return rejectWithValue(error.response.data);
        }
    }
);

export const logout = createAsyncThunk('auth/logout', async () => {
    localStorage.removeItem('token');
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.isAuthenticated = false;
            });
    },
});

export default authSlice.reducer;