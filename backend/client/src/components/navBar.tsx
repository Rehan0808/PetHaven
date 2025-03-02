import { useState, useContext } from "react";
import { NavLink, useLocation } from "react-router-dom";
import CartContext from "../context/cartContext/cartContext";
import useAuth from "../context/userContext/useAuth";

export const Navbar = () => {
  const location = useLocation();
  const [navbarOpen, setNavbarOpen] = useState(false);
  const { cartItems } = useContext(CartContext);
  const { user, message, logout } = useAuth();

  return (
    <>
      <nav className="relative flex flex-wrap items-center justify-between px-2 py-3 bg-[#2C3E50]">
        {message && location.pathname !== "/users/login" ? (
          <div
            className="fixed w-1/2 inset-x-0 max-w-max mx-auto top-1 transition-opacity ease-in duration-300 bg-opacity-80 bg-green-100 rounded-lg py-1 px-2 text-base text-green-700"
            role="alert"
          >
            {message}
          </div>
        ) : (
          ""
        )}
        <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
          <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
            <NavLink
              className="text-lg font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap text-white"
              to="/"
            >
              <img src="/logo.svg" alt="" className=" w-40" />
            </NavLink>
            <button
              className="text-white cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
              type="button"
              onClick={() => setNavbarOpen(!navbarOpen)}
            >
              <i className="fas fa-bars"></i>
            </button>
          </div>
          <div
            className={
              "lg:flex flex-grow items-center" + (navbarOpen ? " flex" : " hidden")
            }
            id="example-navbar-danger"
          >
            <ul className="flex flex-col lg:flex-row list-none lg:ml-auto">
              {/* Home Link */}
              <li className="nav-item">
                <NavLink
                  onClick={() => setNavbarOpen(false)}
                  className="px-3 py-2 flex items-center text-s font-bold leading-snug text-white hover:no-underline"
                  to="/"
                >
                  <span className="ml-2">Home</span>
                </NavLink>
              </li>

              {/* Existing navigation items */}
              <li className="nav-item">
                <NavLink
                  onClick={() => setNavbarOpen(false)}
                  className="px-3 py-2 flex items-center text-s font-bold leading-snug text-white hover:no-underline"
                  to="/pets"
                >
                  <span className="ml-2">See All Pets</span>
                </NavLink>
              </li>

              {/* Other pet categories */}
              <li className="nav-item">
                <NavLink
                  onClick={() => setNavbarOpen(false)}
                  className="px-3 py-2 flex items-center text-s font-bold leading-snug text-white hover:no-underline"
                  to="pets/?species=cat"
                >
                  <span className="ml-2">Cats</span>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  onClick={() => setNavbarOpen(false)}
                  className="px-3 py-2 flex items-center text-s font-bold leading-snug text-white hover:no-underline"
                  to="pets/?species=dog"
                >
                  <span className="ml-2">Dogs</span>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  onClick={() => setNavbarOpen(false)}
                  className="px-3 py-2 flex items-center text-s font-bold leading-snug text-white hover:no-underline"
                  to="pets/?species=bunny"
                >
                  <span className="ml-2">Bunnies</span>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  onClick={() => setNavbarOpen(false)}
                  className="px-3 py-2 flex items-center text-s font-bold leading-snug text-white hover:no-underline"
                  to="pets/?species=chicken"
                >
                  <span className="ml-2">Chickens</span>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  onClick={() => setNavbarOpen(false)}
                  className="px-3 py-2 flex items-center text-s font-bold leading-snug text-white hover:no-underline"
                  to="pets/?species=rat"
                >
                  <span className="ml-2">Rats</span>
                </NavLink>
              </li>

              {/* Donation Link */}
              <li className="nav-item">
                <NavLink
                  onClick={() => setNavbarOpen(false)}
                  className="px-3 py-2 flex items-center text-s font-bold leading-snug text-white hover:no-underline"
                  to="/donation"
                >
                  <span className="ml-2">Donation</span>
                </NavLink>
              </li>

              {/* User Profile / Authentication */}
              <li className="nav-item">
                {user ? (
                  <NavLink
                    onClick={() => setNavbarOpen(false)}
                    className="px-3 py-2 flex items-center text-s leading-snug text-white hover:no-underline"
                    to="users/my-account"
                  >
                    <span className="ml-2">My Profile</span>
                  </NavLink>
                ) : (
                  <NavLink
                    onClick={() => setNavbarOpen(false)}
                    className="px-3 py-2 flex items-center text-s leading-snug text-white hover:no-underline"
                    to="users/login"
                  >
                    <span className="ml-2">Login</span>
                  </NavLink>
                )}
              </li>
              <li className="nav-item">
                {user ? (
                  <NavLink
                    className="px-3 py-2 flex items-center text-s leading-snug text-white hover:no-underline"
                    onClick={logout}
                    to="/"
                  >
                    <span className="ml-2">Log Out</span>
                  </NavLink>
                ) : (
                  <NavLink
                    onClick={() => setNavbarOpen(false)}
                    className="px-3 py-2 flex items-center text-s leading-snug text-white hover:opacity-110"
                    to="users/register"
                  >
                    <span className="ml-2">Register</span>
                  </NavLink>
                )}
              </li>

              {/* Cart (Basket) - Kept Intact */}
              <li className="nav-item">
                <NavLink
                  onClick={() => setNavbarOpen(false)}
                  className="px-3 py-1 flex items-center justify-center text-s font-bold leading-snug text-white hover:scale-110 duration-300 hover:no-underline"
                  to="/cart"
                >
                  <svg
                    aria-hidden="true"
                    focusable="false"
                    className="w-10 h-10"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="50 100 600 400"
                  >
                    <g fill="currentColor">
                      <path d="m484.2 167.89h15.422l-88.594-88.594c-2.0781-2.0781-5.5781-2.0781-7.7656 0-1.4219 1.4219-1.6406 3.0625-1.6406 3.8281 0 0.875 0.21875 2.5156 1.6406 3.8281z" />
                    </g>
                  </svg>
                  {cartItems.length > 0 && (
                    <span className="w-5 h-5 rounded-full flex justify-center items-center -ml-3 -mt-6 leading-none text-center whitespace-nowrap bg-[#E67E22] text-white text-xs">
                      {cartItems.length}
                    </span>
                  )}
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};
