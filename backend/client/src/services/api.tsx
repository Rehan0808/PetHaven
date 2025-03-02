// client/src/services/api.tsx
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
      // no withCredentials needed if purely header-based
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
      // no withCredentials needed
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
    // read token from localStorage
    const token = localStorage.getItem("authToken");

    const response = await axios.post("http://localhost:8001/api/v1/pets", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    return response.data; // { msg, pet }
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
      headers: { "Content-Type": "application/json" },
    });
    return response.data; // { success, user, token }
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
      headers: { "Content-Type": "application/json" },
    });
    return response.data; // { success, user, token }
  } catch (err: any) {
    return { error: err.response?.data?.message || "Login failed" };
  }
};

/**
 * GET current user session
 */
export const getUser = async () => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.get("/api/v1/users/isUserAuth", {
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    return response.data; // { success, user }
  } catch (err: any) {
    return { error: err.response?.data?.message || "Failed to get user session" };
  }
};

/**
 * LOGOUT user
 */
export const logoutUser = async () => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.get("/api/v1/users/logout", {
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    return response.data;
  } catch (err: any) {
    return { error: err.response?.data?.message || "Logout failed" };
  }
};
