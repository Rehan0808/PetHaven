import React from "react";
import { useNavigate } from "react-router-dom";

export const Homepage = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#F9FAFB] text-[#111827]">
      {/* 1) HERO SECTION */}
      <div
        className="relative w-full min-h-[600px] md:h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center"
        style={{
          backgroundImage: `url("/home.jpg")`,
        }}
      >
        {/* Removed the overlay entirely */}

        {/* Centered text on top of image */}
        <div className="relative z-10 px-4 text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-md">
            Welcome to Pet Adoption
          </h1>
          <p className="text-lg md:text-xl mb-6 text-white drop-shadow-md">
            Where tails wag and hearts connect! Discover your newest family
            member from our selection of furry friends.
          </p>
          <button
            className="bg-[#1e3b8a] hover:bg-[#D97706] text-white font-bold px-6 py-3 rounded"
            onClick={() => navigate("/users/login")}
          >
            Adopt Now
          </button>
        </div>
      </div>

      {/* 2) ABOUT US SECTION */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* LEFT COLUMN: Image */}
          <div className="flex justify-center">
            <img
              src="/image.png"
              alt="A man with a dog"
              className="rounded-lg shadow-lg max-w-full h-[600px]"
            />
          </div>

          {/* RIGHT COLUMN: Text */}
          <div>
            <h3 className="text-[#2563EB] text-lg font-semibold uppercase mb-2">
              About Us
            </h3>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 leading-tight">
              Welcome to Our Pet Adoption Community. Discover the Joy of
              Rescuing a Furry Friend and Join Us in Building Forever Bonds
              with Loving Companions.
            </h2>
            <p className="mb-4">
              Welcome to Pet Adoption Website, where love finds a furry friend
              and homes are filled with joy. Our platform is dedicated to
              connecting loving individuals with pets in need of a forever home.
              We believe in the transformative power of adoption, fostering
              meaningful connections between people and their new animal
              companions. Our user-friendly interface showcases adorable pets
              ready to join your family.
            </p>
            <p className="mb-4">
              Each adoption contributes to the broader mission of promoting
              responsible pet ownership and ensuring the well-being of animals.
              Explore our comprehensive profiles, featuring heartwarming stories
              and captivating images, and embark on a journey of companionship.
              Join us in making a difference—one paw at a time. Together, let's
              create homes filled with love and wagging tails.
            </p>
            <button className="bg-[#1e3b8a] hover:bg-[#D97706] text-white font-bold px-5 py-2 rounded">
              Get More Info
            </button>
          </div>
        </div>
      </div>

      {/* 3) FOOTER SECTION */}
      <footer className="bg-[#1E3A8A] py-6">
        <div className="container mx-auto px-4 text-center text-white">
          <p className="mb-2">© 2025 Pet Adoption. All rights reserved.</p>
          <p className="text-sm">
            Bringing pets and families together, one paw at a time.
          </p>
        </div>
      </footer>
    </div>
  );
};
