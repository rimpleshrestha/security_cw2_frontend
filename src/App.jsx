import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import SignupPage from "./pages/SignupPage";
import RegisterPage from "./pages/RegisterPage";
import Quiz from "./pages/Quiz";
import AboutUs from "./pages/AboutUs"; // <-- ✅ Import About Us page

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/about" element={<AboutUs />} />{" "}
        {/* <-- ✅ Add About Us route */}
      </Routes>
    </Router>
  );
}

export default App;
