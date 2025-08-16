import "./FilterControl.css";

const FilterControl = ({
  queryParams,
  onCategoryChange,
  onGenreChange,
  onAvailabilityChange,
  onClearFilters,
}) => {
  return (
    <>
      <div className="filter-container">
        <div className="filter-group">
          <label htmlFor="category">Kategorie:</label>
          <select
            id="category"
            value={queryParams.category}
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            <option value="">Všechny</option>
            <option value="Kniha">Kniha</option>
            <option value="CD">CD</option>
            <option value="DVD">DVD</option>
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="genre">Žánr:</label>
          <select
            id="genre"
            value={queryParams.genre}
            onChange={(e) => onGenreChange(e.target.value)}
          >
            <option value="">Všechny</option>
            <option value="Komedie">Komedie</option>
            <option value="Drama">Drama</option>
            <option value="Krimi">Krimi</option>
            <option value="Thriller">Thriller</option>
            <option value="Mysteriózní">Mysteriózní</option>
            <option value="Fantasy">Fantasy</option>
            <option value="Horor">Horor</option>
            <option value="Historický">Historický</option>
            <option value="Dobrodružný">Dobrodružný</option>
            <option value="Psychologický">Psychologický</option>
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="availability">Dostupnost:</label>
          <select
            id="availability"
            value={queryParams.availability}
            onChange={(e) => onAvailabilityChange(e.target.value)}
          >
            <option value="">Všechny</option>
            <option value="Zapůjčené">Zapůjčené</option>
            <option value="Dostupné">Dostupné</option>
          </select>
        </div>
        <button onClick={onClearFilters} className="clear-filters-button">
          Vyčistit filtry
        </button>
      </div>
    </>
  );
};

export default FilterControl;
