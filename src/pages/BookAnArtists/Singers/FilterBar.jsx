import React, { useState, useEffect } from "react";

const FilterBar = ({ onSearch, searchTerm }) => {
  const [search, setSearch] = useState(searchTerm || "");

  useEffect(() => {
    setSearch(searchTerm || "");
  }, [searchTerm]);

  const handleSearchChange = (value) => {
    setSearch(value);
    onSearch(value);
  };

  return (
    <div className="mb-10">
      {/* Search */}
      <input
        type="text"
        placeholder="Search singer..."
        value={search}
        onChange={(e) => handleSearchChange(e.target.value)}
        className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  );
};

export default FilterBar;