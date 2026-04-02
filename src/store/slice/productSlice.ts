import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Fetch } from "../../api/axios";

export const createProduct = createAsyncThunk(
  "product/create",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const res = await Fetch({
        endpoint: "/admin/product",
        method: "POST",
        body: formData,
      });
      return res;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message || "Create product failed",
      );
    }
  },
);

export const getProducts = createAsyncThunk(
  "product/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await Fetch({
        endpoint: "/admin/product",
        method: "GET",
      });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message || "Fetch products failed",
      );
    }
  },
);

export const getVendorProducts = createAsyncThunk(
  "product/getVendor",
  async (_, { rejectWithValue }) => {
    try {
      const res = await Fetch({
        endpoint: "/admin/product/vendor/all",
        method: "GET",
      });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message || "Fetch vendor products failed",
      );
    }
  },
);

export const updateProduct = createAsyncThunk(
  "product/update",
  async (
    { id, formData }: { id: string; formData: FormData },
    { rejectWithValue },
  ) => {
    try {
      const res = await Fetch({
        endpoint: `/admin/product/${id}`,
        method: "PATCH",
        body: formData,
      });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message || "Update product failed",
      );
    }
  },
);

export const deleteProduct = createAsyncThunk(
  "product/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await Fetch({
        endpoint: `/admin/product/${id}`,
        method: "DELETE",
      });
      return res?.data;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message || "Delete product failed",
      );
    }
  },
);

export const deleteProductImage = createAsyncThunk(
  "product/deleteImage",
  async (id: string, { rejectWithValue }) => {
    try {
      await Fetch({
        endpoint: `/admin/product/${id}/image`,
        method: "DELETE",
      });
      return id;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message || "Delete image failed",
      );
    }
  },
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    loading: false,
    createSuccess: false,
    updateSuccess: false,
    deleteSuccess: false,
    createError: null as any,
    fetchError: null as any,
    updateError: null as any,
    deleteError: null as any,
    products: [] as any[],
    vendorProducts: [] as any[],
  },

  reducers: {
    clearProductState: (state) => {
      state.createSuccess = false;
      state.updateSuccess = false;
      state.deleteSuccess = false;
      state.createError = null;
      state.fetchError = null;
      state.updateError = null;
      state.deleteError = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.createError = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.createSuccess = action.payload?.message;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.createError = action.payload;
      })

      .addCase(getProducts.pending, (state) => {
        state.loading = true;
        state.fetchError = null;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.loading = false;
        state.fetchError = action.payload;
      })

      .addCase(getVendorProducts.fulfilled, (state, action) => {
        state.vendorProducts = action.payload;
      })

      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.updateError = null;
        state.updateSuccess = false;
      })
      .addCase(updateProduct.fulfilled, (state) => {
        state.loading = false;
        state.updateSuccess = true;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.updateError = action.payload;
      })

      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.deleteSuccess = action.payload?.message;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.deleteError = action.payload;
      })

      .addCase(deleteProductImage.rejected, (state, action) => {
        state.deleteError = action.payload;
      });
  },
});

export const { clearProductState } = productSlice.actions;
export default productSlice.reducer;
