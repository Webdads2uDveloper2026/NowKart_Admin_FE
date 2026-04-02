import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Fetch } from "../../api/axios";

export const getInquiries = createAsyncThunk(
  "inquiry/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await Fetch({
        endpoint: "/admin/inquiry",
        method: "GET",
      });
      return res?.data;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message || "Fetch inquiries failed",
      );
    }
  },
);

export const getInquiryById = createAsyncThunk(
  "inquiry/getById",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await Fetch({
        endpoint: `/admin/inquiry/${id}`,
        method: "GET",
      });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message || "Fetch inquiry failed",
      );
    }
  },
);

export const updateInquiry = createAsyncThunk(
  "inquiry/update",
  async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
    try {
      const res = await Fetch({
        endpoint: `/admin/inquiry/${id}`,
        method: "PATCH",
        body: data,
      });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message || "Update inquiry failed",
      );
    }
  },
);

export const deleteInquiry = createAsyncThunk(
  "inquiry/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await Fetch({
        endpoint: `/admin/inquiry/${id}`,
        method: "DELETE",
      });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message || "Delete inquiry failed",
      );
    }
  },
);

const inquirySlice = createSlice({
  name: "inquiry",
  initialState: {
    loading: false,
    inquiries: [] as any[],
    inquiryDetails: null as any,
    fetchError: null as any,
    updateError: null as any,
    deleteError: null as any,
    updateSuccess: false,
    deleteSuccess: false,
  },

  reducers: {
    clearInquiryState: (state) => {
      state.updateSuccess = false;
      state.deleteSuccess = false;
      state.fetchError = null;
      state.updateError = null;
      state.deleteError = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getInquiries.pending, (state) => {
        state.loading = true;
      })
      .addCase(getInquiries.fulfilled, (state, action) => {
        state.loading = false;
        state.inquiries = action.payload?.inquiries;
      })
      .addCase(getInquiries.rejected, (state, action) => {
        state.loading = false;
        state.fetchError = action.payload;
      })

      .addCase(getInquiryById.fulfilled, (state, action) => {
        state.inquiryDetails = action.payload;
      })

      .addCase(updateInquiry.pending, (state) => {
        state.loading = true;
        state.updateSuccess = false;
      })
      .addCase(updateInquiry.fulfilled, (state, action) => {
        state.loading = false;
        state.updateSuccess = action.payload?.message || true;
      })
      .addCase(updateInquiry.rejected, (state, action) => {
        state.loading = false;
        state.updateError = action.payload;
      })

      .addCase(deleteInquiry.fulfilled, (state, action) => {
        state.deleteSuccess = action.payload?.message || true;
      })
      .addCase(deleteInquiry.rejected, (state, action) => {
        state.deleteError = action.payload;
      });
  },
});

export const { clearInquiryState } = inquirySlice.actions;
export default inquirySlice.reducer;
