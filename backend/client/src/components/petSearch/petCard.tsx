import { useContext } from "react";
import { Link } from "react-router-dom";
import CartContext from "../../context/cartContext/cartContext";
import { multipleSpeciesStringConverter } from "../helpers";
import { Pet } from "../../types"; // <-- Import Pet from your types

export const PetCard = (pet: Pet) => {
  console.log(pet.image);
  const { cartItems, addToCart, removeFromCart } = useContext(CartContext);

  const isInCart = (p: Pet) => {
    return !!cartItems.find((item) => item._id === p._id);
  };

  return (
    <li
      key={pet._id}
      className="max-w-sm md:w-2/5 bg-white border border-gray-200 rounded-lg shadow"
    >
      <Link to={`/pet/${pet._id}`}>
        <img
          className="rounded-t-lg"
          src={`/uploads/${pet.image}`}
          alt={pet.species + " for adoption."}
        />
      </Link>

      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <Link to={`/pet/${pet._id}`}>
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
              {pet.name}
            </h5>
          </Link>

          {!isInCart(pet) ? (
            <button
              className="flex flex-col-reverse items-center justify-center mr-2 leading-snug text-gray-900 hover:no-underline"
              onClick={() => addToCart(pet)}
            >
              Add
              <svg
                aria-hidden="true"
                focusable="false"
                className="w-12 h-12 fill-slate-900 hover:scale-110 duration-300"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="50 100 600 400"
              >
                {/* SVG path omitted for brevity */}
              </svg>
            </button>
          ) : (
            <button
              className="flex flex-col-reverse items-center justify-center leading-snug text-gray-900 hover:no-underline"
              onClick={() => removeFromCart(pet)}
            >
              Remove
              <svg
                aria-hidden="true"
                focusable="false"
                className="w-12 h-12 fill-slate-900 hover:scale-110 duration-300"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="50 100 600 400"
              >
                {/* SVG path omitted for brevity */}
              </svg>
            </button>
          )}
        </div>

        {/* Gender & Age */}
        <div className="flex items-center justify-start mb-2">
          <span className="mr-3 text-lg font-bold text-gray-900">
            {pet.gender
              ? pet.gender.charAt(0).toUpperCase() + pet.gender.slice(1)
              : "Unknown Gender"}
          </span>
          <span className="text-lg text-gray-900">
            <span className="font-bold text-lg">Age: </span>
            {pet.age}
          </span>
        </div>

        {/* Adoption Fee */}
        <div className="flex items-center justify-between mb-1">
          <span className="text-md text-gray-900">
            <span className="font-bold">Adoption Fee: </span>${pet.fee}
          </span>
        </div>

        {/* Days on Site */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-900">
            <span className="font-medium"> Days on Site: </span>
            {Math.floor(
              (Date.now() - +new Date(pet.dateAddedToSite)) /
                (1000 * 60 * 60 * 24)
            )}
          </span>
        </div>

        <div className="flex items-center justify-start mb-2">
          <Link
            to={`/pets/?species=${pet.species}`}
            className="inline-flex items-center mr-3 px-3 py-2 text-sm font-medium text-center text-white bg-slate-500 rounded-lg hover:bg-slate-800"
          >
            {"More " + multipleSpeciesStringConverter(pet.species)}
          </Link>
          <Link
            to={`/pet/${pet._id}`}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-slate-700 rounded-lg hover:bg-slate-900"
          >
            {"Meet " + pet.name}
          </Link>
        </div>
      </div>
    </li>
  );
};
