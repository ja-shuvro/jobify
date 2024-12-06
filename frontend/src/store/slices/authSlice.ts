import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the initial state for authentication
interface AuthState {
    token: string | null;
    isAuthenticated: boolean;
}

const initialState: AuthState = {
    token: localStorage.getItem('authToken') || null,
    isAuthenticated: localStorage.getItem('authToken') ? true : false,
};

// Create the auth slice
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // Set the token and mark the user as authenticated
        setToken(state, action: PayloadAction<string>) {
            state.token = action.payload;
            state.isAuthenticated = true;
            localStorage.setItem('authToken', action.payload);
        },

        // Clear the token and mark the user as logged out
        clearToken(state) {
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem('authToken');
        },
    },
});

export const { setToken, clearToken } = authSlice.actions;
export default authSlice.reducer;
