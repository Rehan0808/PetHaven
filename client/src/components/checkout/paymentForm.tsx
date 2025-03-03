import { useState, useContext } from "react";
import CartContext from "../../context/cartContext/cartContext";
import { Pet } from "../../types"; // or wherever your Pet interface is

export const PaymentForm = () => {
  const [success, setSuccess] = useState(false);
  const [billedAmount, setBilledAmount] = useState<string | undefined>();
  // Store purchased pets so we can display them on success screen
  const [purchasedPets, setPurchasedPets] = useState<Pet[]>([]);

  const { total, cartItems, handleCheckout } = useContext(CartContext);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 1) Copy cart items to local state
    setPurchasedPets(cartItems);
    // 2) Set the billed amount
    setBilledAmount(`$${total}`);
    // 3) Mark payment success
    setSuccess(true);
    // 4) Clear the cart so the nav count goes to zero
    handleCheckout();
  };

  return (
    <>
      {!success ? (
        <div className="my-3 flex flex-col items-center">
          <form onSubmit={handleSubmit}>
            <div className="px-3 mx-auto md:w-10/12">
              <div
                className="
                  w-full 
                  mx-auto 
                  rounded-lg 
                  bg-[#E5E7EB]
                  border 
                  border-gray-300 
                  text-gray-800 
                  font-light 
                  mb-4 
                  shadow-2xl
                "
              >
                <div className="w-full p-3 border-b border-gray-300">
                  {/* Basket total */}
                  <div className="font-bold text-slate-800 my-2 text-xl">
                    Basket Total:
                    <span className="font-semibold"> ${total}</span>
                  </div>

                  {/* Payment Info */}
                  <div className="text-gray-700 font-bold text-lg mb-1">
                    Payment Info
                  </div>

                  {/* Name on card */}
                  <div className="mb-2">
                    <label className="text-gray-700 font-semibold text-sm mb-1 ml-1 block">
                      Name on card
                    </label>
                    <input
                      className="w-full px-2 py-1 mb-1 border border-gray-300 rounded focus:outline-none"
                      placeholder="John Smith"
                      type="text"
                      required
                    />
                  </div>

                  {/* Card number */}
                  <div className="mb-2">
                    <label className="text-gray-700 font-semibold text-sm mb-1 ml-1 block">
                      Card number
                    </label>
                    <input
                      className="w-full px-2 py-1 mb-1 border border-gray-300 rounded focus:outline-none"
                      placeholder="4242 4242 4242 4242"
                      type="text"
                      required
                    />
                  </div>

                  {/* Expiration date & CVC */}
                  <div className="mb-2 flex content-start">
                    <div className="w-2/5">
                      <label className="text-gray-700 font-semibold text-sm mb-1 ml-1 block">
                        Expiration date
                      </label>
                      <input
                        className="w-4/5 px-2 py-1 mb-1 border border-gray-300 rounded focus:outline-none"
                        placeholder="12/29"
                        type="text"
                        required
                      />
                    </div>
                    <div className="w-2/5">
                      <label className="text-gray-700 font-semibold text-sm mb-1 ml-1 block">
                        Security code
                      </label>
                      <input
                        className="w-full px-2 py-1 mb-1 border border-gray-300 rounded focus:outline-none"
                        placeholder="CVC"
                        type="text"
                        required
                      />
                    </div>
                  </div>

                  {/* Delivery Info */}
                  <div className="text-gray-700 font-bold text-lg mb-1">
                    Delivery Info
                  </div>
                  <div className="mb-2">
                    <label className="text-gray-700 font-semibold text-sm mb-1 ml-1 block">
                      Street Address
                    </label>
                    <input
                      className="w-full px-2 py-1 mb-1 border border-gray-300 rounded focus:outline-none"
                      placeholder="123 Main St."
                      type="text"
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <label className="text-gray-700 font-semibold text-sm mb-1 ml-1 block">
                      City
                    </label>
                    <input
                      className="w-full px-2 py-1 mb-1 border border-gray-300 rounded focus:outline-none"
                      placeholder="Hamsterdam"
                      type="text"
                      required
                    />
                  </div>
                  <div className="mb-2 flex flex-row">
                    <div className="flex flex-col mr-2">
                      <label className="text-gray-700 font-semibold text-sm mb-1 ml-1 block">
                        State
                      </label>
                      <input
                        className="w-full px-2 py-1 mb-1 border border-gray-300 rounded focus:outline-none"
                        placeholder="NY"
                        type="text"
                        required
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-gray-700 font-semibold text-sm mb-1 ml-1 block">
                        ZIP
                      </label>
                      <input
                        className="w-full px-2 py-1 mb-1 border border-gray-300 rounded focus:outline-none"
                        placeholder="12345"
                        type="text"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Pay Now button */}
              <div>
                <button
                  type="submit"
                  className="
                    block 
                    w-full 
                    max-w-xs 
                    mx-auto 
                    bg-slate-600 
                    hover:bg-slate-800 
                    focus:bg-slate-800 
                    text-white 
                    rounded 
                    px-3 
                    py-2 
                    font-semibold
                  "
                >
                  Pay Now
                </button>
              </div>
            </div>
          </form>
        </div>
      ) : (
        // Success screen
        <div className="my-3 flex flex-col items-center">
          <h2 className="font-medium text-center leading-tight text-4xl my-2 text-slate-700">
            Thanks for adopting a pet!
          </h2>
          <h3 className="bg-green-100 text-center rounded-lg py-3 px-6 my-3 text-lg font-bold text-green-700">
            Payment of {billedAmount} was successful.
          </h3>

          {/* Just-purchased pets */}
          {purchasedPets.length > 0 && (
            <div className="w-full max-w-lg bg-white border border-gray-300 rounded-lg shadow-lg p-4 mt-4">
              <h4 className="text-xl font-semibold mb-3 text-gray-800">
                Purchased Pet(s):
              </h4>
              {purchasedPets.map((pet) => (
                <div
                  key={pet.id}
                  className="flex items-center mb-3 last:mb-0 border-b pb-3 last:border-none"
                >
                  <img
                    src={
                      pet.image
                        ? `/uploads/${pet.image}`
                        : "/default-image.png"
                    }
                    alt={pet.name || "Adopted pet"}
                    className="w-16 h-16 object-cover rounded mr-3"
                  />
                  <div>
                    <p className="font-medium text-gray-800">
                      {pet.name || "Unnamed Pet"}
                    </p>
                    <p className="text-sm text-gray-600">
                      Species: {pet.species}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};
