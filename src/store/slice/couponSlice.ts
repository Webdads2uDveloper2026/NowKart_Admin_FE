import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Fetch } from "../../api/axios";

export const createCoupon = createAsyncThunk(
  "coupon/create",
  async (data: any, { rejectWithValue }) => {
    try {
      const res = await Fetch({
        endpoint: "/admin/coupon",
        method: "POST",
        body: data,
      });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message || "Create coupon failed",
      );
    }
  },
);

export const getCouponById = createAsyncThunk(
  "coupon/getById",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await Fetch({
        endpoint: `/admin/coupon/${id}`,
        method: "GET",
      });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message || "Fetch coupon failed",
      );
    }
  },
);

export const updateCoupon = createAsyncThunk(
  "coupon/update",
  async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
    try {
      const res = await Fetch({
        endpoint: `/admin/coupon/${id}`,
        method: "PATCH",
        body: data,
      });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message || "Update coupon failed",
      );
    }
  },
);

export const deleteCoupon = createAsyncThunk(
  "coupon/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await Fetch({
        endpoint: `/admin/coupon/${id}`,
        method: "DELETE",
      });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message || "Delete coupon failed",
      );
    }
  },
);

const couponSlice = createSlice({
  name: "coupon",
  initialState: {
    loading: false,
    coupon: null as any,

    createSuccess: false,
    updateSuccess: false,
    deleteSuccess: false,

    createError: null as any,
    updateError: null as any,
    deleteError: null as any,
  },

  reducers: {
    clearCouponState: (state) => {
      state.createSuccess = false;
      state.updateSuccess = false;
      state.deleteSuccess = false;
      state.createError = null;
      state.updateError = null;
      state.deleteError = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(createCoupon.pending, (state) => {
        state.loading = true;
      })
      .addCase(createCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.createSuccess = action.payload?.message || true;
      })
      .addCase(createCoupon.rejected, (state, action) => {
        state.loading = false;
        state.createError = action.payload;
      })

      .addCase(getCouponById.fulfilled, (state, action) => {
        state.coupon = action.payload;
      })

      .addCase(updateCoupon.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.updateSuccess = action.payload?.message || true;
      })
      .addCase(updateCoupon.rejected, (state, action) => {
        state.loading = false;
        state.updateError = action.payload;
      })

      .addCase(deleteCoupon.fulfilled, (state, action) => {
        state.deleteSuccess = action.payload?.message || true;
      })
      .addCase(deleteCoupon.rejected, (state, action) => {
        state.deleteError = action.payload;
      });
  },
});

export const { clearCouponState } = couponSlice.actions;
export default couponSlice.reducer;
