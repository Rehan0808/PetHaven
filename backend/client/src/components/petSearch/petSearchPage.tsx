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

  // Main pet data
  const [pets, setPets] = useState<{ data: Pet[]; totalPetsResults: number } | null>(null);
  const [loading, setLoading] = useState(true);

  // Existing Add Pet modal
  const [showAddModal, setShowAddModal] = useState(false);

  // For editing
  const [showEditModal, setShowEditModal] = useState(false);
  const [petToEdit, setPetToEdit] = useState<Pet | null>(null);

  // Auth checks
  const { user } = useAuth();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

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
        console.log("Fetched pets:", result);

        setPets(result);
      } catch (error) {
        console.error("Error fetching pets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, [searchParams]);

  // Add Pet
  const handleAddPet = () => {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    setShowAddModal(true);
  };

  // Delete Pet
  const handleDeletePet = async (petId: string) => {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    if (!window.confirm("Are you sure you want to delete this pet?")) return;

    try {
      const response = await fetch(`http://localhost:8001/api/v1/pets/${petId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete pet");

      setPets((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          data: prev.data.filter((pet) => pet.id.toString() !== petId),
          totalPetsResults: prev.totalPetsResults - 1,
        };
      });
    } catch (error) {
      console.error("Error deleting pet:", error);
    }
  };

  // New pet added
  const handlePetAdded = (newPet: Pet) => {
    setPets((prev) =>
      prev
        ? {
            ...prev,
            data: [newPet, ...prev.data],
            totalPetsResults: prev.totalPetsResults + 1,
          }
        : { data: [newPet], totalPetsResults: 1 }
    );
  };

  // Edit Pet
  const onEditPet = (pet: Pet) => {
    setPetToEdit(pet);
    setShowEditModal(true);
  };

  // After successful edit
  const handlePetUpdated = (updatedPet: Pet) => {
    setShowEditModal(false);
    setPetToEdit(null);

    // Merge updated pet in state
    setPets((prev) => {
      if (!prev) return null;
      const newData = prev.data.map((p) => (p.id === updatedPet.id ? updatedPet : p));
      return { ...prev, data: newData };
    });
  };

  // Pagination
  const totalPages = Math.ceil((pets?.totalPetsResults || 1) / 10);
  const currentPage = Number(searchParams.get("page")) || 1;
  const pageList = Array.from({ length: totalPages }, (_, i) => (i + 1).toString());

  return (
    <div className="container mx-auto px-4 bg-[#F7F9FA] text-[#333333] min-h-screen">
      <SearchBar
        speciesQuery={searchParams.get("species") || ""}
        sortQuery={searchParams.get("sort") || ""}
        clearQuery={() => setSearchParams({})}
        addPetHandler={handleAddPet}
        updateSearchParams={updateSearchParams}
      />

      {loading ? (
        <p className="text-center mt-4">Loading pets...</p>
      ) : pets && pets.data.length ? (
        <ul className="flex flex-wrap justify-evenly gap-x-1 gap-y-7 my-5">
          {pets.data.map((pet) => (
            <PetCard key={pet.id} pet={pet} onDelete={handleDeletePet} onEdit={onEditPet} />
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

      {/* If user not logged in and tries "Add Pet," show login prompt */}
      {showLoginPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md max-w-sm mx-auto text-center">
            <h2 className="text-xl font-bold mb-4">Please Login or Register</h2>
            <p className="mb-4">You must be logged in to add or delete a pet.</p>
            <div className="flex justify-center space-x-4">
              <button
                className="px-4 py-2 bg-[#2C3E50] text-white rounded hover:bg-[#34495e]"
                onClick={() => setShowLoginPrompt(false)}
              >
                Close
              </button>
              <button
                className="px-4 py-2 bg-[#E67E22] text-white rounded hover:bg-[#cf6e1d]"
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
    </div>
  );
};
