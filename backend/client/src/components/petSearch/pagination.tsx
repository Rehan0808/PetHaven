import { useSearchParams } from "react-router-dom";

interface PaginationProps {
  pageList: string[];
  paginationQuery: (e: React.MouseEvent<HTMLButtonElement>) => void;
  previous: string;
  next: string;
}

export const Pagination: React.FC<PaginationProps> = ({ pageList, paginationQuery, previous, next }) => {
  const [searchParams] = useSearchParams();
  const currentPage = searchParams.get("page") || "1";

  return (
    <nav aria-label="Page navigation" className="mx-auto content-center">
      <ul className="inline-flex -space-x-px">
        {currentPage !== "1" && (
          <li key="first">
            <button
              name="page"
              id={previous}
              onClick={paginationQuery}
              className="px-3 py-2 ml-0 leading-tight text-gray-500 bg-slate-100 text-black hover:bg-slate-200 border border-gray-300 rounded-l-lg hover:text-gray-700"
            >
              <span className="sr-only">Previous</span>
              <svg
                aria-hidden="true"
                className="hidden sm:block w-5 sm:h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span className="sm:hidden">Back</span>
            </button>
          </li>
        )}
        {pageList.map((page) => (
          <li key={page}>
            <button
              name="page"
              id={page}
              aria-current="page"
              onClick={paginationQuery}
              className={`hidden sm:inline-flex px-3 py-2 leading-tight border border-gray-300 ${
                currentPage === page ? "bg-slate-500 text-white" : "bg-slate-100 text-black hover:bg-slate-200"
              }`}
            >
              {page}
            </button>
          </li>
        ))}
        {currentPage !== pageList.length.toString() && (
          <li key="last">
            <button
              onClick={paginationQuery}
              name="page"
              id={next}
              className="px-3 py-2 ml-0 leading-tight text-gray-500 bg-slate-100 text-black hover:bg-slate-200 border border-gray-300 rounded-r-lg hover:text-gray-700"
            >
              <span className="sr-only">Next</span>
              <svg
                aria-hidden="true"
                className="hidden sm:block w-5 sm:h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span className="sm:hidden">Next</span>
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};
