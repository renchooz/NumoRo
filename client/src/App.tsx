import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ResultsPage from "./pages/ResultsPage";
import PythagorasGridPage from "./pages/PythagorasGridPage";
import LoshuGridPage from "./pages/LoshuGridPage";
import VedicGridPage from "./pages/VedicGridPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminPage from "./pages/AdminPage";
import RequireAdmin from "./components/RequireAdmin";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/result" element={<ResultsPage />} />
      <Route path="/pythagoras-grid" element={<PythagorasGridPage />} />
      <Route path="/loshu-grid" element={<LoshuGridPage />} />
      <Route path="/vedic-grid" element={<VedicGridPage />} />
      <Route path="/admin-login" element={<AdminLoginPage />} />
      <Route element={<RequireAdmin />}>
        <Route path="/admin" element={<AdminPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
