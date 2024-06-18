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
import UserListPage from "./pages/users/Users";
import AllReports from "./pages/reports/reports";
import Categories from "./pages/categories/categories"

const container = document.getElementById("root");

if (!container) {
  throw new Error("React root element doesn't exist!");
}

const root = createRoot(container);

//Asegurando la session


import { Navigate } from 'react-router-dom';
import CryptoJS from "crypto-js";



const user = localStorage.getItem('badgeSession');





root.render(
  // <StrictMode>
    <Flowbite theme={{ theme }}>
      <BrowserRouter>
        <Routes>
        <Route path="/SignIn" element={<SignInPage />} index />
        <Route
          path="/"
          // element={<DevsDashboard />}
          element={user ? <DevsDashboard /> : <Navigate to="/SignIn" />}
        />
        <Route path="/Inventory" element={ user 
          ? <Inventory />   : <Navigate to= '/SignIn'></Navigate>} />
        <Route path="/ITinventory" element={ user 
          ? <ITinventory /> : <Navigate to= '/SignIn'/>} />
        <Route path="/Category" element={ user 
          ? <Category />    : <Navigate to='/SignIn' />} />
        <Route path="/Brand" element={
            user ? <Brand/> : 
          <Navigate 
            to = 'SignIn'/>} />
        <Route path="/Models" element={
            user ? <Models/> : <Navigate to = '/SignIn'/>} />
        <Route path="/users" element={
            user ? <UserListPage/> : <Navigate to = '/SignIn' />} index/>
        <Route path="/reports" element={
            user ? <AllReports/> : <Navigate to = '/SignIn'/>} index/>
        <Route path="/categories" element={ 
            user ? <Categories/> : <Navigate to= '/SignIn'/>} />
        </Routes>
      </BrowserRouter>
    </Flowbite>
  // </StrictMode>
);
