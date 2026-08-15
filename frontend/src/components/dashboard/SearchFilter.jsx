function SearchFilter({
  searchText,
  setSearchText,
  statusFilter,
  setStatusFilter,
}) {
  return (
    <div className="search-filter-card">
      <div className="search-filter-row">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchText}
          onChange={(e) =>
            setSearchText(e.target.value)
          }
          className="search-input"
        />

        <button
          type="button"
          className={
            statusFilter === "all"
              ? "filter-btn active-all"
              : "filter-btn"
          }
          onClick={() =>
            setStatusFilter("all")
          }
        >
          All
        </button>

        <button
          type="button"
          className={
            statusFilter === "pending"
              ? "filter-btn active-pending"
              : "filter-btn"
          }
          onClick={() =>
            setStatusFilter("pending")
          }
        >
          Pending
        </button>

        <button
          type="button"
          className={
            statusFilter === "completed"
              ? "filter-btn active-completed"
              : "filter-btn"
          }
          onClick={() =>
            setStatusFilter("completed")
          }
        >
          Completed
        </button>
      </div>
    </div>
  );
}

export default SearchFilter;