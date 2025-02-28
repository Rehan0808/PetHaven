import axios from "axios";
import { json } from "react-router-dom";
import { RegisterUser, LoginUser } from "../types";

/**
 * GET all pets
 */
export const fetchPets = async () => {
  const query = window.location.search;
  try {
    const response = await axios.get(`/api/v1/pets${query}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (err) {
    throw json({ message: "No pets available." }, { status: 500 });
  }
};

/**
 * GET one pet by ID
 */
export const fetchPet = async ({ params }: { params: any }) => {
  try {
    const id = params.id;
    const response = await axios.get(`/api/v1/pets/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (err) {
    throw json({ message: "Pet not found." }, { status: 404 });
  }
};

/**
 * ADD a new pet (multipart/form-data if image is included)
 */
export const addPet = async (formData: FormData) => {
  try {
    const response = await axios.post("/api/v1/pets", formData, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (err: any) {
    return { error: err.response?.data?.message || "Failed to add pet" };
  }
};


/**
 * REGISTER user
 */
export const registerUser = async (user: RegisterUser) => {
  try {
    const response = await axios.post("/api/v1/users/register", user, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (err: any) {
    return { error: err.response?.data?.message || "Server error during registration" };
  }
};

/**
 * LOGIN user
 */
export const loginUser = async (user: LoginUser) => {
  try {
    const response = await axios.post("/api/v1/users/login", user, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (err: any) {
    return { error: err.response?.data?.message || "Login failed" };
  }
};

/**
 * GET current user session
 */
export const getUser = async () => {
  try {
    const response = await axios.get("/api/v1/users/isUserAuth", {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (err: any) {
    return { error: err.response?.data?.message || "Failed to get user session" };
  }
};

/**
 * LOGOUT user
 */
export const logoutUser = async () => {
  try {
    const response = await axios.get("/api/v1/users/logout", {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (err: any) {
    return { error: err.response?.data?.message || "Logout failed" };
  }
};
