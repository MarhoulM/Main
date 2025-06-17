import React from "react";
import "./FilterSortControls.css";

const FilterSortControls = ({
  queryParams,
  onCategoryChange,
  onMinPriceChange,
  onMaxPriceChange,
  onOrderByChange,
  onClearFilters,
}) => {
  return (
    <div className="filter-sort-container">
      <h3>Filtry a řazení</h3>

      <div className="filter-group">
        <label htmlFor="category">Kategorie:</label>
        <select
          id="category"
          value={queryParams.category}
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          <option value="">Všechny</option>
          <option value="Hovězí">Hovězí</option>
          <option value="Vepřové">Vepřové</option>
          <option value="Kuřecí">Kuřecí</option>
          <option value="Mix">Mix</option>
          <option value="Zvěřina">Zvěřina</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="minPrice">Min. cena:</label>
        <input
          type="number"
          id="minPrice"
          value={queryParams.minPrice || ""}
          onChange={(e) =>
            onMinPriceChange(
              e.target.value === "" ? null : parseFloat(e.target.value)
            )
          }
          placeholder="Od"
        />
      </div>

      <div className="filter-group">
        <label htmlFor="maxPrice">Max. cena:</label>
        <input
          type="number"
          id="maxPrice"
          value={queryParams.maxPrice || ""}
          onChange={(e) =>
            onMaxPriceChange(
              e.target.value === "" ? null : parseFloat(e.target.value)
            )
          }
          placeholder="Do"
        />
      </div>

      <div className="filter-group">
        <label htmlFor="orderBy">Seřadit dle:</label>
        <select
          id="orderBy"
          value={queryParams.orderBy}
          onChange={(e) => onOrderByChange(e.target.value)}
        >
          <option value="id">Výchozí (ID)</option>
          <option value="name">Název (A-Z)</option>
          <option value="name_desc">Název (Z-A)</option>
          <option value="price">Cena (nejnižší)</option>
          <option value="price_desc">Cena (nejvyšší)</option>
          <option value="category">Kategorie</option>
        </select>
      </div>
      <button onClick={onClearFilters} className="clear-filters-button">
        Vyčistit filtry
      </button>
    </div>
  );
};

export default FilterSortControls;
