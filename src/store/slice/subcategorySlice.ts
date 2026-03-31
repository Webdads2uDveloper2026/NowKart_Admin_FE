import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Fetch } from "../../api/axios";

export const createSubcategory = createAsyncThunk(
  "subcategory/create",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const res = await Fetch({
        endpoint: "/admin/subcategory",
        method: "POST",
        body: formData,
      });
      return res?.data?.subcategory;
    } catch (err: any) {
      return rejectWithValue(err.message || "Error");
    }
  },
);

export const getSubcategories = createAsyncThunk(
  "subcategory/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await Fetch({
        endpoint: "/admin/subcategory",
        method: "GET",
      });
      return res?.data;
    } catch (err: any) {
      return rejectWithValue(err.message || "Error");
    }
  },
);

export const deleteSubcategory = createAsyncThunk(
  "subcategory/delete",
  async (slug: string, { rejectWithValue }) => {
    try {
      await Fetch({
        endpoint: `/admin/subcategory/${slug}`,
        method: "DELETE",
      });
      return slug;
    } catch (err: any) {
      return rejectWithValue(err.message || "Error");
    }
  },
);

export const updateSubcategory = createAsyncThunk(
  "subcategory/update",
  async (
    { slug, formData }: { slug: string; formData: FormData },
    { rejectWithValue },
  ) => {
    try {
      const res = await Fetch({
        endpoint: `/admin/subcategory/${slug}`,
        method: "PATCH",
        body: formData,
      });
      return res.data?.subcategory;
    } catch (err: any) {
      return rejectWithValue(err.message || "Error");
    }
  },
);

const subcategorySlice = createSlice({
  name: "subcategory",
  initialState: {
    loading: false,
    error: null as any,
    success: false,
    deleteMessage: null as any,
    deleteError: null as any,
    subcategories: [] as any[],
  },
  reducers: {
    clearSubcategoryState: (state) => {
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createSubcategory.pending, (state) => {
        state.loading = true;
        state.success = false;
      })
      .addCase(createSubcategory.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(createSubcategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getSubcategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSubcategories.fulfilled, (state, action) => {
        state.loading = false;
        state.subcategories = action.payload;
      })
      .addCase(getSubcategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteSubcategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteSubcategory.fulfilled, (state) => {
        state.loading = false;
        state.deleteMessage = "Subcategory Deleted";
      })
      .addCase(deleteSubcategory.rejected, (state, action) => {
        state.loading = false;
        state.deleteError = action.payload;
      })

      .addCase(updateSubcategory.pending, (state) => {
        state.loading = true;
        state.success = false;
      })
      .addCase(updateSubcategory.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(updateSubcategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSubcategoryState } = subcategorySlice.actions;
export default subcategorySlice.reducer;
