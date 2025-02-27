// import { useContext } from "react";
// import { Link } from "react-router-dom";
// import CartContext from "../../context/cartContext/cartContext";
// import { CartPet } from "../../types"; // Import the unified CartPet interface

// /**
//  * We destructure "pet" from props, which is of type CartPet.
//  */
// export const CartItem = (pet: CartPet) => {
//   const { removeFromCart } = useContext(CartContext);

//   return (
//     <li className="flex flex-col py-6 sm:flex-row sm:justify-between">
//       <div className="flex w-full space-x-2 sm:space-x-4">
//         {/* If you store image filename in pet.image, build the path */}
//         <img
//           className="flex-shrink-0 object-cover w-20 h-20 rounded outline-none sm:w-32 sm:h-32"
//           src={`/uploads/${pet.image}`}
//           alt={pet.species + " for adoption."}
//         />

//         <div className="flex flex-col justify-between w-full pb-4">
//           <div className="flex justify-between w-full pb-2 space-x-2">
//             <div className="space-y-1">
//               {/* Use pet._id or pet.id, whichever your routes expect. 
//                  If your route is /pet/123 for Postgres, do pet.id. 
//                  If your route still uses _id, do pet._id. 
//                  Or fallback: pet._id ?? pet.id
//               */}
//               <Link className="no-underline hover:no-underline" to={`/pet/${pet._id ?? pet.id}`}>
//                 <h3 className="text-slate-700 hover:text-slate-800 text-xl font-semibold leading-snug sm:pr-8">
//                   {pet.name}
//                 </h3>
//               </Link>

//               <p className="text-sm">
//                 {pet.species
//                   ? pet.species.charAt(0).toUpperCase() + pet.species.slice(1)
//                   : "Unknown"}
//               </p>
//             </div>

//             <div className="text-right">
//               <p className="text-lg font-medium">${pet.fee}</p>
//               <p className="text-sm">
//                 {pet.gender
//                   ? pet.gender.charAt(0).toUpperCase() + pet.gender.slice(1)
//                   : "Unknown"}
//               </p>
//             </div>
//           </div>

//           <div className="flex text-sm divide-x">
//             <button
//               type="button"
//               onClick={() => removeFromCart(pet)}
//               className="flex items-center px-2 py-1 pl-0 space-x-1"
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 viewBox="50 100 600 400"
//                 className="w-6 h-6 fill-current"
//               >
//                 <g>
//                   <path d="m484.2 167.89h15.422l-88.594-88.594c-2.0781-2.0781-5.5781-2.0781-7.7656 0-1.4219 1.4219-1.6406 3.0625-1.6406 3.8281 0 0.875 0.21875 2.5156 1.6406 3.8281z" />
//                   <path d="m296.73 86.953c1.4219-1.4219 1.6406-3.0625 1.6406-3.8281 0-0.875-0.21875-2.5156-1.6406-3.8281-2.0781-2.0781-5.5781-2.0781-7.7656 0l-88.594 88.594h15.422z" />
//                   <path d="m564.7 189.77h-429.41c-18.047 0-32.812 14.766-32.812 32.812v4.9219c0 18.047 14.766 32.812 32.812 32.812h429.41c18.047 0 32.812-14.766 32.812-32.812v-4.9219c0-18.047-14.766-32.812-32.812-32.812z" />
//                   <path d="m175.55 454.34c2.4062 15.969 16.297 28 32.484 28h284.05c16.188 0 30.078-12.031 32.484-28l25.375-172.16h-399.88zm137.16-83.562h74.484c6.0156 0 10.938 4.9219 10.938 10.938s-4.9219 10.938-10.938 10.938h-74.484c-6.0156 0-10.938-4.9219-10.938-10.938s4.9219-10.938 10.938-10.938z" />
//                 </g>
//               </svg>
//               <span>Remove</span>
//             </button>
//           </div>
//         </div>
//       </div>
//     </li>
//   );
// };

// src/components/checkout/cartItem.tsx

import { useContext } from "react";
import { Link } from "react-router-dom";
import CartContext from "../../context/cartContext/cartContext";
import { CartPet } from "../../types";

