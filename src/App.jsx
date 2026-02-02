import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminPanel from "./pages/AdminPanel";
// import ProductsPanel from "./pages/ProductsPanel";
import StoreFront from "./pages/StoreFront";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import ProtectedRoute from "./components/admin/ProtectRoute";

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
      </Routes>
    </Router>
  );
}

export default App;
