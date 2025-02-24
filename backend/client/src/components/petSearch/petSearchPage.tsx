// src/components/petSearch/petSearchPage.tsx

import queryString from "query-string";
import { useEffect, useState, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import { SearchBar } from "./searchBar";
import { PetCard } from "./petCard";
import { Pagination } from "./pagination";
import AddPetModal from "./AddPetModal";
import CartContext from "../../context/cartContext/cartContext";
import { multipleSpeciesStringConverter } from "../helpers";

// Types
interface Pet {
  _id: string;
  species: string;
  name: string;
  fee: number;
  image?: string;
  filename?: string;
  gender: string;
  age: number;
  dateAddedToSite: string;
  description: string;
  town?: string;
  zip?: string;
}

export const PetSearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // State for fetched pets and total count
  const [pets, setPets] = useState<{ data: Pet[]; totalPetsResults: number }>({
    data: [],
    totalPetsResults: 0,
  });
  const [loading, setLoading] = useState(true);

  // If you have a modal for adding pets
  const [showAddModal, setShowAddModal] = useState(false);

  // Example fetch using query string
  useEffect(() => {
    const fetchPets = async () => {
      setLoading(true);
      try {
        const query = queryString.stringify(Object.fromEntries(searchParams));
        const response = await fetch(`http://localhost:8001/api/v1/pets?${query}`);
        if (!response.ok) {
          throw new Error("Failed to fetch pets");
        }
        const result = await response.json();
        setPets(result);
      } catch (error) {
        console.error("Error fetching pets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, [searchParams]);

  // Clear all query params
  const clearQuery = () => {
    setSearchParams({});
  };

  // Sorting
  const sortQuery = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { name: key, id: value } = e.currentTarget;
    let parsed = queryString.parse(window.location.search);

    if (!parsed[key]) {
      parsed[key] = value;
    } else if (key in parsed && value === parsed[key]) {
      delete parsed[key];
    } else {
      parsed[key] = value;
    }
    delete parsed["page"];
    setSearchParams(queryString.stringify(parsed));
  };

  // Species filter
  const speciesQuery = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { name: key, id: value } = e.currentTarget;
    let parsed = queryString.parse(window.location.search);

    if (!parsed.species) {
      parsed.species = [];
    }
    if (!Array.isArray(parsed.species)) {
      parsed.species = [parsed.species];
    }

    if (!parsed[key]) {
      parsed[key] = value;
    } else if (parsed.species.includes(value)) {
      parsed.species = parsed.species.filter((element) => element !== value);
    } else {
      parsed.species.push(value);
    }
    delete parsed["page"];
    setSearchParams(queryString.stringify(parsed));
  };

  // Pagination logic
  const resultsCount = pets.totalPetsResults;
  const limit = Number(searchParams.get("limit") || 6);
  const page = Number(searchParams.get("page") || 1);
  const pages = Math.ceil(resultsCount / limit);
  const pageList = Array.from({ length: pages }, (_, i) => i + 1);
  const next = page < pages ? page + 1 : page;
  const previous = page > 1 ? page - 1 : page;

  // "Add Pet" button -> open modal
  const handleAddPet = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowAddModal(true);
  };

  // If a new pet is added, prepend it
  const handlePetAdded = (newPet: Pet) => {
    setPets((prev) => ({
      ...prev,
      data: [newPet, ...prev.data],
      totalPetsResults: prev.totalPetsResults + 1,
    }));
  };

  const cartContext = useContext(CartContext);

  return (
    <div className="container mx-auto px-4">
      <SearchBar
        clearQuery={clearQuery}
        sortQuery={sortQuery}
        speciesQuery={speciesQuery}
        addPetHandler={handleAddPet}
      />

      {loading ? (
        <p className="text-center">Loading pets...</p>
      ) : (
        <ul className="flex flex-wrap justify-evenly gap-x-1 gap-y-7 my-5">
          {pets.data.length ? (
            pets.data.map((pet) => (
              <PetCard
                key={pet._id}
                species={pet.species}
                _id={pet._id}
                name={pet.name}
                fee={pet.fee}
                image={pet.image ?? pet.filename ?? ""}
                gender={pet.gender}
                age={pet.age}
                dateAddedToSite={pet.dateAddedToSite}
                description={pet.description || "No description available"}
              />
            ))
          ) : (
            <div className="flex flex-col justify-center my-4">
              <h3 className="text-center mb-4">
                Woof... We're having trouble finding pets right now.
              </h3>
            </div>
          )}
        </ul>
      )}

      <div className="flex my-20">
        <Pagination pageList={pageList} next={next} previous={previous} />
      </div>

      {showAddModal && (
        <AddPetModal onClose={() => setShowAddModal(false)} onPetAdded={handlePetAdded} />
      )}
    </div>
  );
};

