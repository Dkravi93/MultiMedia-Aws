import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch media
export const fetchMedia = createAsyncThunk("media/fetchMedia", async () => {
  const { data } = await axios.get("http://localhost:5000/api/media");
  return data;
});

// Delete media
export const deleteMedia = createAsyncThunk("media/deleteMedia", async (key, { rejectWithValue }) => {
  try {
    await axios.delete(`http://localhost:5000/api/media/${encodeURIComponent(key)}`);
    alert(`Filename: ${key} deleted successfully`);
    return key;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const mediaSlice = createSlice({
  name: "media",
  initialState: {
    media: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMedia.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMedia.fulfilled, (state, action) => {
        state.loading = false;
        state.media = action.payload;
      })
      .addCase(fetchMedia.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteMedia.fulfilled, (state, action) => {
        state.media = state.media.filter((item) => item.key !== action.payload);
      });
  },
});

export default mediaSlice.reducer;
