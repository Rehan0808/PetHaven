import React, { useReducer } from "react";
import CartContext from "./cartContext";
import CartReducer, { sumItems } from "./cartReducer";
import { CartPet, Props } from "../../types"; // <-- Import CartPet, Props

const storedData = localStorage.getItem("cartItems");
let parsedStorage: CartPet[] = [];

// Safely parse localStorage. If it’s not an array or missing `fee`, handle gracefully.
if (storedData) {
  try {
    const temp = JSON.parse(storedData);
    if (Array.isArray(temp)) {
      // Convert `fee` to number for each item
      parsedStorage = temp.map((item) => ({
        ...item,
        fee: parseFloat(String(item.fee)), // ensure numeric
      }));
    }
  } catch (err) {
    console.error("Failed to parse cartItems from localStorage:", err);
  }
}

export const CartState: React.FC<Props> = ({ children }) => {
  const initialState = {
    cartItems: parsedStorage,
    ...sumItems(parsedStorage),
    checkout: false,
    showCart: false, // define this if your code references `state.showCart`
  };

  const [state, dispatch] = useReducer(CartReducer, initialState);

  const addToCart = (payload: CartPet) => {
    dispatch({ type: "ADD_TO_CART", payload });
  };

  const removeFromCart = (payload: CartPet) => {
    dispatch({ type: "REMOVE_ITEM", payload });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR" });
  };

  const handleCheckout = () => {
    dispatch({ type: "CHECKOUT" });
  };

  return (
    <CartContext.Provider
      value={{
        showCart: state.showCart, // from initialState
        cartItems: state.cartItems,
        addToCart,
        removeFromCart,
        handleCheckout,
        clearCart,
        ...state, // merges itemCount, total, checkout, etc.
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
