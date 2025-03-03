// src/components/petSearch/searchBar.tsx

import { Form } from "react-router-dom";
import { SearchBarProps } from "../../types"; // Adjust import path as needed

const SPECIES_OPTIONS = ["cat", "dog", "bunny", "chicken", "rat"];
const SORT_OPTIONS = [
  { key: "age", label: "Age" },
  { key: "fee", label: "Fee" },
  { key: "dateAddedToSite", label: "Days on Site" },
];

export const SearchBar = ({
  speciesQuery,
  sortQuery,
  clearQuery,
  addPetHandler,
  updateSearchParams,
}: SearchBarProps) => {
  return (
    <Form id="search-form" role="search">
      {/* Species Filter */}
      <fieldset>
        <div className="flex flex-col">
          <div className="text-center px-2 py-2 text-lg lg:text-2xl font-medium text-gray-900">
            Show Me:
          </div>
          <div className="flex flex-wrap justify-center gap-x-1 gap-y-2">
            {SPECIES_OPTIONS.map((species) => {
              const isSelected = speciesQuery.includes(species);
              return (
                <button
                  key={species}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    // Tells the parent to toggle or update the species in the URL
                    updateSearchParams("species", species);
                  }}
                  className={`w-2/5 h-12 min-w-min lg:m-2 lg:w-1/6 px-0 py-0 text-sm font-medium rounded-lg border border-gray-200 hover:bg-slate-400
                    ${
                      isSelected
                        ? "bg-slate-700 text-white"
                        : "bg-slate-100 text-black"
                    }
                  `}
                >
                  {species.charAt(0).toUpperCase() + species.slice(1)}
                </button>
              );
            })}
          </div>
        </div>
      </fieldset>

      {/* Sort By */}
      <fieldset className="my-3 flex justify-center" role="group">
        <div className="inline-flex items-center px-2 py-3 text-lg lg:text-xl font-medium text-gray-900">
          Sort By:
        </div>
        <div className="inline-flex rounded-md shadow-sm">
          {SORT_OPTIONS.map(({ key, label }, index) => {
            const isSortSelected = sortQuery === key;
            return (
              <button
                key={key}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  updateSearchParams("sort", key);
                }}
                className={`px-4 py-0 w-34 h-10 text-sm font-medium border border-gray-200
                  ${index === 0 ? "rounded-l-lg" : ""}
                  ${
                    index === SORT_OPTIONS.length - 1
                      ? "rounded-r-lg"
                      : ""
                  }
                  ${
                    isSortSelected
                      ? "bg-slate-700 text-white"
                      : "bg-slate-100 text-black"
                  }
                `}
              >
                {label}
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Action Buttons */}
      <div className="flex gap-2 justify-center">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            clearQuery();
          }}
          className="px-4 py-2 w-34 h-10 text-sm font-medium border border-gray-200 rounded-lg bg-slate-100 text-black hover:bg-slate-200 active:bg-slate-700 active:text-white"
        >
          Clear Search
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            addPetHandler();
          }}
          className="px-4 py-2 w-34 h-10 text-sm font-medium border border-gray-200 rounded-lg bg-slate-100 text-black hover:bg-slate-200 active:bg-slate-700 active:text-white"
        >
          Add Pet
        </button>
      </div>
    </Form>
  );
};
