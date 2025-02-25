import { Outlet } from "react-router-dom";
import { Navbar } from "./navBar";

// root.tsx
export function RootLayout() {
  return (
    <>
-       <Navbar />
      <Outlet />
    </>
  );
}

