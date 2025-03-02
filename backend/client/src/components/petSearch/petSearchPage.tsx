// src/components/petSearch/petSearchPage.tsx

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

  // Main pet data now expects keys "pets" (array) and "count" (total number)
  const [pets, setPets] = useState<{ pets: Pet[]; count: number } | null>(null);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [petToEdit, setPetToEdit] = useState<Pet | null>(null);

  // Auth context (if needed)
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
        console.log("Fetched pets:", result);
        
        // Ensure result has the expected structure
        if (result && typeof result === 'object') {
          // Make sure pets is always an array even if the API returns null/undefined
          const normalizedResult = {
            pets: Array.isArray(result.pets) ? result.pets : [],
            count: typeof result.count === 'number' ? result.count : 0
          };
          setPets(normalizedResult);
        } else {
          console.error("Unexpected API response format:", result);
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
   * Add Pet
   */
  const handleAddPet = () => {
    setShowAddModal(true);
  };

  /**
   * Delete Pet
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
          ...prev,
          pets: prev.pets.filter((pet) => pet.id.toString() !== petId),
          count: prev.count - 1,
        };
      });
    } catch (error) {
      console.error("Error deleting pet:", error);
    }
  };

  // Called after a new pet is successfully added
  const handlePetAdded = (newPet: Pet) => {
    setPets((prev) =>
      prev
        ? {
            ...prev,
            pets: [newPet, ...prev.pets],
            count: prev.count + 1,
          }
        : { pets: [newPet], count: 1 }
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

    setPets((prev) => {
      if (!prev) return null;
      const newData = prev.pets.map((p) => (p.id === updatedPet.id ? updatedPet : p));
      return { ...prev, pets: newData };
    });
  };

  // Pagination: using "count" from the backend for total results
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
      ) : pets && pets.pets && pets.pets.length > 0 ? (
        <ul className="flex flex-wrap justify-evenly gap-x-1 gap-y-7 my-5">
          {pets.pets.map((pet) => (
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
    </div>
  );
};