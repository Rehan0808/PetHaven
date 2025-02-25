import { ADD_TO_CART, REMOVE_ITEM, CHECKOUT, CLEAR } from "./cartTypes";
import { CartPet, CartActionType } from "../../types"; // <-- Import here

// Save cart items to localStorage
const Storage = (cartItems: CartPet[]) => {
  localStorage.setItem(
    "cartItems",
    JSON.stringify(cartItems.length > 0 ? cartItems : [])
  );
};

// Safely sum items, ensuring `fee` is numeric
export const sumItems = (cartItems: CartPet[]) => {
  Storage(cartItems);

  let itemCount = cartItems.length;

  // Convert each `item.fee` to a float before adding.
  let total = cartItems
    .reduce((acc, item) => acc + parseFloat(String(item.fee)), 0)
    .toFixed(2);

  return { itemCount, total };
};

const CartReducer = (state: any, action: CartActionType) => {
  switch (action.type) {
    case ADD_TO_CART:
      // If item not in cart, push it
      if (!state.cartItems.find((item: CartPet) => item._id === action.payload._id)) {
        state.cartItems.push({ ...action.payload });
      }
      return {
        ...state,
        ...sumItems(state.cartItems),
        cartItems: [...state.cartItems],
      };

    case REMOVE_ITEM:
      return {
        ...state,
        ...sumItems(
          state.cartItems.filter((item: CartPet) => item._id !== action.payload._id)
        ),
        cartItems: [
          ...state.cartItems.filter((item: CartPet) => item._id !== action.payload._id),
        ],
      };

    case CHECKOUT:
      return {
        cartItems: [],
        checkout: true,
        ...sumItems([]),
      };

    case CLEAR:
      return {
        cartItems: [],
        ...sumItems([]),
      };

    default:
      return state;
  }
};

export default CartReducer;
