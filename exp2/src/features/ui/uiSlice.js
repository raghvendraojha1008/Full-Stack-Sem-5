import { createSlice } from "@reduxjs/toolkit";

// Assignment / Theory section 4: Separation of UI state and data state.
// Things like "which filter is active" belong here, not mixed into the
// posts/platforms domain slices.
const uiSlice = createSlice({
  name: "ui",
  initialState: {
    platformFilter: "all", // 'all' | platformId
    showOnlyShort: false,
  },
  reducers: {
    setPlatformFilter: (state, action) => {
      state.platformFilter = action.payload;
    },
    toggleShowOnlyShort: (state) => {
      state.showOnlyShort = !state.showOnlyShort;
    },
  },
});

export const { setPlatformFilter, toggleShowOnlyShort } = uiSlice.actions;
export default uiSlice.reducer;

export const selectPlatformFilter = (state) => state.ui.platformFilter;
export const selectShowOnlyShort = (state) => state.ui.showOnlyShort;
