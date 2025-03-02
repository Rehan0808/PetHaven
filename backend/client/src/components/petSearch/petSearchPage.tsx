import queryString from "query-string";
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { SearchBar } from "./searchBar";
import { PetCard } from "./petCard";
import { Pagination } from "./pagination";
import AddPetModal from "./AddPetModal";
import EditPetModal from "./EditPetModal";
import { Pet } from "../../types";
import useAuth from "../../context/userContext/useAuth";

export const PetSearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [pets, setPets] = useState<{ pets: Pet[]; count: number } | null>(null);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [petToEdit, setPetToEdit] = useState<Pet | null>(null);

  // Show "Please Login" modal (no Register)
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Auth
  const { user } = useAuth();

  // Update URL query params
  const updateSearchParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set(key, value);
    setSearchParams(params);
  };

  // Fetch pets from backend
  useEffect(() => {
    const fetchPets = async () => {
      setLoading(true);
      try {
        const query = queryString.stringify(Object.fromEntries(searchParams));
        const response = await fetch(`http://localhost:8001/api/v1/pets?${query}`);
        if (!response.ok) throw new Error("Failed to fetch pets");

        const result = await response.json();
        if (result && typeof result === "object") {
          setPets({
            pets: Array.isArray(result.pets) ? result.pets : [],
            count: typeof result.count === "number" ? result.count : 0,
          });
        } else {
          setPets({ pets: [], count: 0 });
        }
      } catch (error) {
        console.error("Error fetching pets:", error);
        setPets({ pets: [], count: 0 });
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, [searchParams]);

  /**
   * Add Pet => if user not logged in, show "Please Login" modal
   */
  const handleAddPet = () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    setShowAddModal(true);
  };

  /**
   * After a new pet is successfully added
   */
  const handlePetAdded = (newPet: Pet) => {
    setPets((prev) =>
      prev
        ? { pets: [newPet, ...prev.pets], count: prev.count + 1 }
        : { pets: [newPet], count: 1 }
    );
  };

  /**
   * Edit Pet => if user not logged in, show "Please Login" modal
   */
  const onEditPet = (pet: Pet) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    setPetToEdit(pet);
    setShowEditModal(true);
  };

  /**
   * After successful edit
   */
  const handlePetUpdated = (updatedPet: Pet) => {
    setShowEditModal(false);
    setPetToEdit(null);
    setPets((prev) => {
      if (!prev) return null;
      const newData = prev.pets.map((p) => (p.id === updatedPet.id ? updatedPet : p));
      return { ...prev, pets: newData };
    });
  };

  /**
   * Delete Pet
   * If you want to block delete behind login, you can do:
   *   if (!user) { setShowLoginModal(true); return; }
   */
  const handleDeletePet = async (petId: string) => {
    if (!window.confirm("Are you sure you want to delete this pet?")) return;

    try {
      const response = await fetch(`http://localhost:8001/api/v1/pets/${petId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete pet");

      setPets((prev) => {
        if (!prev) return { pets: [], count: 0 };
        return {
          pets: prev.pets.filter((pet) => pet.id.toString() !== petId),
          count: prev.count - 1,
        };
      });
    } catch (error) {
      console.error("Error deleting pet:", error);
    }
  };

  // Pagination
  const totalPages = Math.ceil((pets?.count || 0) / 10);
  const currentPage = Number(searchParams.get("page")) || 1;
  const pageList = Array.from({ length: totalPages || 1 }, (_, i) => (i + 1).toString());

  return (
    <div className="container mx-auto px-4">
      <SearchBar
        speciesQuery={searchParams.get("species") || ""}
        sortQuery={searchParams.get("sort") || ""}
        clearQuery={() => setSearchParams({})}
        addPetHandler={handleAddPet}
        updateSearchParams={updateSearchParams}
      />

      {loading ? (
        <p className="text-center">Loading pets...</p>
      ) : pets && pets.pets.length > 0 ? (
        <ul className="flex flex-wrap justify-evenly gap-x-1 gap-y-7 my-5">
          {pets.pets.map((pet) => (
            <PetCard
              key={pet.id}
              pet={pet}
              onDelete={handleDeletePet}
              onEdit={onEditPet}
            />
          ))}
        </ul>
      ) : (
        <div className="flex flex-col justify-center my-4">
          <h3 className="text-center mb-4">
            Woof... We're having trouble finding pets right now.
          </h3>
        </div>
      )}

      <div className="flex my-20">
        <Pagination
          pageList={pageList}
          paginationQuery={(e) => updateSearchParams("page", e.currentTarget.id)}
          previous={(currentPage - 1).toString()}
          next={(currentPage + 1).toString()}
        />
      </div>

      {/* Add Pet Modal */}
      {showAddModal && (
        <AddPetModal onClose={() => setShowAddModal(false)} onPetAdded={handlePetAdded} />
      )}

      {/* Edit Pet Modal */}
      {showEditModal && petToEdit && (
        <EditPetModal
          pet={petToEdit}
          onClose={() => setShowEditModal(false)}
          onPetUpdated={handlePetUpdated}
        />
      )}

      {/* "Please Login" modal (NO register button) */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md max-w-sm mx-auto text-center">
            <h2 className="text-xl font-bold mb-4">Please Login</h2>
            <p className="mb-4">You must be logged in to perform this action.</p>
            <div className="flex justify-center space-x-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setShowLoginModal(false)}
              >
                Close
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => {
                  setShowLoginModal(false);
                  navigate("/users/login");
                }}
              >
                Login
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
