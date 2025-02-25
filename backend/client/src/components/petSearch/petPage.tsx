import { useState, useContext } from "react";
import { useLoaderData } from "react-router-dom";
import CartContext from "../../context/cartContext/cartContext";
import { multipleSpeciesStringConverter } from "../helpers";
import { Pet } from "../../types";

// If you have a Pet interface:
// interface Pet {
//   _id: string;
//   name: string;
//   species: string;
//   fee: number;
//   image?: string;
//   gender: string;
//   age: number;
//   dateAddedToSite: string;
//   description: string;
//   town?: string;
//   zip?: string;
// }

export const PetPage = () => {
  // The loader returns a Pet
  const pet = useLoaderData() as Pet;

  const [showAdoption, setShowAdoption] = useState(false);
  const [showContact, setShowContact] = useState(false);

  const { addToCart, cartItems, removeFromCart } = useContext(CartContext);

  const isInCart = (p: Pet) => cartItems.some((item) => item._id === p._id);

  return (
    <div className="md:flex items-start justify-center py-12 2xl:px-20 md:px-6 px-4">
      <div className="xl:w-2/6 lg:w-2/5 w-80 md:block hidden">
        <img
          className="w-full rounded-lg"
          src={`/uploads/${pet.image}`}
          alt={pet.species + " for adoption."}
        />
      </div>
      <div className="md:hidden">
        <img
          className="w-full"
          src={`/uploads/${pet.image}`}
          alt={pet.species + " for adoption."}
        />
      </div>

      <div className="xl:w-2/5 md:w-1/2 lg:ml-8 md:ml-6 md:mt-0 mt-6">
        <div className="border-b border-gray-200 pb-6">
          <p className="text-sm leading-none text-gray-600">
            {multipleSpeciesStringConverter(pet.species)}
          </p>
          <h1 className="lg:text-2xl text-xl font-semibold lg:leading-6 leading-7 text-gray-800 mt-2">
            {pet.name}
          </h1>
        </div>
        <div className="py-4 border-b border-gray-200 flex items-center justify-between">
          <p className="text-base leading-4 text-gray-800">Age: {pet.age}</p>
        </div>
        <div className="py-4 border-b border-gray-200 flex items-center justify-between">
          <p className="text-base leading-4 text-gray-800">
            {pet.gender
              ? pet.gender.charAt(0).toUpperCase() + pet.gender.slice(1)
              : "Unknown Gender"}
          </p>
        </div>
        {!isInCart(pet) ? (
          <button
            onClick={() => addToCart(pet)}
            className="
              text-base
              flex
              rounded-lg
              items-center
              justify-center
              leading-none
              text-white
              bg-slate-700
              w-full
              py-4
              hover:bg-gray-900
            "
          >
            Add {pet.name} to Basket
          </button>
        ) : (
          <button
            onClick={() => removeFromCart(pet)}
            className="
              text-base
              flex
              rounded-lg
              items-center
              justify-center
              leading-none
              text-white
              bg-slate-700
              w-full
              py-4
              hover:bg-gray-900
            "
          >
            Remove {pet.name} from Basket
          </button>
        )}

        <div>
          <p className="xl:pr-48 text-base lg:leading-tight leading-normal text-gray-600 my-5">
            {pet.description}
          </p>
          <p className="text-base leading-4 mt-7 text-gray-600">
            <span className="font-semibold">Adoption Fee:</span> ${pet.fee}
          </p>
          <p className="text-base md:w-96 leading-4 mt-4 text-gray-600">
            <span className="font-semibold">Location:</span> {pet.town} {pet.zip}
          </p>
          <p className="text-base leading-4 mt-4 text-gray-600">
            <span className="font-semibold">Days on petConnect: </span>
            {Math.floor(
              (Date.now() - +new Date(pet.dateAddedToSite)) / (1000 * 60 * 60 * 24)
            )}
          </p>
        </div>
      </div>
    </div>
  );
};
