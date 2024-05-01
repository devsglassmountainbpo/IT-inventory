// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import theme from "./flowbite-theme";
import { Flowbite } from "flowbite-react";
import { Routes, Route } from "react-router";
import { BrowserRouter } from "react-router-dom";
import SignInPage from "./pages/authentication/login";
import DevsDashboard from "./pages/devs/devsDashboard";

const container = document.getElementById("root");

if (!container) {
  throw new Error("React root element doesn't exist!");
}

const root = createRoot(container);

root.render(
  // <StrictMode>
    <Flowbite theme={{ theme }}>
      <BrowserRouter>
        <Routes>
        <Route path="/SignIn" element={<SignInPage />} index />
        <Route
          path="/"
          element={<DevsDashboard />}
        />
        </Routes>
      </BrowserRouter>
    </Flowbite>
  // </StrictMode>
);
