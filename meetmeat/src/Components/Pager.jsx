import React from "react";
import "./Pager.css";

const Pager = ({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
}) => {
  const pageNumbers = [];

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="pager-container">
      <div className="page-size-control">
        <label htmlFor="pageSize">Zobrazit:</label>
        <select
          id="pageSize"
          value={pageSize}
          onChange={(e) => onPageSizeChange(parseInt(e.target.value))}
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
        </select>
      </div>

      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="pager-button"
      >
        Předchozí
      </button>

      {pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={`pager-button ${
            number === currentPage ? "pager-button-active" : ""
          }`}
        >
          {number}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="pager-button"
      >
        Další
      </button>
    </div>
  );
};

export default Pager;
