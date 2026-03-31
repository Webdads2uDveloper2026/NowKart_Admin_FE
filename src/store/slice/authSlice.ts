import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Fetch } from "../../api/axios";

export const loginAdmin = createAsyncThunk(
  "auth/login",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      const res = await Fetch({
        endpoint: "/admins/login",
        method: "POST",
        body: { email, password },
      });

      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  },
);

export const getProfile = createAsyncThunk(
  "auth/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await Fetch({
        endpoint: "/admins/me",
        method: "GET",
      });

      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.message || "Error fetching profile");
    }
  },
);

interface AuthState {
  loading: boolean;
  error: string | null;
  success: string | null;
  user: any;
}

const initialState: AuthState = {
  loading: false,
  success: null,
  error: null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthState: (state) => {
      state.error = null;
      state.success = null;
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.success = "Login Successfully";
        state.user = action.payload?.user;
        if (action.payload?.accessToken) {
          localStorage.setItem("token", action.payload?.accessToken);
        }
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(getProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearAuthState, logout } = authSlice.actions;
export default authSlice.reducer;
