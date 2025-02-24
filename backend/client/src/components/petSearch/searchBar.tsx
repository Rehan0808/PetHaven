import { Form, useSearchParams } from "react-router-dom";

interface SearchBarProps {
  speciesQuery: React.MouseEventHandler<HTMLButtonElement>;
  sortQuery: React.MouseEventHandler<HTMLButtonElement>;
  clearQuery: React.MouseEventHandler<HTMLButtonElement>;
  addPetHandler: React.MouseEventHandler<HTMLButtonElement>; // required prop
}

export const SearchBar = ({
  speciesQuery,
  sortQuery,
  clearQuery,
  addPetHandler,
}: SearchBarProps) => {
  const [searchParams] = useSearchParams();

  // Helper to style the buttons when active
  const styleByQuery = (elementName: string, elementId: string) => {
    return searchParams.getAll(elementName).includes(elementId);
  };

  return (
    <Form id="search-form" role="search">
      {/* Species Filter */}
      <fieldset>
        <div className="flex flex-col">
          <div className="text-center items-center px-2 py-2 text-lg lg:text-2xl font-medium text-gray-900">
            Show Me:
          </div>
          <div
            className="flex flex-row flex-wrap gap-x-1 gap-y-2 content-center justify-center"
            role="group"
          >
            {/* Cats */}
            <button
              id="cat"
              onClick={speciesQuery}
              name="species"
              type="button"
              className={`inline-flex w-2/5 h-12 min-w-min lg:m-2 lg:w-1/6 items-center justify-center px-0 py-0 text-sm font-medium rounded-lg text-gray-900 border border-gray-200 hover:bg-slate-400 
              ${
                styleByQuery("species", "cat")
                  ? "bg-slate-700 text-white hover:bg-slate-600"
                  : "bg-slate-100 text-black hover:bg-slate-200"
              }`}
            >
              Cats
            </button>
            {/* Dogs */}
            <button
              id="dog"
              onClick={speciesQuery}
              name="species"
              type="button"
              className={`inline-flex w-2/5 h-12 min-w-min lg:m-2 lg:w-1/6 items-center justify-center px-0 py-0 text-sm font-medium rounded-lg text-gray-900 border border-gray-200 hover:bg-slate-400 
              ${
                styleByQuery("species", "dog")
                  ? "bg-slate-700 text-white hover:bg-slate-600"
                  : "bg-slate-100 text-black hover:bg-slate-200"
              }`}
            >
              Dogs
            </button>
            {/* Bunnies */}
            <button
              id="bunny"
              onClick={speciesQuery}
              name="species"
              type="button"
              className={`inline-flex w-2/5 h-12 min-w-min lg:m-2 lg:w-1/6 items-center justify-center px-0 py-0 text-sm font-medium rounded-lg text-gray-900 border border-gray-200 hover:bg-slate-400 
              ${
                styleByQuery("species", "bunny")
                  ? "bg-slate-700 text-white hover:bg-slate-600"
                  : "bg-slate-100 text-black hover:bg-slate-200"
              }`}
            >
              Bunnies
            </button>
            {/* Chickens */}
            <button
              id="chicken"
              onClick={speciesQuery}
              name="species"
              type="button"
              className={`inline-flex w-2/5 h-12 min-w-min lg:m-2 lg:w-1/6 items-center justify-center px-0 py-0 text-sm font-medium rounded-lg text-gray-900 border border-gray-200 hover:bg-slate-400 
              ${
                styleByQuery("species", "chicken")
                  ? "bg-slate-700 text-white hover:bg-slate-600"
                  : "bg-slate-100 text-black hover:bg-slate-200"
              }`}
            >
              Chickens
            </button>
            {/* Rats */}
            <button
              id="rat"
              onClick={speciesQuery}
              name="species"
              type="button"
              className={`inline-flex w-2/5 h-12 min-w-min lg:m-2 lg:w-1/6 items-center justify-center px-0 py-0 text-sm font-medium rounded-lg text-gray-900 border border-gray-200 hover:bg-slate-400 
              ${
                styleByQuery("species", "rat")
                  ? "bg-slate-700 text-white hover:bg-slate-600"
                  : "bg-slate-100 text-black hover:bg-slate-200"
              }`}
            >
              Rats
            </button>
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
            <button
              onClick={sortQuery}
              type="button"
              id="age"
              name="sort"
              value="age"
              className={`px-4 py-0 w-34 h-10 text-sm font-medium rounded-l-lg border-l border-t border-b text-gray-900 border border-gray-200  
              ${
                styleByQuery("sort", "age")
                  ? "bg-slate-700 text-white hover:bg-slate-600"
                  : "bg-slate-100 text-black hover:bg-slate-200"
              }`}
            >
              Age
            </button>
            <button
              onClick={sortQuery}
              type="button"
              id="fee"
              name="sort"
              value="fee"
              className={`px-4 py-0 w-34 h-10 text-sm font-medium border-r border-t border-b text-gray-900 border border-gray-200  
              ${
                styleByQuery("sort", "fee")
                  ? "bg-slate-700 text-white hover:bg-slate-600"
                  : "bg-slate-100 text-black hover:bg-slate-200"
              }`}
            >
              Fee
            </button>
            <button
              onClick={sortQuery}
              type="button"
              id="dateAddedToSite"
              name="sort"
              value="days"
              className={`px-4 py-0 w-34 h-10 text-sm font-medium rounded-r-lg border-r border-t border-b text-gray-900 border border-gray-200  
                ${
                  styleByQuery("sort", "dateAddedToSite")
                    ? "bg-slate-700 text-white hover:bg-slate-600"
                    : "bg-slate-100 text-black hover:bg-slate-200"
                }`}
            >
              Days on Site
            </button>
          </div>
        </div>
      </fieldset>

      {/* Action Buttons */}
      <div className="flex gap-2 justify-center">
        <button
          onClick={clearQuery}
          type="submit"
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
