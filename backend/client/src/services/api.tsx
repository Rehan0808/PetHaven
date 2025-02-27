// src/services/api.tsx

import { json } from "react-router-dom";
import { RegisterUser, LoginUser } from "../types";

/** 
 * Fetch all pets 
 * If your /api/v1/pets route requires being logged in, add credentials: "include".
 * If it's public, you can omit it. But if you see "no data" due to 401 errors,
 * add credentials: "include" so the cookie is sent.
 */
export const fetchPets = async () => {
  const query = window.location.search;
  const res = await fetch(`http://localhost:8001/api/v1/pets${query}`, {
    credentials: "include", // <== add if route is protected or you need the session
  });

  if (!res.ok) {
    // This triggers the errorElement in your Route config
    throw json({ message: "No pets available." }, { status: 500 });
  }

  const data = await res.json();
  return data;
};

// Fetch one pet
export const fetchPet = async ({ params }: { params: any }) => {
  const id = params.id;
  const res = await fetch(`http://localhost:8001/api/v1/pets/${id}`, {
    credentials: "include", // <== same reasoning
  });

  if (!res.ok) {
    throw json({ message: "Pet not found." }, { status: 404 });
  }

  return await res.json();
};

// Register user
export const registerUser = async (user: RegisterUser) => {
  console.log("Registering user:", user);

  const res = await fetch("http://localhost:8001/api/v1/users/register", {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(user),
    credentials: "include", // <== keep this for session-based auth
  });

  console.log("Response Status:", res.status);

  const data = await res.json();
  console.log("Response Data:", data);

  if (res.status !== 201) {
    // Expecting 201 for successful creation
    return Promise.reject(data.message);
  }
  return data;
};

// Login user
export const loginUser = async (user: LoginUser) => {
  const res = await fetch("http://localhost:8001/api/v1/users/login", {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(user),
    credentials: "include", // <== ADD THIS to store the session cookie
  });

  // If not 200, throw an error
  if (res.status !== 200) {
    const data = await res.json();
    return Promise.reject(data.message);
  } else {
    const data = await res.json();
    return data;
  }
};

// Get current user session
export const getUser = async () => {
  const res = await fetch("http://localhost:8001/api/v1/users/isUserAuth", {
    credentials: "include",
    headers: { "Content-type": "application/json" },
  });
  if (res.status !== 200) {
    const data = await res.json();
    return Promise.reject(data.message);
  }
  const data = await res.json();
  return data;
};

// Logout user
export const logoutUser = async () => {
  const res = await fetch("http://localhost:8001/api/v1/users/logout", {
    credentials: "include",
    headers: { "Content-type": "application/json" },
  });
  const data = await res.json();
  return data;
};