export const CartItem = (pet: CartPet) => {
  const { removeFromCart } = useContext(CartContext);

  return (
    <li className="flex flex-col py-6 sm:flex-row sm:justify-between">
      <div className="flex w-full space-x-2 sm:space-x-4">
        <img
          className="flex-shrink-0 object-cover w-20 h-20 rounded outline-none sm:w-32 sm:h-32"
          src={`/uploads/${pet.image}`}
          alt={pet.species + " for adoption."}
        />
        <div className="flex flex-col justify-between w-full pb-4">
          <div className="flex justify-between w-full pb-2 space-x-2">
            <div className="space-y-1">
              {/* 
                Use pet._id if your route expects a string, 
                or fallback to pet.id if you have a numeric ID. 
              */}
              <Link to={`/pet/${pet._id}`}>
                <h3 className="text-slate-700 hover:text-slate-800 text-xl font-semibold leading-snug sm:pr-8">
                  {pet.name}
                </h3>
              </Link>
              <p className="text-sm">
                {pet.species
                  ? pet.species.charAt(0).toUpperCase() + pet.species.slice(1)
                  : "Unknown"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-medium">${pet.fee}</p>
              <p className="text-sm">
                {pet.gender
                  ? pet.gender.charAt(0).toUpperCase() + pet.gender.slice(1)
                  : "Unknown"}
              </p>
            </div>
          </div>
          <div className="flex text-sm divide-x">
            <button
              type="button"
              onClick={() => removeFromCart(pet)}
              className="flex items-center px-2 py-1 pl-0 space-x-1"
            >
              {/* Some SVG */}
              <svg
                    aria-hidden="true"
                    focusable="false"
                    className="w-5 h-5"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 600 512"
                  >
                                        <g fill="currentColor">
                      <path d="m484.2 167.89h15.422l-88.594-88.594c-2.0781-2.0781-5.5781-2.0781-7.7656 0-1.4219 1.4219-1.6406 3.0625-1.6406 3.8281 0 0.875 0.21875 2.5156 1.6406 3.8281z" />
                      <path d="m296.73 86.953c1.4219-1.4219 1.6406-3.0625 1.6406-3.8281 0-0.875-0.21875-2.5156-1.6406-3.8281-2.0781-2.0781-5.5781-2.0781-7.7656 0l-88.594 88.594h15.422z" />
                      <path d="m564.7 189.77h-429.41c-18.047 0-32.812 14.766-32.812 32.812v4.9219c0 18.047 14.766 32.812 32.812 32.812h429.41c18.047 0 32.812-14.766 32.812-32.812v-4.9219c0-18.047-14.766-32.812-32.812-32.812z" />
                      <path d="m350 422.73c39.812-16.297 53.703-43.422 49.656-63.438-2.5156-11.812-10.5-18.922-21.438-18.922-6.5625 0-14.438 2.9531-21.984 8.2031-3.8281 2.625-8.8594 2.625-12.578-0.10938-7.6562-5.4688-15.312-8.4219-22.094-8.4219-10.938 0-18.812 7.1094-21.219 19.141-4.0469 20.344 9.7344 47.688 49.656 63.547z" />
                      <path d="m175.55 454.34c2.4062 15.969 16.297 28 32.484 28h284.05c16.188 0 30.078-12.031 32.484-28l25.375-172.16h-399.88zm103.36-99.422c4.375-22.312 21.219-36.641 42.656-36.641 9.4062 0 19.031 2.8438 28.547 8.4219 9.4062-5.3594 19.031-8.0938 28.219-8.0938 21.328 0 38.172 14.219 42.766 36.312v0.10938c6.0156 29.422-12.031 68.469-65.625 89.141-0.21875 0.10938-0.4375 0.10938-0.65625 0.21875-1.6406 0.54688-3.2812 0.76562-4.9219 0.76562s-3.1719-0.21875-4.9219-0.76562c-0.21875-0.10938-0.32812-0.10938-0.54688-0.21875-53.484-20.344-71.422-59.5-65.516-89.25z" />
                    </g>
          </svg>
              <span className="ml-2 mt-1">Remove</span>
            </button>
          </div>
        </div>
      </div>
    </li>
  );
};
