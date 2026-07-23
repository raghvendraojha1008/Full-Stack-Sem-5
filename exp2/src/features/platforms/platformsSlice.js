import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchPlatformsFromServer } from "../../api/mockApi";

export const fetchPlatforms = createAsyncThunk(
  "platforms/fetchPlatforms",
  async () => {
    const platforms = await fetchPlatformsFromServer();
    return platforms;
  }
);

const platformsSlice = createSlice({
  name: "platforms",
  initialState: {
    list: [],
    loading: "idle",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlatforms.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchPlatforms.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchPlatforms.rejected, (state) => {
        state.loading = "failed";
      });
  },
});

export default platformsSlice.reducer;

export const selectAllPlatforms = (state) => state.platforms.list;
