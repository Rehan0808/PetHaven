import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import CartContext from "../../context/cartContext/cartContext";
import { multipleSpeciesStringConverter } from "../helpers";
import { Pet } from "../../types";
import useAuth from "../../context/userContext/useAuth";

interface PetCardProps {
  pet: Pet;
  onDelete: (id: string) => void; // Parent callback for deletion
  onEdit: (pet: Pet) => void;     // For editing
}

export const PetCard = ({ pet, onDelete, onEdit }: PetCardProps) => {
  const { cartItems, addToCart, removeFromCart } = useContext(CartContext);
  const { user } = useAuth(); 
  // "user" is truthy if logged in, otherwise undefined/null

  // Check if the pet is in the cart
  const isInCart = (p: Pet) => cartItems.some((item) => item.id === p.id);

  // Only show the Delete button if user is logged in
  const canDelete = !!user;

  // "Are you sure?" confirm for Delete
  const [showConfirm, setShowConfirm] = useState(false);
  const handleDeleteClick = () => {
    if (!user) return; // just a safety check
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    setShowConfirm(false);
    const petId = pet.id?.toString();
    if (!petId) {
      console.error("Pet ID is undefined!");
      return;
    }
    onDelete(petId);
  };

  const cancelDelete = () => setShowConfirm(false);

  // Basket add/remove
  const handleCartClick = () => {
    // You can also block cart behind login if you want:
    // if (!user) { ... } else { ... }
    isInCart(pet) ? removeFromCart(pet) : addToCart(pet);
  };

  // Edit
  const handleEditClick = () => {
    // If you want to block editing behind login, you can do:
    // if (!user) { ... } else { onEdit(pet); }
    onEdit(pet);
  };

  // Calculate days on site
  const daysOnSite = pet.dateAddedToSite
    ? Math.floor(
        (Date.now() - new Date(pet.dateAddedToSite).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : "N/A";

  return (
    <li className="max-w-sm md:w-2/5 bg-white border border-gray-200 rounded-lg shadow">
      <div className="relative">
        {/* Pet Image / Link */}
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
          className="absolute top-2 right-2 flex flex-col items-center text-[#333333] bg-white rounded-full p-2 shadow hover:shadow-lg hover:scale-105 transition"
        >
          <svg
            aria-hidden="true"
            focusable="false"
            className="w-5 h-5"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 600 512"
          >
            <g fill="currentColor">
              <path d="m484.2 167.89h15.422l-88.594-88.594c-2.0781-2.0781-5.5781-2.0781-7.7656 0-1.4219 1.4219-1.6406 3.0625-1.6406 3.8281 0 0.875 0.21875 2.5156 1.6406 3.8281z" />
              <path d="m296.73 86.953c1.4219-1.4219 1.6406-3.0625 1.6406-3.8281 0-0.875-0.21875-2.5156-1.6406-3.8281-2.0781-2.0781-5.5781-2.0781-7.7656 0l-88.594 88.594h15.422z" />
              <path d="m564.7 189.77h-429.41c-18.047 0-32.812 14.766-32.812 32.812v4.9219c0 18.047 14.766 32.812 32.812 32.812h429.41c18.047 0 32.812-14.766 32.812-32.812v-4.9219c0-18.047-14.766-32.812-32.812-32.812z" />
              <path d="m350 422.73c39.812-16.297 53.703-43.422 49.656-63.438-2.5156-11.812-10.5-18.922-21.438-18.922-6.5625 0-14.438 2.9531-21.984 8.2031-3.8281 2.625-8.8594 2.625-12.578-0.10938-7.6562-5.4688-15.312-8.4219-22.094-8.4219-10.938 0-18.812 7.1094-21.219 19.141-4.0469 20.344 9.7344 47.688 49.656 63.547z" />
              <path d="m175.55 454.34c2.4062 15.969 16.297 28 32.484 28h284.05c16.188 0 30.078-12.031 32.484-28l25.375-172.16h-399.88zm103.36-99.422c4.375-22.312 21.219-36.641 42.656-36.641 9.4062 0 19.031 2.8438 28.547 8.4219 9.4062-5.3594 19.031-8.0938 28.219-8.0938 21.328 0 38.172 14.219 42.766 36.312v0.10938c6.0156 29.422-12.031 68.469-65.625 89.141-0.21875 0.10938-0.4375 0.10938-0.65625 0.21875-1.6406 0.54688-3.2812 0.76562-4.9219 0.76562s-3.1719-0.21875-4.9219-0.76562c-0.21875-0.10938-0.32812-0.10938-0.54688-0.21875-53.484-20.344-71.422-59.5-65.516-89.25z" />
            </g>
          </svg>
          <span className="text-xs font-medium">
            {isInCart(pet) ? "Remove" : "Add"}
          </span>
        </button>

        {/* Edit Icon (below the cart icon) */}
        <button
          onClick={handleEditClick}
          className="absolute top-16 right-2 flex flex-col items-center text-[#333333] bg-white rounded-full p-2 shadow hover:shadow-lg hover:scale-105 transition"
        >
          <svg
            aria-hidden="true"
            focusable="false"
            className="w-4 h-4 fill-current"
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
          <span className="mr-3 text-lg font-bold text-[#333333]">
            {pet.gender
              ? pet.gender.charAt(0).toUpperCase() + pet.gender.slice(1)
              : "Unknown"}
          </span>
          <span className="text-lg text-[#333333]">
            <span className="font-bold">Age: </span>
            {pet.age ?? "Unknown"}
          </span>
        </div>

        {/* Adoption Fee */}
        <div className="flex items-center justify-between mb-1">
          <span className="text-md text-[#333333]">
            <span className="font-bold">Adoption Fee: </span>${pet.fee ?? "N/A"}
          </span>
        </div>

        {/* Days on Site */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-[#333333]">
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
            className="inline-flex items-center mr-3 px-3 py-2 text-sm font-medium text-white bg-[#E67E22] rounded-lg hover:bg-[#cf6e1d]"
          >
            {"More " + multipleSpeciesStringConverter(pet.species)}
          </Link>

          {/* Show Delete only if user is logged in */}
          {canDelete && !showConfirm && (
            <button
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-[#E67E22] rounded-lg hover:bg-[#cf6e1d]"
              onClick={handleDeleteClick}
            >
              Delete
            </button>
          )}

          {/* "Are you sure?" confirm prompt */}
          {canDelete && showConfirm && (
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-[#333333]">
                Are you sure?
              </span>
              <button
                className="px-3 py-2 text-sm font-medium text-white bg-[#2C3E50] rounded-lg hover:bg-[#34495e]"
                onClick={confirmDelete}
              >
                Yes
              </button>
              <button
                className="px-3 py-2 text-sm font-medium text-white bg-[#E67E22] rounded-lg hover:bg-[#cf6e1d]"
                onClick={cancelDelete}
              >
                No
              </button>
            </div>
          )}
        </div>
      </div>
    </li>
  );
};
