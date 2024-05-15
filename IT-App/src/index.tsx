// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import theme from "./flowbite-theme";
import { Flowbite } from "flowbite-react";
import { Routes, Route } from "react-router";
import { BrowserRouter } from "react-router-dom";
import SignInPage from "./pages/authentication/login";
import DevsDashboard from "./pages/devs/devsDashboard";
import Inventory from "./pages/inventory/inventory";
import Category from "./pages/category/category";
import Brand from "./pages/brand/brand";
import Models from "./pages/models/models";
import ITinventory from "./pages/inventory/inventoryIT";

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
        <Route path="/Inventory" element={<Inventory />} />
        <Route path="/ITinventory" element={<ITinventory />} />
        <Route path="/Category" element={<Category />} />
        <Route path="/Brand" element={<Brand />} />
        <Route path="/Models" element={<Models />} />
        </Routes>
      </BrowserRouter>
    </Flowbite>
  // </StrictMode>
);
