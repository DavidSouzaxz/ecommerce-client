import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminPanel from "./pages/AdminPanel";
import ProductsPanel from "./pages/ProductsPanel";
import StoreFront from "./pages/StoreFront";
import Checkout from "./pages/Checkout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/:slug" element={<StoreFront />} />
        <Route path="/checkout/:slug" element={<Checkout />} />

        <Route path="/admin/:slug" element={<AdminPanel />} />
        <Route path="/admin/:slug/products" element={<ProductsPanel />} />
      </Routes>
    </Router>
  );
}

export default App;
