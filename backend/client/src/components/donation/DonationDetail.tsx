import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

interface DonationCampaign {
  id: number;
  pet_name: string;
  max_donation: number;
  last_date: string;
  short_info: string;
  long_description: string;
  image_path: string | null;
}

export const DonationDetail = () => {
  const { id } = useParams();
  const [campaign, setCampaign] = useState<DonationCampaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Control the visibility of the donation form modal
  const [showModal, setShowModal] = useState(false);
  // Control the display of the success message
  const [showSuccess, setShowSuccess] = useState(false);

  // Form fields for the donation modal
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [donorPhone, setDonorPhone] = useState("");
  const [donorAddress, setDonorAddress] = useState("");
  const [donationAmount, setDonationAmount] = useState("");

  // Fetch the specific campaign details on mount (or when id changes)
  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const res = await axios.get(`/api/v1/donations/${id}`);
        setCampaign(res.data.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching single campaign:", err);
        setError("Unable to load campaign details.");
        setLoading(false);
      }
    };
    fetchCampaign();
  }, [id]);

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  if (!campaign) {
    return <div className="p-4">No campaign found.</div>;
  }

  // Construct the image path if available
  const imageSrc = campaign.image_path ? `/${campaign.image_path}` : null;

  // Handle submission of the donation form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Example: You might call an API endpoint here to process the donation
    // axios.post("/api/v1/donations/submit", { ... })

    console.log("Donation form submitted with:", {
      donorName,
      donorEmail,
      donorPhone,
      donorAddress,
      donationAmount,
      campaignId: id,
    });

    // Close the modal and show the success message
    setShowModal(false);
    setShowSuccess(true);

    // Automatically hide the success message after 3 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);

    // Clear the form fields
    setDonorName("");
    setDonorEmail("");
    setDonorPhone("");
    setDonorAddress("");
    setDonationAmount("");
  };

  return (
    <div className="bg-[#F7F9FA] min-h-screen p-4 text-[#333333]">
      {/* Fixed Success Message in the center with a cross icon */}
      {showSuccess && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-500 text-white px-6 py-3 rounded shadow z-50 flex items-center space-x-4">
          <span>Thank you for saving a life!</span>
          <button onClick={() => setShowSuccess(false)} className="text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {/* Card Container */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Top Section: Image + Basic Info */}
          <div className="flex flex-col md:flex-row md:space-x-6">
            {imageSrc && (
              <img
                src={imageSrc}
                alt={campaign.pet_name}
                className="w-full md:w-1/2 h-auto object-cover rounded-lg shadow mb-4 md:mb-0"
              />
            )}
            <div className="md:w-1/2">
              <h1 className="text-3xl font-bold text-[#2C3E50] mb-2">
                {campaign.pet_name}
              </h1>
              <p className="text-xl font-semibold text-[#E67E22] mb-2">
                Needed donation amount: ${campaign.max_donation}
              </p>
              <p className="text-sm text-[#333333] mb-4">
                <span className="font-medium">Date:</span> {campaign.last_date}
              </p>
            </div>
          </div>

          {/* Short Info */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-[#2C3E50] mb-2">
              Short Information About Donation
            </h2>
            <p className="bg-[#f2f2f2] text-[#333333] p-3 rounded">
              {campaign.short_info}
            </p>
          </div>

          {/* Long Description */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-[#2C3E50] mb-2">
              Long Description About Donation
            </h2>
            <p className="bg-[#f2f2f2] text-[#333333] p-3 rounded">
              {campaign.long_description}
            </p>
          </div>

          {/* Donate Now Button */}
          <div className="mt-6">
            <button
              onClick={() => setShowModal(true)}
              className="bg-[#E67E22] hover:bg-[#cf6e1d] text-white px-6 py-2 rounded font-bold"
            >
              Donate Now
            </button>
          </div>
        </div>
      </div>

      {/* Donation Modal (shows when showModal === true) */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          {/* Overlay: clicking outside the form closes the modal */}
          <div className="absolute inset-0" onClick={() => setShowModal(false)} />
          {/* Donation Form */}
          <form
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            onSubmit={handleSubmit}
            className="relative bg-white p-6 rounded shadow text-[#333333] w-full max-w-md z-50"
          >
            <h2 className="text-lg font-semibold mb-4 text-[#2C3E50]">
              Donation Form
            </h2>

            <div className="mb-3">
              <label className="block text-sm mb-1">Your Name</label>
              <input
                type="text"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                className="w-full px-2 py-1 rounded border border-[#2C3E50] text-sm"
                placeholder="Your Name"
                required
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm mb-1">Your Email</label>
              <input
                type="email"
                value={donorEmail}
                onChange={(e) => setDonorEmail(e.target.value)}
                className="w-full px-2 py-1 rounded border border-[#2C3E50] text-sm"
                placeholder="Your Email"
                required
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm mb-1">Your Phone Number</label>
              <input
                type="tel"
                value={donorPhone}
                onChange={(e) => setDonorPhone(e.target.value)}
                className="w-full px-2 py-1 rounded border border-[#2C3E50] text-sm"
                placeholder="Your Phone Number"
                required
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm mb-1">Your Address</label>
              <input
                type="text"
                value={donorAddress}
                onChange={(e) => setDonorAddress(e.target.value)}
                className="w-full px-2 py-1 rounded border border-[#2C3E50] text-sm"
                placeholder="Your Address"
                required
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm mb-1">Donation Amount</label>
              <input
                type="number"
                value={donationAmount}
                onChange={(e) => setDonationAmount(e.target.value)}
                className="w-full px-2 py-1 rounded border border-[#2C3E50] text-sm"
                placeholder="Enter Donation Amount"
                required
              />
            </div>

            <div className="flex justify-end space-x-2 mt-4">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="bg-[#2C3E50] hover:bg-[#34495e] text-white px-3 py-1 rounded text-sm font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#E67E22] hover:bg-[#cf6e1d] text-white px-3 py-1 rounded text-sm font-bold"
              >
                Submit Donation
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
