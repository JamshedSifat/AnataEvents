import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import "./index.css";
import { router } from "./Router/Route.jsx";
import { RouterProvider } from "react-router";
import { AuthProvider } from "./Auth/Context/AuthContext.jsx";

// The old App.jsx (Vite starter) and ServiceContext (localStorage-backed)
// were removed — see AUDIT.md.

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HelmetProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </HelmetProvider>
  </StrictMode>
);
