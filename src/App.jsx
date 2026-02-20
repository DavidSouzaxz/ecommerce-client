import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminPanel from "./pages/AdminPanel";

import StoreFront from "./pages/StoreFront";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import ProtectedRoute from "./pages/admin/ProtectRoute";
import RegisterStore from "./pages/RegisterStore";
import Home from "./pages/Home";
import RegisterUser from "./pages/RegisterUser";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/:slug" element={<StoreFront />} />
        <Route path="/checkout/:slug" element={<Checkout />} />

        <Route
          path="/admin/:slug"
          element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          }
        />
        {/* <Route path="/admin/:slug/products" element={<ProductsPanel />} /> */}
        <Route path="/login" element={<Login />} />

        <Route
          path="/register-store"
          element={
            <ProtectedRoute>
              <RegisterStore />
            </ProtectedRoute>
          }
        />

        <Route path="/register-user" element={<RegisterUser />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
