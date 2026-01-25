import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import SignupPage from "./pages/SignupPage";
import RegisterPage from "./pages/RegisterPage";
import Quiz from "./pages/Quiz";
import AboutUs from "./pages/AboutUs";
// ✅ NEW IMPORTS: Add these so the app knows where these files are
import ProductPage from "./pages/Productpage";
import ProductList from "./pages/ProductList";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/about" element={<AboutUs />} />

        {/* ✅ NEW ROUTES: These must match the paths you use in navigate() */}
        <Route path="/product-page" element={<ProductPage />} />
        <Route path="/product-list" element={<ProductList />} />
      </Routes>
    </Router>
  );
}

export default App;
