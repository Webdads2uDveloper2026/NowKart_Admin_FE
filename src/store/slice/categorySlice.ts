import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;

// CREATE
export const createCategory = createAsyncThunk(
  "category/create",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(`${BASE_URL}/admin/catgeory`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.data.category;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Error");
    }
  }
);

// GET 
export const getCategories = createAsyncThunk(
  "category/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(
        `${BASE_URL}/admin/catgeory`
      );

      return res.data.data;

    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Error");
    }
  }
);

// DELETE
export const deleteCategory = createAsyncThunk(
  "category/delete",
  async (slug: string, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.delete(
        `${BASE_URL}/admin/catgeory/${slug}`
      );

      return slug; // return deleted slug
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Error");
    }
  }
);

// updated
export const updateCategory = createAsyncThunk(
  "category/update",
  async (
    { slug, formData }: { slug: string; formData: FormData },
    { rejectWithValue }
  ) => {
    try {
      const res = await axiosInstance.patch(
        `${BASE_URL}/admin/catgeory/${slug}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      return res.data.data.category;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Error");
    }
  }
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
      // CREATE
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

      // GET
      .addCase(getCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


      // DELETE

      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false;

        // remove deleted item from state
        state.categories = state.categories.filter(
          (item: any) => item.categoryName.slug !== action.payload
        );
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE

      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
        state.success = false;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
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