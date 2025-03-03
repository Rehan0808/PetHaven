// src/components/petSearch/EditPetModal.tsx
import React, { useState, FormEvent } from "react";
import { Pet } from "../../types";

interface EditPetModalProps {
  pet: Pet; // The existing pet to edit
  onClose: () => void;
  onPetUpdated: (updatedPet: Pet) => void;
}

const EditPetModal: React.FC<EditPetModalProps> = ({ pet, onClose, onPetUpdated }) => {
  // Pre-fill with existing pet data
  const [formData, setFormData] = useState({
    name: pet.name,
    species: pet.species.charAt(0).toUpperCase() + pet.species.slice(1),
    age: pet.age,
    fee: pet.fee,
    description: pet.description,
    gender: pet.gender.charAt(0).toUpperCase() + pet.gender.slice(1),
    zip: pet.zip ? String(pet.zip) : "",
    town: pet.town || "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);

  // Handle text changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file changes
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };

  // Handle form submit
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Convert species & gender to lowercase for the backend
    const adjustedData = {
      ...formData,
      species: formData.species.toLowerCase(),
      gender: formData.gender.toLowerCase(),
    };

    const dataToSend = new FormData();
    Object.entries(adjustedData).forEach(([key, value]) => {
      dataToSend.append(key, String(value));
    });

    if (imageFile) {
      dataToSend.append("image", imageFile);
    }

    try {
      // Use pet.id (NOT pet._id) to match your Postgres model
      const response = await fetch(`http://localhost:8001/api/v1/pets/${pet.id}`, {
        method: "PUT",
        body: dataToSend,
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || "Failed to update pet");
      }

      // If your backend returns { pet: updatedPet }
      const updatedPet = responseData.pet || responseData;
      onPetUpdated(updatedPet);
      onClose();
    } catch (err) {
      console.error("Error updating pet:", err);
      alert(`Error: ${(err as Error).message}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-3 rounded-lg w-2/5 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-2 right-2 text-xl text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>

        <h2 className="text-lg font-bold text-center mb-2">Edit Pet</h2>

        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="grid grid-cols-3 gap-2"
        >
          {/* Name, Species, Age */}
          <div className="flex flex-col">
            <label className="font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-1"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="font-medium text-gray-700">Species</label>
            <select
              name="species"
              value={formData.species}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-1"
              required
            >
              <option value="Dog">Dog</option>
              <option value="Cat">Cat</option>
              <option value="Rat">Rat</option>
              <option value="Chicken">Chicken</option>
              <option value="Bunny">Bunny</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="font-medium text-gray-700">Age</label>
            <input
              type="number"
              name="age"
              value={String(formData.age)}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-1"
              required
            />
          </div>

          {/* Fee, Gender, Zip */}
          <div className="flex flex-col">
            <label className="font-medium text-gray-700">Fee</label>
            <input
              type="number"
              name="fee"
              value={String(formData.fee)}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-1"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="font-medium text-gray-700">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-1"
              required
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="font-medium text-gray-700">Zip</label>
            <input
              type="text"
              name="zip"
              value={formData.zip}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-1"
            />
          </div>

          {/* Town, optional new image */}
          <div className="flex flex-col">
            <label className="font-medium text-gray-700">Town</label>
            <input
              type="text"
              name="town"
              value={formData.town}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-1"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-medium text-gray-700">Choose Image</label>
            <input
              type="file"
              accept="image/*"
              name="image"
              onChange={handleFileChange}
              className="border border-gray-300 rounded-md p-1"
            />
          </div>

          <div></div>

          {/* Description */}
          <div className="flex flex-col col-span-3">
            <label className="font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-1"
              rows={2}
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-2 col-span-3">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-1 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-black px-3 py-1 rounded-md"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPetModal;
