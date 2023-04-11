import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import AppPage from "./AppPage";
import Login from "./Login";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/app" element={<AppPage />} />
      </Routes>
    </Router>
  );
}

export default App;
