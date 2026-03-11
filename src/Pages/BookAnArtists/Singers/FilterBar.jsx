import React from "react";

const FilterBar = ({ activeFilter, onFilterChange, onSearch, searchTerm, totalResults }) => {

  const filters = ["All", "Bollywood", "Classical", "Pop", "Rock", "Sufi", "Qawwali"];

  return (
    <div className="mb-10">

      {/* Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">

        <input
          type="text"
          placeholder="Search singer..."
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
          className="flex-1 border px-4 py-2 rounded-lg"
        />

        <p className="flex items-center text-sm text-gray-600">
          {totalResults} singer{totalResults !== 1 ? "s" : ""} found
        </p>

      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">

        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => onFilterChange(filter)}
            className={`px-4 py-2 rounded-lg border transition
              ${activeFilter === filter
                ? "bg-blue-500 text-white"
                : "bg-white hover:bg-gray-100"
              }`}
          >
            {filter}
          </button>
        ))}

      </div>

    </div>
  );
};

export default FilterBar;