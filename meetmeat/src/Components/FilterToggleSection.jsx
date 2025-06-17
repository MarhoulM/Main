import React, { useState } from "react";
import FilterSortControls from "./FilterSortControls";
import "./FilterToggleSection.css";

const FilterToggleSection = ({
  queryParams,
  onCategoryChange,
  onMinPriceChange,
  onMaxPriceChange,
  onOrderByChange,
  onClearFilters,
}) => {
  const [showFilters, setShowFilters] = useState(false);

  const toggleFilters = () => {
    setShowFilters((prev) => !prev);
  };

  return (
    <div className="filter-toggle-section-container">
      <button onClick={toggleFilters} className="filter-toggle-button">
        {showFilters ? "Skrýt filtry" : "Zobrazit filtry a řazení"}
      </button>
      {showFilters && (
        <FilterSortControls
          queryParams={queryParams}
          onCategoryChange={onCategoryChange}
          onMinPriceChange={onMinPriceChange}
          onMaxPriceChange={onMaxPriceChange}
          onOrderByChange={onOrderByChange}
          onClearFilters={onClearFilters}
        />
      )}
    </div>
  );
};

export default FilterToggleSection;
