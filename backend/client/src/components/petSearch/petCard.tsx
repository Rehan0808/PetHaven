import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CartContext from "../../context/cartContext/cartContext";
import { multipleSpeciesStringConverter } from "../helpers";
import { Pet } from "../../types";
import useAuth from "../../context/userContext/useAuth";

interface PetCardProps {
  pet: Pet;
  onDelete: (id: string) => void; // Parent callback for deletion
  onEdit: (pet: Pet) => void;     // For edit
}

export const PetCard = ({ pet, onDelete, onEdit }: PetCardProps) => {
  const { cartItems, addToCart, removeFromCart } = useContext(CartContext);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Check if the pet is in the cart
  const isInCart = (p: Pet) => cartItems.some((item) => item.id === p.id);

  // "Are you sure?" for Delete
  const [showConfirm, setShowConfirm] = useState(false);
  const handleDeleteClick = () => {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    setShowConfirm(false);
    // Use pet.id instead of pet._id
    const petId = pet.id?.toString();
    if (!petId) {
      console.error("Pet ID is undefined!");
      return;
    }
    onDelete(petId);
  };

  const cancelDelete = () => setShowConfirm(false);

  // Login prompt modal
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Toggle cart
  const handleCartClick = () => {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    isInCart(pet) ? removeFromCart(pet) : addToCart(pet);
  };

  // Edit click
  const handleEditClick = () => {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    // Call parent's onEdit to open EditPetModal
    onEdit(pet);
  };

  return (
    <li className="max-w-sm md:w-2/5 bg-white border border-gray-200 rounded-lg shadow">
      <div className="relative">
        {/* Use pet.id instead of pet._id */}
        <Link to={`/pet/${pet.id}`}>

          <img
            className="rounded-t-lg"
            src={pet.image ? `/uploads/${pet.image}` : "/default-image.png"}

            alt={`${pet.species} for adoption`}

            loading="lazy"
          />
        </Link>

        {/* Basket Icon (top-right) */}
        <button
          onClick={handleCartClick}
          className="absolute top-2 right-2 flex flex-col items-center text-gray-900 bg-white rounded-full p-2 shadow hover:shadow-lg hover:scale-105 transition"
        >
          <svg
            aria-hidden="true"
            focusable="false"
            className="w-6 h-6 fill-current"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="50 100 600 400"
          >
            <g fill="currentColor">
              {/* Paths omitted for brevity */}
            </g>
          </svg>
          <span className="text-xs font-medium">
            {isInCart(pet) ? "Remove" : "Add"}
          </span>
        </button>

        {/* Edit Icon (below the cart icon) */}
        <button
          onClick={handleEditClick}
          className="absolute top-16 right-2 flex flex-col items-center text-gray-900 bg-white rounded-full p-2 shadow hover:shadow-lg hover:scale-105 transition"
        >
          <svg
            aria-hidden="true"
            focusable="false"
            className="w-5 h-5 fill-current"
            role="img"
            viewBox="0 0 512 512"
          >
            <path d="M290.74 93.24l128 128L119.31 520.69l-128-128zM508.81 75.29l-72.38-72.38c-12.28-12.28-32.19-12.28-44.47 0L356.12 38.75l128 128 35.84-35.84c12.28-12.28 12.28-32.19-.15-44.62z" />
          </svg>
          <span className="text-xs font-medium">Edit</span>
        </button>
      </div>

      <div className="p-3">
        {/* Gender & Age */}
        <div className="flex items-center justify-start mb-2">
          <span className="mr-3 text-lg font-bold text-gray-900">
            {pet.gender
              ? pet.gender.charAt(0).toUpperCase() + pet.gender.slice(1)
              : "Unknown"}
          </span>
          <span className="text-lg text-gray-900">
            <span className="font-bold">Age: </span>
            {pet.age ?? "Unknown"}
          </span>
        </div>

        {/* Adoption Fee */}
        <div className="flex items-center justify-between mb-1">
          <span className="text-md text-gray-900">
            <span className="font-bold">Adoption Fee: </span>${pet.fee ?? "N/A"}
          </span>
        </div>

        {/* Days on Site */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-900">
            <span className="font-medium">Days on Site: </span>
            {Math.floor(
              (Date.now() - new Date(pet.dateAddedToSite).getTime()) /
                (1000 * 60 * 60 * 24)
            )}
          </span>
        </div>

        {/* More & Delete */}
        <div className="flex items-center justify-start mb-2">
        <Link
  to={`/pets/?species=${pet.species}`}
  className="inline-flex items-center mr-3 px-3 py-2 text-sm font-medium text-white bg-slate-500 rounded-lg hover:bg-slate-800"
>
  {"More " + multipleSpeciesStringConverter(pet.species)}
</Link>


          {/* Delete Button + "Are you sure?" */}
          {!showConfirm && (
            <button
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-800"
              onClick={handleDeleteClick}
            >
              Delete
            </button>
          )}
          {showConfirm && (
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-800">Are you sure?</span>
              <button
                className="px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-800"
                onClick={confirmDelete}
              >
                Yes
              </button>
              <button
                className="px-3 py-2 text-sm font-medium text-white bg-gray-400 rounded-lg hover:bg-gray-600"
                onClick={cancelDelete}
              >
                No
              </button>
            </div>
          )}
        </div>
      </div>

      {/* If user not logged in, show "Please login" modal */}
      {showLoginPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md max-w-sm mx-auto text-center">
            <h2 className="text-xl font-bold mb-4">Please Login or Register</h2>
            <p className="mb-4">You must be logged in to perform this action.</p>
            <div className="flex justify-center space-x-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setShowLoginPrompt(false)}
              >
                Close
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => {
                  setShowLoginPrompt(false);
                  navigate("/users/login");
                }}
              >
                Login
              </button>
            </div>
          </div>
        </div>
      )}
    </li>
  );
};