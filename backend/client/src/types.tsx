// src/types.ts

export interface Pet {
  id: number;
  _id: string;
  name: string;
  species: string;
  fee: number;
  image?: string;
  gender: string;
  age: number;
  dateAddedToSite: string;
  description: string;
  town?: string;
  zip?: string;
  isAdopted?: boolean;
  owner_id?: number | null;
}

export type CartPet = Pet;

export interface CartContextType {
  cartItems: CartPet[];
  addToCart: (pet: CartPet) => void;
  removeFromCart: (pet: CartPet) => void;
  handleCheckout: () => void;
  total: number;
  itemCount: number;
}

export interface CarouselPet {
  _id: string;
  name: string;
  species: string;
  image: string;
}

export interface PetData {
  totalPetsResults: number;
  data: CarouselPet[];
}

export interface LoginUser {
  email: string;
  password: string;
}

export interface RegisterUser {
  username: string;
  email: string;
  password: string;
}

export interface User {
  id?: number;
  _id?: string;
  message?: string;
  username?: string;
  email: string;
  password?: string;
  token?: string;
}

export type AuthMessage = string;

export interface AuthContextType {
  user?: User;
  message?: string;
  loading?: boolean;
  error?: any;
  login: (user: LoginUser) => void;
  register: (user: RegisterUser) => void;
  logout: () => void;
}

export interface PetCardProps {
  pet: Pet;
  onDelete: (id: string) => void;
  onEdit?: (pet: Pet) => void; // in case you also have an edit handler
}

/**
 * For SearchBar:
 * - speciesQuery is now an array of strings to allow multiple selections.
 */
export interface SearchBarProps {
  speciesQuery: string[];
  sortQuery: string;
  clearQuery: () => void;
  addPetHandler: () => void;
  updateSearchParams: (key: string, value: string) => void;
  // If you need a toggle function passed in, add it here:
  // handleSpeciesToggle?: (species: string) => void;
  handleSpeciesToggle: (species: string) => void;
}

export type CartActionType =
  | { type: "ADD_TO_CART"; payload: CartPet }
  | { type: "REMOVE_ITEM"; payload: CartPet }
  | { type: "CHECKOUT" }
  | { type: "CLEAR" };

export interface Props {
  children: React.ReactNode;
}
