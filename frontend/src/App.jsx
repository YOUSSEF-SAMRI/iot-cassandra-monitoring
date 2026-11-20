
import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Sensors from "./pages/Sensors";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/sensors" element={<Sensors />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
