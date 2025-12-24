import React from "react";

const categories = ["Auto", "Code", "Research", "Creative", "Analysis", "Writing", "Data"];

export default function CategoryFilters({ activeCategory, onCategoryChange }) {
  return (
    <div className="px-4 md:px-6 py-3 md:py-4 border-t border-[#E2E8F0] bg-white overflow-x-auto">
      <div className="flex items-center gap-2 flex-nowrap md:flex-wrap min-w-max md:min-w-0">
        <span className="text-sm text-[#64748B] mr-1 md:mr-2 shrink-0">Filter:</span>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category === activeCategory ? null : category)}
            className={`px-3 md:px-4 py-1 md:py-1.5 text-xs md:text-sm font-medium rounded-full transition-colors whitespace-nowrap ${
              category === activeCategory
                ? "bg-[#2563EB] text-white shadow-sm"
                : "bg-[#F6F7FB] text-[#64748B] hover:bg-[#E2E8F0]"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}