import axios from "axios";
import { RegisterUser, LoginUser } from "../types";

const BASE_URL = "http://localhost:8001/api/v1"; // Ensure consistency

/**
 * GET all pets
 */
export const fetchPets = async () => {
  try {
    const query = window.location.search;
    const response = await axios.get(`${BASE_URL}/pets${query}`);
    return response.data;
  } catch (err: any) {
    return { error: err.response?.data?.message || "No pets available." };
  }
};

/**
 * GET one pet by ID
 */
export const fetchPet = async ({ params }: { params: any }) => {
  try {
    const response = await axios.get(`${BASE_URL}/pets/${params.id}`);
    return response.data;
  } catch (err: any) {
    return { error: err.response?.data?.message || "Pet not found." };
  }
};

/**
 * ADD a new pet (multipart/form-data if image is included)
 */
export const addPet = async (formData: FormData) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.post(`${BASE_URL}/pets`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    return response.data;
  } catch (err: any) {
    return { error: err.response?.data?.message || "Failed to add pet" };
  }
};

/**
 * DELETE a pet by ID
 */
export const deletePet = async (petId: string) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.delete(`${BASE_URL}/pets/${petId}`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    return response.data;
  } catch (err: any) {
    return {
      error: err.response?.data?.message || "Failed to delete pet",
    };
  }
};

/**
 * REGISTER user
 */
export const registerUser = async (user: RegisterUser) => {
  try {
    const response = await axios.post(`${BASE_URL}/users/register`, user, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (err: any) {
    return { error: err.response?.data?.message || "Registration failed" };
  }
};

/**
 * LOGIN user
 */
export const loginUser = async (user: LoginUser) => {
  try {
    const response = await axios.post(`${BASE_URL}/users/login`, user, {
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
    const token = localStorage.getItem("authToken");
    const response = await axios.get(`${BASE_URL}/users/isUserAuth`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
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
    const token = localStorage.getItem("authToken");
    const response = await axios.get(`${BASE_URL}/users/logout`, {
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

/**
 * GET all donation campaigns
 */
export const fetchDonations = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/donations`);
    return response.data; // { data: [ ... ] }
  } catch (err: any) {
    return { error: err.response?.data?.message || "Failed to fetch donations" };
  }
};

/**
 * GET single donation campaign by ID
 */
export const fetchDonation = async (id: number | string) => {
  try {
    const response = await axios.get(`${BASE_URL}/donations/${id}`);
    return response.data; // { data: { ... } }
  } catch (err: any) {
    return { error: err.response?.data?.message || "Failed to fetch donation" };
  }
};

/**
 * CREATE a new donation campaign (multipart/form-data if image)
 */
export const createDonation = async (formData: FormData) => {
  try {
    const response = await axios.post(`${BASE_URL}/donations`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data; // { data: { ... } }
  } catch (err: any) {
    return { error: err.response?.data?.message || "Failed to create donation" };
  }
};

/**
 * UPDATE an existing donation campaign (PUT)
 */
export const updateDonation = async (id: number | string, formData: FormData) => {
  try {
    const response = await axios.put(`${BASE_URL}/donations/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data; // { data: { ... } }
  } catch (err: any) {
    return { error: err.response?.data?.message || "Failed to update donation" };
  }
};

/**
 * DELETE a donation campaign by ID
 */
export const deleteDonation = async (id: number | string) => {
  try {
    const response = await axios.delete(`${BASE_URL}/donations/${id}`);
    return response.data; // { message: "Donation campaign deleted successfully" }
  } catch (err: any) {
    return { error: err.response?.data?.message || "Failed to delete donation" };
  }
};
