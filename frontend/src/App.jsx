
import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserLayout from "./components/Layout/UserLayout.jsx";
import Home from "./pages/Home";
import {Toaster} from "sonner";
import Login from "./pages/Login";
import Register from "./pages/Register.jsx";
import Profile from "./pages/Profile.jsx";
import CollectionPage from "./pages/CollectionPage.jsx";
import ProductDetails from "./components/Products/ProductDetails.jsx";
import Checkout from "./components/Cart/Checkout.jsx";
import OrderConfirmationPage from "./pages/OrderConfirmationPage.jsx";
import OrderDetailsPage from "./pages/OrderDetailsPage.jsx";
import MyOrdersPage from "./pages/MyOrdersPage.jsx";
import AdminLayOut from "./components/Admin/AdminLayOut.jsx";
import AdminSidebar from "./components/Admin/AdminSidebar.jsx";
import AdminHomePage from "./pages/AdminHomePage.jsx";
import UserManagement from "./components/Admin/UserManagement.jsx";
import ProductManagement from "./components/Admin/ProductManagement.jsx";
import EditProductPage from "./components/Admin/EditProductPage.jsx";
import ProtectedRoute from "./components/Common/ProtectedRoute.jsx";


import {Provider} from "react-redux";
import store from "./redux/store.js";

const App = () => {
  return (
    <Provider store={store}>
    <BrowserRouter>
    <Toaster position ="top-right" />
      <Routes>
        <Route path="/" element={<UserLayout />}>
          <Route index element={<Home /> } />
           <Route path="login" element={<Login />} />
           <Route path="register" element={<Register />} />
           <Route path="profile" element={<Profile />} />
           <Route path="collections/:collection" element={<CollectionPage />} />
           <Route path = "product/:id" element={<ProductDetails/>} />
           <Route path = "checkout" element ={<Checkout/>} />
           <Route path = "order/:id" element ={<OrderDetailsPage/>} />
           <Route path = "order-confirmation" element ={<OrderConfirmationPage/>} />
           <Route path = "/my-orders" element ={<MyOrdersPage/>} />

        </Route>
        
        <Route path="/admin" 
        element={<ProtectedRoute role="admin"><AdminLayOut /></ProtectedRoute>}>
        
        <Route index element={<AdminHomePage />} />
        <Route path="users" element = {<UserManagement />} />
        <Route path="products" element = {<ProductManagement />} />
          <Route path="products/:id/edit" element = {<EditProductPage />} />
          
        </Route>
        
      </Routes>
    </BrowserRouter>
     </Provider>
  )
};
export default App;