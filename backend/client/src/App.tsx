// src/App.tsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { RootLayout } from "./components/root";
import { Homepage } from "./components/homepage";
import { PetSearchPage } from "./components/petSearch/petSearchPage";
import { PetPage } from "./components/petSearch/petPage";
import { ErrorPage } from "./components/error";

// Wrap everything in AuthLayout so it has router context
import { AuthLayout } from "./context/userContext/AuthLayout";

import { RegisterForm } from "./components/user/registerForm";
import { LoginFrom } from "./components/user/loginForm";
import { MyAccount } from "./components/user/myAccount";
import { CartPage } from "./components/checkout/cartPage";
import { CheckoutPage } from "./components/checkout/checkoutPage";
// import { About } from "./components/about";
import { Donation } from "./components/donation/Donation";
import { DonationDetail } from "./components/donation/DonationDetail";

// If you're using data loaders:
import { fetchPets, fetchPet } from "./services/api";

const router = createBrowserRouter([
  {
    element: <AuthLayout />,        // <-- AuthProvider is inside here
    errorElement: <ErrorPage />,
    children: [
      {
        element: <RootLayout />,
        children: [
          { path: "/", element: <Homepage /> },
          { path: "/pets", element: <PetSearchPage />, loader: fetchPets },
          { path: "/pet/:id", element: <PetPage />, loader: fetchPet },
          { path: "/users/register", element: <RegisterForm /> },
          { path: "/users/login", element: <LoginFrom /> },
          { path: "/users/my-account", element: <MyAccount /> },
          { path: "/cart", element: <CartPage /> },
          { path: "/checkout", element: <CheckoutPage /> },
          // { path: "/about", element: <About /> },
          { path: "/donation", element: <Donation /> },
          { path: "/donation/:id", element: <DonationDetail /> },
        ],
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
