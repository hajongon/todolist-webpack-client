import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import AppPage from "./AppPage";
import Login from "./Login";

function App() {
  // dev 브랜치 테스트
  return (
    <Router basename="/dosomething">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/app" element={<AppPage />} />
      </Routes>
    </Router>
  );
}

export default App;
