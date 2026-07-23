import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectAllPlatforms } from "../features/platforms/platformsSlice";
import {
  selectPlatformFilter,
  selectShowOnlyShort,
  setPlatformFilter,
  toggleShowOnlyShort,
} from "../features/ui/uiSlice";
import { selectPostCountByPlatform } from "../features/posts/postsSelectors";

export default function FilterBar() {
  const dispatch = useDispatch();
  const platforms = useSelector(selectAllPlatforms);
  const platformFilter = useSelector(selectPlatformFilter);
  const showOnlyShort = useSelector(selectShowOnlyShort);
  const countByPlatform = useSelector(selectPostCountByPlatform);

  return (
    <div className="filter-bar">
      <label>
        Platform:
        <select
          value={platformFilter}
          onChange={(e) => dispatch(setPlatformFilter(e.target.value))}
        >
          <option value="all">All platforms</option>
          {platforms.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({countByPlatform[p.id] ?? 0})
            </option>
          ))}
        </select>
      </label>
      <label className="checkbox-label">
        <input
          type="checkbox"
          checked={showOnlyShort}
          onChange={() => dispatch(toggleShowOnlyShort())}
        />
        Short posts only (&lt; 100 chars)
      </label>
    </div>
  );
}
