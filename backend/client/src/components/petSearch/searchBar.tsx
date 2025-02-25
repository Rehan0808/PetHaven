import { Form, useSearchParams } from "react-router-dom";

interface SearchBarProps {
  speciesQuery: string;
  sortQuery: string;
  clearQuery: () => void;
  addPetHandler: () => void;
  updateSearchParams: (key: string, value: string) => void; // Ensure this is required
}

export const SearchBar = ({
  speciesQuery,
  sortQuery,
  clearQuery,
  addPetHandler,
  updateSearchParams,
}: SearchBarProps) => {
  const [searchParams] = useSearchParams();

  const styleByQuery = (elementName: string, elementId: string) => {
    return searchParams.getAll(elementName).includes(elementId);
  };

  return (
    <Form id="search-form" role="search">
      <fieldset>
        <div className="flex flex-col">
          <div className="text-center items-center px-2 py-2 text-lg lg:text-2xl font-medium text-gray-900">
            Show Me:
          </div>
          <div
            className="flex flex-row flex-wrap gap-x-1 gap-y-2 content-center justify-center"
            role="group"
          >
            {["cat", "dog", "bunny", "chicken", "rat"].map((species) => (
              <button
                key={species}
                id={species}
                onClick={() => updateSearchParams("species", species)}
                name="species"
                type="button"
                className={`inline-flex w-2/5 h-12 min-w-min lg:m-2 lg:w-1/6 items-center justify-center px-0 py-0 text-sm font-medium rounded-lg text-gray-900 border border-gray-200 hover:bg-slate-400 
              ${
                styleByQuery("species", species)
                  ? "bg-slate-700 text-white hover:bg-slate-600"
                  : "bg-slate-100 text-black hover:bg-slate-200"
              }`}
              >
                {species.charAt(0).toUpperCase() + species.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </fieldset>

      {/* Sort By */}
      <fieldset className="flex flex-row my-3 mx-auto" role="group">
        <div className="flex flex-row mx-auto">
          <div className="inline-flex h-10 items-center px-2 py-3 text-lg lg:text-xl font-medium text-gray-900">
            Sort By:
          </div>
          <div className="inline-flex rounded-md shadow-sm" role="group">
            {["age", "fee", "dateAddedToSite"].map((sortType) => (
              <button
                key={sortType}
                onClick={() => updateSearchParams("sort", sortType)}
                type="button"
                id={sortType}
                name="sort"
                className={`px-4 py-0 w-34 h-10 text-sm font-medium ${
                  sortType === "age" ? "rounded-l-lg border-l" : ""
                } ${
                  sortType === "dateAddedToSite" ? "rounded-r-lg border-r" : ""
                } border-t border-b text-gray-900 border border-gray-200  
                ${
                  styleByQuery("sort", sortType)
                    ? "bg-slate-700 text-white hover:bg-slate-600"
                    : "bg-slate-100 text-black hover:bg-slate-200"
                }`}
              >
                {sortType === "dateAddedToSite" ? "Days on Site" : sortType.charAt(0).toUpperCase() + sortType.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </fieldset>

      {/* Action Buttons */}
      <div className="flex gap-2 justify-center">
        <button
          onClick={clearQuery}
          type="button"
          className="flex my-0 mx-auto px-4 py-2 w-34 h-10 text-sm font-medium border border-gray-200 rounded-lg bg-slate-100 text-black hover:bg-slate-200 hover:text-black active:bg-slate-700 active:text-white"
        >
          Clear Search
        </button>
        <button
          onClick={addPetHandler}
          type="button"
          className="flex my-0 mx-auto px-4 py-2 w-34 h-10 text-sm font-medium border border-gray-200 rounded-lg bg-slate-100 text-black hover:bg-slate-200 hover:text-black active:bg-slate-700 active:text-white"
        >
          Add Pet
        </button>
      </div>
    </Form>
  );
};
