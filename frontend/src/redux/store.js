import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/slices/authSlice";
import productReducer from "./slices/productsSlice";
import cartReducer from "./slices/cartSlice";
import checkoutReducer from "./slices/checkoutSlice";
import orderReducer from "./slices/orderSlice";
import adminReducer from "./slices/adminSlice";
import adminProductReducer from "./slices/adminProductSlice";
import adminOrdersReducer from "./slices/adminOrderSlice";

const store = configureStore({
    reducer: {
          auth: authReducer,
          products: productReducer,
          cart: cartReducer,
          checkout: checkoutReducer,
          order: orderReducer,
          admin: adminReducer,
          adminProduct: adminProductReducer,
          adminOrder: adminOrdersReducer,
    },
});

export default store;