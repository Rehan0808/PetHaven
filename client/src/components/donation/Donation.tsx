import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import useAuth from "../../context/userContext/useAuth";

export const Donation = () => {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [petName, setPetName] = useState("");
  const [maxDonation, setMaxDonation] = useState("");
  const [lastDate, setLastDate] = useState("");
  const [shortInfo, setShortInfo] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [donationCampaigns, setDonationCampaigns] = useState<any[]>([]);

  // State to handle delete confirmation modal
  const [campaignToDelete, setCampaignToDelete] = useState<number | null>(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await axios.get("/api/v1/donations");
        setDonationCampaigns(
          response.data.data.map((dbRow: any) => ({
            id: dbRow.id,
            petName: dbRow.pet_name,
            maxDonation: dbRow.max_donation,
            lastDate: dbRow.last_date,
            shortInfo: dbRow.short_info,
            longDescription: dbRow.long_description,
            serverImagePath: dbRow.image_path,
            localPreview: null,
          }))
        );
      } catch (err) {
        console.error("Error fetching donation campaigns:", err);
      }
    };

    fetchCampaigns();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("petName", petName);
      formData.append("maxDonation", maxDonation);
      formData.append("lastDate", lastDate);
      formData.append("shortInfo", shortInfo);
      formData.append("longDescription", longDescription);
      if (selectedFile) formData.append("image", selectedFile);

      const response = await axios.post("/api/v1/donations", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setDonationCampaigns((prev) => [
        ...prev,
        {
          id: response.data.data.id,
          petName: response.data.data.pet_name,
          maxDonation: response.data.data.max_donation,
          lastDate: response.data.data.last_date,
          shortInfo: response.data.data.short_info,
          longDescription: response.data.data.long_description,
          serverImagePath: response.data.data.image_path,
          localPreview: selectedFile ? URL.createObjectURL(selectedFile) : null,
        },
      ]);

      // Reset form
      setPetName("");
      setMaxDonation("");
      setLastDate("");
      setShortInfo("");
      setLongDescription("");
      setSelectedFile(null);
      setShowForm(false);
    } catch (err) {
      console.error("Error creating donation campaign:", err);
    }
  };

  // Handler when confirming deletion from the modal (optimistic update)
  const confirmDelete = async () => {
    if (campaignToDelete !== null) {
      // Optimistically remove the campaign from UI
      setDonationCampaigns((prev) =>
        prev.filter((campaign) => campaign.id !== campaignToDelete)
      );

      try {
        await axios.delete(`/api/v1/donations/${campaignToDelete}`);
      } catch (err) {
        console.error("Error deleting donation campaign:", err);
        // Optionally re-fetch campaigns or revert the UI change if needed.
      } finally {
        setCampaignToDelete(null);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-[#E5E7EB] min-h-screen text-[#111827]">
      <div className="flex items-center space-x-2">
        <h1 className="text-3xl font-bold text-center">Make a Donation</h1>
        <button onClick={() => setShowForm((prev) => !prev)} aria-label="Toggle form">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6 text-[#111827] hover:text-[#333333] transition-colors"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <h2 className="text-2xl font-bold mt-8 mb-6">Donation Campaign</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
        {donationCampaigns.map((campaign) => {
          const imageSrc =
            campaign.localPreview ||
            (campaign.serverImagePath ? `/${campaign.serverImagePath}` : null);

          return (
            <div
              key={campaign.id}
              className="
                bg-[#E5E7EB] 
                text-[#111827] 
                rounded-lg 
                shadow-2xl 
                hover:shadow-[0_35px_60px_-10px_rgba(0,0,0,0.3)] 
                transition-shadow 
                w-80 
                mx-auto 
                border 
                border-gray-300
              "
            >
              {imageSrc && (
                <img
                  src={imageSrc}
                  alt={campaign.petName}
                  className="w-full h-64 object-cover rounded-t-lg"
                />
              )}
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">
                  {campaign.petName}
                </h3>
                <p className="text-sm mb-1">
                  Date: {campaign.lastDate}
                </p>
                <p className="text-sm mb-1">
                  Donation Amount: {campaign.maxDonation}
                </p>
                <Link to={`/donation/${campaign.id}`}>
                  <button className="bg-[#E67E22] hover:bg-[#cf6e1d] text-white px-4 py-2 mt-3 rounded font-bold mr-2">
                    View Details
                  </button>
                </Link>

                {/* Show Delete button ONLY if user is logged in */}
                {user && (
                  <button
                    onClick={() => setCampaignToDelete(campaign.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 mt-3 rounded font-bold"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="absolute inset-0" onClick={() => setShowForm(false)} />
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSubmit}
            className="relative bg-white p-6 rounded shadow text-[#111827] w-full max-w-lg z-50"
          >
            <h2 className="text-lg font-semibold mb-4">
              Create Donation Campaign
            </h2>

            <input
              type="text"
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
              className="w-full px-2 py-1 rounded border border-gray-300 text-[#111827] text-sm mb-3"
              placeholder="Pet Name"
              required
            />
            <input
              type="number"
              value={maxDonation}
              onChange={(e) => setMaxDonation(e.target.value)}
              className="w-full px-2 py-1 rounded border border-gray-300 text-[#111827] text-sm mb-3"
              placeholder="Donation Amount"
              required
            />
            <input
              type="text"
              value={lastDate}
              onChange={(e) => setLastDate(e.target.value)}
              className="w-full px-2 py-1 rounded border border-gray-300 text-[#111827] text-sm mb-3"
              placeholder="Date (MM/DD/YYYY)"
              required
            />
            <input
              type="text"
              value={shortInfo}
              onChange={(e) => setShortInfo(e.target.value)}
              className="w-full px-2 py-1 rounded border border-gray-300 text-[#111827] text-sm mb-3"
              placeholder="Short Info"
              required
            />
            <textarea
              value={longDescription}
              onChange={(e) => setLongDescription(e.target.value)}
              className="w-full px-2 py-1 rounded border border-gray-300 text-[#111827] text-sm mb-3"
              placeholder="Long Description"
              rows={3}
              required
            />

            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-[#111827] file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer mb-3"
            />
            {selectedFile && (
              <p className="mt-1 text-xs">
                File chosen: <strong>{selectedFile.name}</strong>
              </p>
            )}

            <div className="flex justify-end space-x-2 mt-4">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded text-sm font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#E67E22] hover:bg-[#cf6e1d] text-white px-3 py-1 rounded text-sm font-bold"
              >
                Add Donation Campaign
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {campaignToDelete !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md text-[#111827]">
            <h3 className="text-2xl font-bold mb-4">Confirm Deletion</h3>
            <p className="mb-6">
              Are you sure you want to delete this campaign? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setCampaignToDelete(null)}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded font-bold"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-bold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
