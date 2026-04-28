import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Fetch } from "../../api/axios";

export const createCategory = createAsyncThunk(
  "category/create",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const res = await Fetch({
        endpoint: "/admin/category",
        method: "POST",
        body: formData,
      });
      return res.data.category;
    } catch (err: any) {
      return rejectWithValue(err.message || "Error");
    }
  },
);

export const getCategories = createAsyncThunk(
  "category/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await Fetch({
        endpoint: "/admin/category",
        method: "GET",
      });
      return res?.data;
    } catch (err: any) {
      return rejectWithValue(err.message || "Error");
    }
  },
);

export const deleteCategory = createAsyncThunk(
  "category/delete",
  async (slug: string, { rejectWithValue }) => {
    try {
      await Fetch({
        endpoint: `/admin/category/${slug}`,
        method: "DELETE",
      });
      return slug;
    } catch (err: any) {
      return rejectWithValue(err.message || "Error");
    }
  },
);

export const updateCategory = createAsyncThunk(
  "category/update",
  async (
    { slug, formData }: { slug: string; formData: FormData },
    { rejectWithValue },
  ) => {
    try {
      const res = await Fetch({
        endpoint: `/admin/category/${slug}`,
        method: "PATCH",
        body: formData,
      });
      return res.data.category;
    } catch (err: any) {
      return rejectWithValue(err.message || "Error");
    }
  },
);

const categorySlice = createSlice({
  name: "category",
  initialState: {
    loading: false,
    error: null as any,
    success: false,
    categories: [] as any[],
  },
  reducers: {
    clearCategoryState: (state) => {
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
        state.success = false;
      })
      .addCase(createCategory.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload?.categoriesWithProductCount;
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteCategory.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
        state.success = false;
      })
      .addCase(updateCategory.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCategoryState } = categorySlice.actions;
export default categorySlice.reducer;
