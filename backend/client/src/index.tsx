// src/index.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

// If your CartState doesn't use `useNavigate`, it's safe to keep it here:
import { CartState } from "./context/cartContext/cartState";

import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <React.StrictMode>
    <CartState>
      <App />
    </CartState>
  </React.StrictMode>
);

reportWebVitals();
