import { createContext } from "react";
import { CartContextType, CartPet } from "../../types"; 

const CartContext = createContext<CartContextType>({
  cartItems: [],
  addToCart: (pet: CartPet) => {},
  removeFromCart: (pet: CartPet) => {},
  handleCheckout: () => {},
  total: 0,
  itemCount: 0,
});

export default CartContext;