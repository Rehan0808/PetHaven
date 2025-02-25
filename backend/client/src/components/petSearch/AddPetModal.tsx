import React, { useState } from "react";


interface AddPetModalProps {
  onClose: () => void;
  onPetAdded: (pet: any) => void;
}

const AddPetModal: React.FC<AddPetModalProps> = ({ onClose, onPetAdded }) => {
  const [formData, setFormData] = useState({
    name: "",
    species: "Dog",
    age: 0,
    fee: 0,
    description: "",
    gender: "Male",
    zip: "",
    town: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log(">>> handleSubmit called.");
    console.log(">>> Current formData:", formData);
    console.log(">>> Current imageFile:", imageFile);

    // 1) Convert species & gender to lowercase to match your model
    const adjustedData = {
      ...formData,
      species: formData.species.toLowerCase(), // "Dog" -> "dog"
      gender: formData.gender.toLowerCase(),   // "Male" -> "male"
    };

    // 2) Create FormData object
    const dataToSend = new FormData();

    // 3) Append text fields
    Object.entries(adjustedData).forEach(([key, value]) => {
      console.log(`Appending field "${key}":`, value);

      dataToSend.append(key, String(value));
    });

    // 4) Append file under the field name "image"
    if (imageFile) {
      console.log("Appending image file:", imageFile.name);
      dataToSend.append("image", imageFile);
    }

    // Debug final FormData
    dataToSend.forEach((val, key) => {
      console.log(`FormData -> ${key}:`, val);
    });
    

    try {
      const response = await fetch("http://localhost:8001/api/v1/pets", {
        method: "POST",
        body: dataToSend,
      });

      const responseData = await response.json();
      console.log(">>> Server response:", responseData);

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to add pet");
      }

      // Successfully added, call onPetAdded with new pet data
      onPetAdded(responseData.pet);
      onClose();
    } catch (err) {
      console.error("Submission error:", err);
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

        <h2 className="text-lg font-bold text-center mb-2">Add a New Pet</h2>

        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="grid grid-cols-3 gap-2"
        >
          {/* Row 1: Name, Species, Age */}
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
              value={formData.age}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-1"
              required
            />
          </div>

          {/* Row 2: Fee, Gender, Zip */}
          <div className="flex flex-col">
            <label className="font-medium text-gray-700">Fee</label>
            <input
              type="number"
              name="fee"
              value={formData.fee}
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

          {/* Row 3: Town, Image */}
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

          {/* Row 4: Description */}
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

          {/* Row 5: Buttons */}
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
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPetModal; 