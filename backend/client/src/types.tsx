// src/types.ts

export interface Pet {
  id: number;                 // Postgres numeric primary key
  _id: string;                // Kept if your code still references _id
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
  adopted?: boolean;

  // NEW: The owner_id field. Make it optional and possibly nullable:
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
  // If your backend sets req.user.id as a number, do:
  id?: number;

  // Keep _id if some parts of your code still rely on a string ID
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
}

export type CartActionType =
  | { type: "ADD_TO_CART"; payload: CartPet }
  | { type: "REMOVE_ITEM"; payload: CartPet }
  | { type: "CHECKOUT" }
  | { type: "CLEAR" };

export interface Props {
  children: React.ReactNode;
}
